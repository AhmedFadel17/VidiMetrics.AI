using AutoMapper;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Seo.VideoTags;
using VidiMetrics.Application.Interfaces.Seo;
using VidiMetrics.DataAccess.Repositories.Seo.VideoTags;
using VidiMetrics.Domain.Models.Seo;

namespace VidiMetrics.Application.Services.Seo
{
    public class VideoTagsService : IVideoTagsService
    {
        private readonly IVideoTagsRepository _repository;
        private readonly IMapper _mapper;
        private readonly IValidator<CreateVideoTagDto> _createValidator;
        private readonly IValidator<UpdateVideoTagDto> _updateValidator;

        public VideoTagsService(
            IVideoTagsRepository repository, 
            IMapper mapper,
            IValidator<CreateVideoTagDto> createValidator,
            IValidator<UpdateVideoTagDto> updateValidator)
        {
            _repository = repository;
            _mapper = mapper;
            _createValidator = createValidator;
            _updateValidator = updateValidator;
        }

        public async Task<VideoTagResponseDto> GetByIdAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) throw new Exception("VideoTag not found.");

            return _mapper.Map<VideoTagResponseDto>(entity);
        }

        public async Task<IEnumerable<VideoTagResponseDto>> GetAllAsync()
        {
            var entities = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<VideoTagResponseDto>>(entities);
        }

        public async Task<VideoTagResponseDto> CreateAsync(CreateVideoTagDto dto)
        {
            await _createValidator.ValidateAndThrowAsync(dto);

            var entity = _mapper.Map<VideoTag>(dto);
            // Assuming BaseEntity has CreatedAt or similar if needed, otherwise skip
            // entity.CreatedAt = DateTime.UtcNow; 

            await _repository.AddAsync(entity);
            await _repository.SaveChangesAsync();

            return _mapper.Map<VideoTagResponseDto>(entity);
        }

        public async Task<VideoTagResponseDto> UpdateAsync(Guid id, UpdateVideoTagDto dto)
        {
            await _updateValidator.ValidateAndThrowAsync(dto);

            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) throw new Exception("VideoTag not found.");

            _mapper.Map(dto, entity);

            _repository.Update(entity);
            await _repository.SaveChangesAsync();

            return _mapper.Map<VideoTagResponseDto>(entity);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) throw new Exception("VideoTag not found.");

            _repository.Remove(entity);
            return await _repository.SaveChangesAsync();
        }
    }
}
