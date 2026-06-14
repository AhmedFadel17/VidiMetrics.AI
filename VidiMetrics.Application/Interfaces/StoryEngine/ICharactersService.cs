using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Application.DTOs.StoryEngine.Characters;

namespace VidiMetrics.Application.Interfaces.StoryEngine;

public interface ICharactersService
{
    Task<CharacterResponseDto> GetByIdAsync(Guid userId, Guid id, CancellationToken ct = default);
    Task<PaginationResponseDto<CharacterResponseDto>> GetAllAsync(Guid userId, CharacterFilterDto filter, CancellationToken ct = default);
    Task<IEnumerable<LookupDto>> GetLookupAsync(Guid userId, Guid? showId = null, CancellationToken ct = default);
    Task<CharacterResponseDto> CreateAsync(Guid userId, CreateCharacterDto dto);
    Task<CharacterResponseDto> UpdateAsync(Guid userId, Guid id, UpdateCharacterDto dto);
    Task<bool> DeleteAsync(Guid userId, Guid id);
}
