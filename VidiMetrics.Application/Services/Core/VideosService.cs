using AutoMapper;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Core.Videos;
using VidiMetrics.Application.Interfaces.Core;
using VidiMetrics.DataAccess.Repositories.Core.Videos;
using VidiMetrics.Domain.Models.Core;

namespace VidiMetrics.Application.Services.Core
{
    public class VideosService : IVideosService
    {
        private readonly IVideosRepository _videosRepository;
        private readonly IMapper _mapper;
        private readonly IValidator<CreateVideoDto> _createValidator;
        private readonly IValidator<UpdateVideoDto> _updateValidator;

        public VideosService(
            IVideosRepository videosRepository, 
            IMapper mapper,
            IValidator<CreateVideoDto> createValidator,
            IValidator<UpdateVideoDto> updateValidator)
        {
            _videosRepository = videosRepository;
            _mapper = mapper;
            _createValidator = createValidator;
            _updateValidator = updateValidator;
        }

        public async Task<VideoResponseDto> GetByIdAsync(Guid id)
        {
            var video = await _videosRepository.GetByIdAsync(id);
            if (video == null) throw new Exception("Video not found.");

            return _mapper.Map<VideoResponseDto>(video);
        }

        public async Task<IEnumerable<VideoResponseDto>> GetAllAsync()
        {
            var videos = await _videosRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<VideoResponseDto>>(videos);
        }

        public async Task<VideoResponseDto> CreateAsync(CreateVideoDto dto)
        {
            await _createValidator.ValidateAndThrowAsync(dto);

            var video = _mapper.Map<Video>(dto);
            video.CreatedAt = DateTime.UtcNow;

            await _videosRepository.AddAsync(video);
            await _videosRepository.SaveChangesAsync();

            return _mapper.Map<VideoResponseDto>(video);
        }

        public async Task<VideoResponseDto> UpdateAsync(Guid id, UpdateVideoDto dto)
        {
            await _updateValidator.ValidateAndThrowAsync(dto);

            var video = await _videosRepository.GetByIdAsync(id);
            if (video == null) throw new Exception("Video not found.");

            _mapper.Map(dto, video);

            _videosRepository.Update(video);
            await _videosRepository.SaveChangesAsync();

            return _mapper.Map<VideoResponseDto>(video);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var video = await _videosRepository.GetByIdAsync(id);
            if (video == null) throw new Exception("Video not found.");

            video.IsDeleted = true;
            _videosRepository.Update(video);

            return await _videosRepository.SaveChangesAsync();
        }
    }
}
