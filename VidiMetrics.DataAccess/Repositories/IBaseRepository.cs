using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Storage;

namespace VidiMetrics.DataAccess.Repositories
{
    public interface IBaseRepository<T> where T : class
    {
        Task<T?> GetByIdAsync(Guid id, bool bypassCache = false, TimeSpan? expiration = null);
        Task<IEnumerable<T>> GetAllAsync();
        Task<(IEnumerable<T>, int)> GetAllWithPaginationAsync(
            IQueryable<T> query, 
            int page, 
            int pageSize, 
            string? orderBy, 
            string? sortOrder, 
            int? limit, 
            bool bypassCache = false, 
            TimeSpan? expiration = null);

        Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate);

        Task<T> AddAsync(T entity);

        Task AddRangeAsync(IEnumerable<T> entities);

        T Update(T entity);

        void Remove(T entity);

        void RemoveRange(IEnumerable<T> entities);

        Task<bool> SaveChangesAsync();

        IQueryable<T> Query();

        Task<IDbContextTransaction> BeginTransactionAsync();
    }
}