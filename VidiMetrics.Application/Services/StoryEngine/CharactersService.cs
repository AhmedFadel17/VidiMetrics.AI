using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Application.DTOs.StoryEngine.Characters;
using VidiMetrics.Application.Interfaces.StoryEngine;
using VidiMetrics.DataAccess.Repositories.Ai.AiImages;
using VidiMetrics.DataAccess.Repositories.StoryEngine.Characters;
using VidiMetrics.DataAccess.Repositories.StoryEngine.Shows;
using VidiMetrics.Domain.Enums;
using VidiMetrics.Domain.Models.StoryEngine;

namespace VidiMetrics.Application.Services.StoryEngine
{
    public class CharactersService : ICharactersService
    {
        private readonly ICharactersRepository _repository;
        private readonly IShowsRepository _showsRepository;
        private readonly IAiImagesRepository _imagesRepository;
        private readonly IMapper _mapper;
        private readonly IValidator<CreateCharacterDto> _createValidator;
        private readonly IValidator<UpdateCharacterDto> _updateValidator;

        public CharactersService(
            ICharactersRepository repository,
            IShowsRepository showsRepository,
            IAiImagesRepository imagesRepository,
            IMapper mapper,
            IValidator<CreateCharacterDto> createValidator,
            IValidator<UpdateCharacterDto> updateValidator)
        {
            _showsRepository = showsRepository;
            _repository = repository;
            _imagesRepository = imagesRepository;
            _mapper = mapper;
            _createValidator = createValidator;
            _updateValidator = updateValidator;
        }

        public async Task<CharacterResponseDto> GetByIdAsync(Guid id, Guid userId)
        {
            var entity = await _repository.Query()
                .Include(x => x.AiImage)
                .Include(x => x.VoiceProfile)
                .FirstOrDefaultAsync(s => s.Id == id && s.Show.UserId == userId);
            if (entity == null) throw new Exception("Character not found.");
            return _mapper.Map<CharacterResponseDto>(entity);
        }

        public async Task<PaginationResponseDto<CharacterResponseDto>> GetAllAsync(CharacterFilterDto filter, Guid userId)
        {
            IQueryable<Character> query = _repository.Query()
                .Include(x => x.AiImage)
                .Include(x => x.VoiceProfile);

            query = query.Where(x => x.Show.UserId == userId);
            if (filter.ShowId.HasValue)
            {
                query = query.Where(x => x.ShowId == filter.ShowId.Value);
            }

            if (!string.IsNullOrWhiteSpace(filter.SearchTerm))
            {
                query = query.Where(x => x.Name.ToLower().Contains(filter.SearchTerm.ToLower()) ||

                                       x.Role.ToLower().Contains(filter.SearchTerm.ToLower()) ||
                                       x.PersonalityTraits.ToLower().Contains(filter.SearchTerm.ToLower()));
            }

            if (filter.CreatedAfter.HasValue)
            {
                query = query.Where(x => x.CreatedAt >= filter.CreatedAfter.Value);
            }

            if (filter.CreatedBefore.HasValue)
            {
                query = query.Where(x => x.CreatedAt <= filter.CreatedBefore.Value);
            }

            var (entities, totalCount) = await _repository.GetAllWithPaginationAsync(
                query,
                filter.PageNumber,
                filter.PageSize,
                filter.OrderBy,
                filter.SortOrder,
                filter.Limit);

            var paginationSource = new PaginationSource<Character>(entities.ToList(), filter.PageNumber, filter.PageSize, totalCount);
            return _mapper.Map<PaginationResponseDto<CharacterResponseDto>>(paginationSource);
        }

        public async Task<IEnumerable<LookupDto>> GetLookupAsync(Guid userId, Guid? showId = null)
        {
            IQueryable<Character> query = _repository.Query()
                .Include(x => x.AiImage);

            query = query.Where(x => x.Show.UserId == userId);
            if (showId.HasValue)
            {
                query = query.Where(x => x.ShowId == showId.Value);
            }

            return await query
                .OrderBy(x => x.Name)
                .Select(x => new LookupDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    ImageUrl = x.ReferenceImageUrl
                })
                .ToListAsync();
        }

        public async Task<CharacterResponseDto> CreateAsync(CreateCharacterDto dto, Guid userId)
        {
            await _createValidator.ValidateAndThrowAsync(dto);
            var showExists = await _showsRepository.Query()
                            .AnyAsync(s => s.Id == dto.ShowId && s.UserId == userId);

            if (!showExists) throw new UnauthorizedAccessException("Invalid Show selection or access denied.");

            var image = await _imagesRepository.Query()
                            .FirstOrDefaultAsync(s => s.Id == dto.AiImageId && s.UserId == userId);
            if (image == null) throw new UnauthorizedAccessException("Invalid Image selection or access denied.");
            image.IsLinked = true;
            _imagesRepository.Update(image);
            await _imagesRepository.SaveChangesAsync();




            var entity = _mapper.Map<Character>(dto);
            entity.CreatedAt = DateTime.UtcNow;

            await _repository.AddAsync(entity);
            await _repository.SaveChangesAsync();

            return _mapper.Map<CharacterResponseDto>(entity);
        }

        public async Task<CharacterResponseDto> UpdateAsync(Guid id, UpdateCharacterDto dto, Guid userId)
        {
            await _updateValidator.ValidateAndThrowAsync(dto);

            var entity = await _repository.Query()
                            .FirstOrDefaultAsync(x => x.Id == id && x.Show.UserId == userId);
            if (entity == null) throw new Exception("Character not found.");

            _mapper.Map(dto, entity);
            entity.UpdatedAt = DateTime.UtcNow;

            _repository.Update(entity);
            await _repository.SaveChangesAsync();

            return _mapper.Map<CharacterResponseDto>(entity);
        }

        public async Task<bool> DeleteAsync(Guid id, Guid userId)
        {
            var entity = await _repository.Query()
                            .FirstOrDefaultAsync(x => x.Id == id && x.Show.UserId == userId);
            if (entity == null) throw new Exception("Character not found.");

            _repository.Remove(entity);
            return await _repository.SaveChangesAsync();
        }
    }
}
