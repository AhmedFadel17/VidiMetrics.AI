using AutoMapper;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.StoryEngine.Shows;
using VidiMetrics.Application.Interfaces.StoryEngine;
using VidiMetrics.DataAccess.Repositories.StoryEngine.Shows;
using VidiMetrics.Domain.Models.StoryEngine;

namespace VidiMetrics.Application.Services.StoryEngine
{
    public class ShowsService : IShowsService
    {
        private readonly IShowsRepository _repository;
        private readonly IMapper _mapper;
        private readonly IValidator<CreateShowDto> _createValidator;
        private readonly IValidator<UpdateShowDto> _updateValidator;

        public ShowsService(
            IShowsRepository repository, 
            IMapper mapper,
            IValidator<CreateShowDto> createValidator,
            IValidator<UpdateShowDto> updateValidator)
        {
            _repository = repository;
            _mapper = mapper;
            _createValidator = createValidator;
            _updateValidator = updateValidator;
        }

        public async Task<ShowResponseDto> GetByIdAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) throw new Exception("Show not found.");

            return _mapper.Map<ShowResponseDto>(entity);
        }

        public async Task<IEnumerable<ShowResponseDto>> GetAllAsync()
        {
            var entities = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<ShowResponseDto>>(entities);
        }

        public async Task<ShowResponseDto> CreateAsync(CreateShowDto dto)
        {
            await _createValidator.ValidateAndThrowAsync(dto);

            var entity = _mapper.Map<Show>(dto);
            // Assuming BaseEntity has CreatedAt or similar if needed, otherwise skip
            // entity.CreatedAt = DateTime.UtcNow; 

            await _repository.AddAsync(entity);
            await _repository.SaveChangesAsync();

            return _mapper.Map<ShowResponseDto>(entity);
        }

        public async Task<ShowResponseDto> UpdateAsync(Guid id, UpdateShowDto dto)
        {
            await _updateValidator.ValidateAndThrowAsync(dto);

            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) throw new Exception("Show not found.");

            _mapper.Map(dto, entity);

            _repository.Update(entity);
            await _repository.SaveChangesAsync();

            return _mapper.Map<ShowResponseDto>(entity);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) throw new Exception("Show not found.");

            _repository.Remove(entity);
            return await _repository.SaveChangesAsync();
        }
    }
}
