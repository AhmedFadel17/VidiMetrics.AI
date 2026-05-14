using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Application.DTOs.StoryEngine.Characters;

namespace VidiMetrics.Application.Interfaces.StoryEngine;

public interface ICharactersService
{
    Task<CharacterResponseDto> GetByIdAsync(Guid id, Guid userId);
    Task<PaginationResponseDto<CharacterResponseDto>> GetAllAsync(CharacterFilterDto filter, Guid userId);
    Task<IEnumerable<LookupDto>> GetLookupAsync(Guid userId, Guid? showId = null);
    Task<CharacterResponseDto> CreateAsync(CreateCharacterDto dto, Guid userId);
    Task<CharacterResponseDto> UpdateAsync(Guid id, UpdateCharacterDto dto, Guid userId);
    Task<bool> DeleteAsync(Guid id, Guid userId);
}
