using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using VidiMetrics.Application.DTOs.Ai.AiScripts;
using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Application.Interfaces.Ai;
using VidiMetrics.Application.Providers.NotificationsProviders;
using VidiMetrics.DataAccess.Repositories.Ai.AiScripts;
using VidiMetrics.DataAccess.Repositories.StoryEngine.Characters;
using VidiMetrics.DataAccess.Repositories.StoryEngine.Locations;
using VidiMetrics.Domain.Enums;
using VidiMetrics.Domain.Models.Ai;
using VidiMetrics.Domain.Models.StoryEngine;

namespace VidiMetrics.Application.Services.Ai;

public class AiScriptsService : IAiScriptsService
{
    private readonly IMapper _mapper;
    private readonly IAiScriptsRepository _repo;
    private readonly ICharactersRepository _charactersRepository;
    private readonly ILocationsRepository _locationsRepository;
    private readonly IValidator<CreateAiScriptDto> _createValidator;
    private readonly IValidator<UpdateAiScriptDto> _updateValidator;
    private readonly INotificationProvider _notificationProvider;

    public AiScriptsService(
        IMapper mapper,
        IAiScriptsRepository repo,
        ICharactersRepository charactersRepository,
        ILocationsRepository locationsRepository,
        IValidator<CreateAiScriptDto> createValidator,
        IValidator<UpdateAiScriptDto> updateValidator,
        INotificationProvider notificationProvider)
    {
        _mapper = mapper;
        _repo = repo;
        _charactersRepository = charactersRepository;
        _locationsRepository = locationsRepository;
        _createValidator = createValidator;
        _updateValidator = updateValidator;
        _notificationProvider = notificationProvider;
    }

    public async Task<AiScriptResponseDto> CreateAsync(Guid userId, CreateAiScriptDto dto)
    {
        await _createValidator.ValidateAndThrowAsync(dto);

        // 1. Validate Location authority
        var location = await _locationsRepository.Query()
            .Include(e => e.Show)
            .FirstOrDefaultAsync(e => e.Id == dto.LocationId && e.Show.UserId == userId);

        if (location == null)
        {
            throw new UnauthorizedAccessException("Location not found or access denied.");
        }

        // 2. Validate Character IDs and character consistency
        var allCharacterIds = dto.CharacterIds
            .Concat(dto.ScriptLines.Where(l => l.CharacterId.HasValue).Select(l => l.CharacterId!.Value))
            .Distinct()
            .ToList();

        var characters = new List<Character>();
        if (allCharacterIds.Any())
        {
            characters = await _charactersRepository.Query()
                .Where(c => allCharacterIds.Contains(c.Id) && c.ShowId == location.ShowId)
                .ToListAsync();

            if (characters.Count != allCharacterIds.Count)
            {
                throw new InvalidOperationException("One or more characters were not found or do not belong to the same show.");
            }
        }

        // 3. Generate Visual Prompt
        var visualPrompt = GenerateVisualPrompt(dto, location, characters);

        // 4. Map and save entity
        var script = _mapper.Map<AiScript>(dto);
        script.CreatedAt = DateTime.UtcNow;
        script.UserId = userId;
        script.LocationId = location.Id;
        script.VisualPrompt = visualPrompt;

        await _repo.AddAsync(script);
        await _repo.SaveChangesAsync();

        await _notificationProvider.SendInAppNotificationAsync(
            userId,
            "Script Generated",
            $"Your AI Script has been generated successfully.",
            NotificationType.Success,
            true,
            $"User {userId} generated a new AI Script."
        );

        return await GetByIdAsync(userId, script.Id);
    }

    public async Task<bool> DeleteAsync(Guid userId, Guid id)
    {
        var entity = await _repo.Query().FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);
        if (entity == null) throw new KeyNotFoundException("Script not found.");

