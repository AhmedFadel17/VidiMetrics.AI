using System;
using System.Collections.Generic;
using System.Linq;
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
using VidiMetrics.DataAccess.Repositories.StoryEngine.StoryEnvironments;
using VidiMetrics.Domain.Enums;
using VidiMetrics.Domain.Models.Ai;
using VidiMetrics.Domain.Models.StoryEngine;

namespace VidiMetrics.Application.Services.Ai
{
    public class AiScriptsService : IAiScriptsService
    {
        private readonly IMapper _mapper;
        private readonly IAiScriptsRepository _repo;
        private readonly ICharactersRepository _charactersRepository;
        private readonly IStoryEnvironmentsRepository _storyEnvironmentsRepository;
        private readonly IValidator<CreateAiScriptDto> _createValidator;
        private readonly IValidator<UpdateAiScriptDto> _updateValidator;
        private readonly INotificationProvider _notificationProvider;

        public AiScriptsService(
            IMapper mapper,
            IAiScriptsRepository repo,
            ICharactersRepository charactersRepository,
            IStoryEnvironmentsRepository storyEnvironmentsRepository,
            IValidator<CreateAiScriptDto> createValidator,
            IValidator<UpdateAiScriptDto> updateValidator,
            INotificationProvider notificationProvider)
        {
            _mapper = mapper;
            _repo = repo;
            _charactersRepository = charactersRepository;
            _storyEnvironmentsRepository = storyEnvironmentsRepository;
            _createValidator = createValidator;
            _updateValidator = updateValidator;
            _notificationProvider = notificationProvider;
        }

        public async Task<AiScriptResponseDto> CreateAsync(CreateAiScriptDto dto, Guid userId)
        {
            await _createValidator.ValidateAndThrowAsync(dto);

            // 1. Validate StoryEnvironment authority
            var environment = await _storyEnvironmentsRepository.Query()
                .Include(e => e.Show)
                .FirstOrDefaultAsync(e => e.Id == dto.StoryEnvironmentId && e.Show.UserId == userId);

            if (environment == null)
            {
                throw new Exception("Story environment not found or access denied.");
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
                    .Where(c => allCharacterIds.Contains(c.Id) && c.ShowId == environment.ShowId)
                    .ToListAsync();

                if (characters.Count != allCharacterIds.Count)
                {
                    throw new Exception("One or more characters were not found or do not belong to the same show.");
                }
            }

            // 3. Generate Visual Prompt
            var visualPrompt = GenerateVisualPrompt(dto, environment, characters);

            // 4. Map and save entity
            var script = _mapper.Map<AiScript>(dto);
            script.CreatedAt = DateTime.UtcNow;
            script.UserId = userId;
            script.StoryEnvironmentId = environment.Id;
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

            return await GetByIdAsync(script.Id, userId);
        }

        public async Task<bool> DeleteAsync(Guid id, Guid userId)
        {
            var entity = await _repo.Query()
                .FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);
            if (entity == null) throw new Exception("Script not found.");

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

        public async Task<PaginationResponseDto<AiScriptResponseDto>> GetAllAsync(AiScriptFilterDto filter, Guid userId)
        {
            IQueryable<AiScript> query = _repo.Query();
            query = query.Where(x => x.UserId == userId);
            if (filter.IsLinked.HasValue)
            {
                query = query.Where(x => x.IsLinked == filter.IsLinked.Value);
            }
            query = query
                .Include(x => x.StoryEnvironment).
                ThenInclude(x => x.AiImage)
                .Include(x => x.ScriptLines);
            var (entities, totalCount) = await _repo.GetAllWithPaginationAsync(
                query,
                filter.PageNumber,
                filter.PageSize,
                filter.OrderBy,
                filter.SortOrder,
                filter.Limit);
            var paginationSource = new PaginationSource<AiScript>(entities.ToList(), filter.PageNumber, filter.PageSize, totalCount);

            return _mapper.Map<PaginationResponseDto<AiScriptResponseDto>>(paginationSource);
        }

        public async Task<AiScriptResponseDto> GetByIdAsync(Guid id, Guid userId)
        {
            var entity = await _repo.Query()
                .Include(x => x.StoryEnvironment)
                .Include(x => x.ScriptLines)
                .FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);

            if (entity == null) throw new Exception("Script not found.");

            return _mapper.Map<AiScriptResponseDto>(entity);
        }

        public async Task<AiScriptResponseDto> UpdateAsync(Guid id, UpdateAiScriptDto dto, Guid userId)
        {
            await _updateValidator.ValidateAndThrowAsync(dto);

            var entity = await _repo.Query()
                .FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);
            if (entity == null) throw new Exception("Script not found.");

            _mapper.Map(dto, entity);
            entity.UpdatedAt = DateTime.UtcNow;

            _repo.Update(entity);
            await _repo.SaveChangesAsync();

            return await GetByIdAsync(entity.Id, userId);
        }

        private string GenerateVisualPrompt(CreateAiScriptDto dto, StoryEnvironment environment, List<Character> characters)
        {
            var promptBuilder = new System.Text.StringBuilder();
            promptBuilder.AppendLine("Professional cinematic scene.");
            promptBuilder.AppendLine($"Weather: {dto.Weather}");
            promptBuilder.AppendLine($"Environment Atmosphere: {environment.Atmosphere}");
            promptBuilder.AppendLine($"Environment Description: {environment.VisualDescription}. {dto.EnvironmentDescription}");

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
                    if (line.Type == VidiMetrics.Domain.Enums.ScriptLineType.Character && line.CharacterId.HasValue)
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
}
