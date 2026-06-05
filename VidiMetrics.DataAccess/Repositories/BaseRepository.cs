using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using VidiMetrics.DataAccess.Data;
using VidiMetrics.DataAccess.Extensions;
using VidiMetrics.DataAccess.Providers.Cashing;

namespace VidiMetrics.DataAccess.Repositories
{
    public class BaseRepository<T> : IBaseRepository<T> where T : class
    {
        protected readonly AppDbContext _context;
        protected readonly DbSet<T> _dbSet;
        protected readonly ICacheProvider _cacheProvider; 
        private readonly TimeSpan _defaultCacheDuration = TimeSpan.FromMinutes(10);

        public BaseRepository(AppDbContext context, ICacheProvider cacheProvider)
        {
            _context = context;
            _dbSet = _context.Set<T>();
            _cacheProvider = cacheProvider;
        }

        public IQueryable<T> Query()
        {
            return _dbSet.AsQueryable();
        }

        public async Task<T?> GetByIdAsync(Guid id, bool bypassCache = false, TimeSpan? expiration = null)
        {
            if (bypassCache)
            {
                return await _dbSet.FindAsync(id);
            }

            string cacheKey = $"db:{typeof(T).Name}:{id}";
            var cachedEntity = await _cacheProvider.GetAsync<T>(cacheKey);
            if (cachedEntity != null)
            {
                return cachedEntity;
            }

            var entity = await _dbSet.FindAsync(id);
            if (entity != null)
            {
                var ttl = expiration ?? _defaultCacheDuration;
                await _cacheProvider.SetAsync(cacheKey, entity, ttl);
            }
            return entity;
        }

        public async Task<IEnumerable<T>> GetAllAsync()
        {
            return await _dbSet.ToListAsync();
        }

        public async Task<(IEnumerable<T>, int)> GetAllWithPaginationAsync(
            IQueryable<T> query, 
            int page, 
            int pageSize, 
            string? orderBy, 
            string? sortOrder, 
            int? limit,
            bool bypassCache = false,
            TimeSpan? expiration = null)
        {
            string paginationKey = $"db:{typeof(T).Name}:page_{page}:size_{pageSize}:sort_{orderBy ?? "none"}_{sortOrder ?? "none"}:limit_{limit ?? 0}";

            if (!bypassCache)
            {
                var cachedResult = await _cacheProvider.GetAsync<PaginatedCacheWrapper<T>>(paginationKey);
                if (cachedResult != null)
                {
                    return (cachedResult.Items, cachedResult.TotalCount);
                }
            }

            int totalCount = await query.CountAsync();
            query = query.ApplyOrdering(orderBy, sortOrder);
            
            if (limit != null)
            {
                query = query.Take(limit.Value);
            }
            else
            {
                query = query.ApplyPagination(page, pageSize);
            }
            var items = await query.ToListAsync();

            if (!bypassCache)
            {
                var wrapperToCache = new PaginatedCacheWrapper<T> { Items = items, TotalCount = totalCount };
                var ttl = expiration ?? _defaultCacheDuration;
                
                await _cacheProvider.SetAsync(paginationKey, wrapperToCache, ttl);
                await TrackPaginationCacheKeyAsync(paginationKey);
            }

            return (items, totalCount);
        }

        public async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate)
        {
            return await _dbSet.Where(predicate).ToListAsync();
        }

        public async Task<T> AddAsync(T entity)
        {
            await _dbSet.AddAsync(entity);
            EvictCacheEntry(entity);
            return entity;
        }

        public async Task AddRangeAsync(IEnumerable<T> entities)
        {
            await _dbSet.AddRangeAsync(entities);
            foreach (var entity in entities)
            {
                EvictCacheEntry(entity);
            }
        }

        public T Update(T entity)
        {
            _context.Entry(entity).State = EntityState.Modified;
            EvictCacheEntry(entity);
            
            return entity;
        }

        public void Remove(T entity)
        {
            _dbSet.Remove(entity);
            EvictCacheEntry(entity);
        }

        public void RemoveRange(IEnumerable<T> entities)
        {
            _dbSet.RemoveRange(entities);
            foreach (var entity in entities)
            {
                EvictCacheEntry(entity);
            }
        }

        public async Task<bool> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<IDbContextTransaction> BeginTransactionAsync()
        {
            return await _context.Database.BeginTransactionAsync();
        }

        #region Private Helpers

        private async Task TrackPaginationCacheKeyAsync(string newPaginationKey)
        {
            string registryKey = $"db:{typeof(T).Name}:all_pagination_keys";
            var currentRegistry = await _cacheProvider.GetAsync<List<string>>(registryKey) ?? new List<string>();
            
            if (!currentRegistry.Contains(newPaginationKey))
            {
                currentRegistry.Add(newPaginationKey);
                await _cacheProvider.SetAsync(registryKey, currentRegistry, TimeSpan.FromDays(1));
            }
        }

        private void EvictCacheEntry(T entity)
        {
            var idProperty = entity.GetType().GetProperty("Id");
            if (idProperty == null) return;
            
            var idValue = idProperty.GetValue(entity)?.ToString();
            if (string.IsNullOrEmpty(idValue)) return;

            string singleKey = $"db:{typeof(T).Name}:{idValue}";
            Task.Run(() => _cacheProvider.RemoveAsync(singleKey));

            Task.Run(async () => 
            {
                string registryKey = $"db:{typeof(T).Name}:all_pagination_keys";
                var activePaginationKeys = await _cacheProvider.GetAsync<List<string>>(registryKey);
                
                if (activePaginationKeys != null)
                {
                    foreach (var pageKey in activePaginationKeys)
                    {
                        await _cacheProvider.RemoveAsync(pageKey);
                    }
                    await _cacheProvider.RemoveAsync(registryKey);
                }
            });
        }

        #endregion
    }

    public class PaginatedCacheWrapper<TEntity>
    {
        public IEnumerable<TEntity> Items { get; set; } = new List<TEntity>();
        public int TotalCount { get; set; }
    }
}