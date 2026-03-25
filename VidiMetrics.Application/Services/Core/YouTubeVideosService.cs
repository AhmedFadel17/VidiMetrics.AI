using AutoMapper;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Core.YouTubeVideos;
using VidiMetrics.Application.Interfaces.Core;
using VidiMetrics.DataAccess.Repositories.Core.YouTubeVideos;
using VidiMetrics.Domain.Models.Core;

namespace VidiMetrics.Application.Services.Core
{
    public class YouTubeVideosService : IYouTubeVideosService
    {
        private readonly IYouTubeVideosRepository _repository;
        private readonly IMapper _mapper;
        private readonly IValidator<CreateYouTubeVideoDto> _createValidator;
        private readonly IValidator<UpdateYouTubeVideoDto> _updateValidator;

        public YouTubeVideosService(
            IYouTubeVideosRepository repository, 
            IMapper mapper,
            IValidator<CreateYouTubeVideoDto> createValidator,
            IValidator<UpdateYouTubeVideoDto> updateValidator)
        {
            _repository = repository;
            _mapper = mapper;
            _createValidator = createValidator;
            _updateValidator = updateValidator;
        }

        public async Task<YouTubeVideoResponseDto> GetByIdAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) throw new Exception("YouTubeVideo not found.");

            return _mapper.Map<YouTubeVideoResponseDto>(entity);
        }

        public async Task<IEnumerable<YouTubeVideoResponseDto>> GetAllAsync()
        {
            var entities = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<YouTubeVideoResponseDto>>(entities);
        }

        public async Task<YouTubeVideoResponseDto> CreateAsync(CreateYouTubeVideoDto dto)
        {
            await _createValidator.ValidateAndThrowAsync(dto);

            var entity = _mapper.Map<YouTubeVideo>(dto);
            // Assuming BaseEntity has CreatedAt or similar if needed, otherwise skip
            // entity.CreatedAt = DateTime.UtcNow; 

            await _repository.AddAsync(entity);
            await _repository.SaveChangesAsync();

            return _mapper.Map<YouTubeVideoResponseDto>(entity);
        }

        public async Task<YouTubeVideoResponseDto> UpdateAsync(Guid id, UpdateYouTubeVideoDto dto)
        {
            await _updateValidator.ValidateAndThrowAsync(dto);

            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) throw new Exception("YouTubeVideo not found.");

            _mapper.Map(dto, entity);

            _repository.Update(entity);
            await _repository.SaveChangesAsync();

            return _mapper.Map<YouTubeVideoResponseDto>(entity);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) throw new Exception("YouTubeVideo not found.");

            _repository.Remove(entity);
            return await _repository.SaveChangesAsync();
        }
    }
}
