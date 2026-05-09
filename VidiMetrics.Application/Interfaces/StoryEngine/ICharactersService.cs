using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Application.DTOs.StoryEngine.Characters;

namespace VidiMetrics.Application.Interfaces.StoryEngine;

public interface ICharactersService
{
    Task<CharacterResponseDto> GetByIdAsync(Guid id);
    Task<PaginationResponseDto<CharacterResponseDto>> GetAllAsync(CharacterFilterDto filter);
    Task<CharacterResponseDto> CreateAsync(CreateCharacterDto dto);
    Task<CharacterResponseDto> UpdateAsync(Guid id, UpdateCharacterDto dto);
    Task<bool> DeleteAsync(Guid id);
}