        _repo.Remove(entity);
        var isSuccess = await _repo.SaveChangesAsync();
        if (isSuccess)
        {
            await _notificationProvider.SendInAppNotificationAsync(
                userId,
                "Script Deleted",
                $"Your script has been successfully deleted.",
                NotificationType.Success
            );
        }
        return isSuccess;
    }

    public async Task<PaginationResponseDto<AiScriptResponseDto>> GetAllAsync(Guid userId, AiScriptFilterDto filter, CancellationToken ct = default)
    {
        IQueryable<AiScript> query = _repo.Query();
        query = query.Where(x => x.UserId == userId);
        if (filter.IsLinked.HasValue)
        {
            query = query.Where(x => x.IsLinked == filter.IsLinked.Value);
        }
        query = query
            .Include(x => x.Location)
                .ThenInclude(x => x.AiImage)
            .Include(x => x.ScriptLines);

        var (entities, totalCount) = await _repo.GetAllWithPaginationAsync(
            query,
            filter.PageNumber,
            filter.PageSize,
            filter.OrderBy,
            filter.SortOrder,
            filter.Limit,
            cancellationToken: ct);


        var paginationSource = new PaginationSource<AiScript>(entities.ToList(), filter.PageNumber, filter.PageSize, totalCount);
        return _mapper.Map<PaginationResponseDto<AiScriptResponseDto>>(paginationSource);
    }

    public async Task<AiScriptResponseDto> GetByIdAsync(Guid userId, Guid id, CancellationToken ct = default)
    {
        var entity = await _repo.Query()
            .Include(x => x.Location)
            .Include(x => x.ScriptLines)
            .FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId, cancellationToken: ct);

        if (entity == null) throw new KeyNotFoundException("Script not found.");

        return _mapper.Map<AiScriptResponseDto>(entity);
    }

    public async Task<AiScriptResponseDto> UpdateAsync(Guid userId, Guid id, UpdateAiScriptDto dto)
    {
        await _updateValidator.ValidateAndThrowAsync(dto);

        var entity = await _repo.Query().FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);
        if (entity == null) throw new KeyNotFoundException("Script not found.");

        _mapper.Map(dto, entity);
        entity.UpdatedAt = DateTime.UtcNow;

        _repo.Update(entity);
        await _repo.SaveChangesAsync();

        return await GetByIdAsync(userId, entity.Id);
    }

    private string GenerateVisualPrompt(CreateAiScriptDto dto, Location location, List<Character> characters)
    {
        var promptBuilder = new StringBuilder();
        promptBuilder.AppendLine("Professional cinematic scene.");
        promptBuilder.AppendLine($"Weather: {dto.Weather}");
        promptBuilder.AppendLine($"Location Atmosphere: {location.Atmosphere}");
        promptBuilder.AppendLine($"Location Description: {location.VisualDescription}. {dto.EnvironmentDescription}");

        if (characters.Any())
        {
            var charDescriptions = characters.Select(c => $"{c.Name} ({c.PhysicalDescription}, wearing {c.ClothingStyle}, {c.PersonalityTraits})");
            promptBuilder.AppendLine($"Characters present: {string.Join(", ", charDescriptions)}");
        }

        if (dto.ScriptLines.Any())
        {
            promptBuilder.AppendLine("Scene Flow:");
            foreach (var line in dto.ScriptLines.OrderBy(l => l.Sequence))
            {
                if (line.Type == ScriptLineType.Character && line.CharacterId.HasValue)
                {
                    var speaker = characters.FirstOrDefault(c => c.Id == line.CharacterId.Value);
                    var speakerName = speaker?.Name ?? "Character";
                    var statusStr = string.IsNullOrWhiteSpace(line.CharacterStatus) ? "" : $" ({line.CharacterStatus})";
                    promptBuilder.AppendLine($"- {speakerName}{statusStr}: \"{line.Content}\"");
                }
                else
                {
                    promptBuilder.AppendLine($"- [Action]: {line.Content}");
                }
            }
        }

        promptBuilder.AppendLine("Cinematography: Cinematic camera movement, photorealistic, 8k resolution, highly detailed, volumetric lighting, masterpiece.");
        return promptBuilder.ToString();
    }
}