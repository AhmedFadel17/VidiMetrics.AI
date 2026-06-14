using System.Text.Json;
using System.Text.Json.Serialization;
using FluentValidation;
using VidiMetrics.Application.DTOs.Ai;
using VidiMetrics.Application.DTOs.Ai.AiScripts;
using VidiMetrics.Application.DTOs.StoryEngine;
using VidiMetrics.Application.DTOs.StoryEngine.Characters;
using VidiMetrics.Application.DTOs.StoryEngine.Episodes;
using VidiMetrics.Application.DTOs.StoryEngine.Locations;
using VidiMetrics.Application.DTOs.StoryEngine.Scenes;
using VidiMetrics.Application.DTOs.StoryEngine.Shows;
using VidiMetrics.Application.Interfaces.Copilot;
using VidiMetrics.Domain.Enums.Copilot;
using VidiMetrics.Domain.Models.Copilot;

namespace VidiMetrics.Application.Services.Copilot
{
    public class CopilotPayloadValidationService : ICopilotPayloadValidationService
    {
        private readonly IValidator<CreateShowDto> _createShowValidator;
        private readonly IValidator<UpdateShowDto> _updateShowValidator;

        private readonly IValidator<CreateCharacterDto> _createCharacterValidator;
        private readonly IValidator<UpdateCharacterDto> _updateCharacterValidator;

        private readonly IValidator<CreateEpisodeDto> _createEpisodeValidator;
        private readonly IValidator<UpdateEpisodeDto> _updateEpisodeValidator;

        private readonly IValidator<CreateLocationDto> _createLocationValidator;
        private readonly IValidator<UpdateLocationDto> _updateLocationValidator;

        private readonly IValidator<CreateSceneDto> _createSceneValidator;
        private readonly IValidator<UpdateSceneDto> _updateSceneValidator;

        private readonly IValidator<CreateAiScriptDto> _createAiScriptValidator;
        private readonly IValidator<UpdateAiScriptDto> _updateAiScriptValidator;

        private static readonly JsonSerializerOptions JsonOptions = new()
        {
            PropertyNameCaseInsensitive = true,
            Converters = { new JsonStringEnumConverter() }
        };

        public CopilotPayloadValidationService(
            IValidator<CreateShowDto> createShowValidator,
            IValidator<UpdateShowDto> updateShowValidator,
            IValidator<CreateCharacterDto> createCharacterValidator,
            IValidator<UpdateCharacterDto> updateCharacterValidator,
            IValidator<CreateEpisodeDto> createEpisodeValidator,
            IValidator<UpdateEpisodeDto> updateEpisodeValidator,
            IValidator<CreateLocationDto> createLocationValidator,
            IValidator<UpdateLocationDto> updateLocationValidator,
            IValidator<CreateSceneDto> createSceneValidator,
            IValidator<UpdateSceneDto> updateSceneValidator,
            IValidator<CreateAiScriptDto> createAiScriptValidator,
            IValidator<UpdateAiScriptDto> updateAiScriptValidator)
        {
            _createShowValidator = createShowValidator;
            _updateShowValidator = updateShowValidator;
            _createCharacterValidator = createCharacterValidator;
            _updateCharacterValidator = updateCharacterValidator;
            _createEpisodeValidator = createEpisodeValidator;
            _updateEpisodeValidator = updateEpisodeValidator;
            _createLocationValidator = createLocationValidator;
            _updateLocationValidator = updateLocationValidator;
            _createSceneValidator = createSceneValidator;
            _updateSceneValidator = updateSceneValidator;
            _createAiScriptValidator = createAiScriptValidator;
            _updateAiScriptValidator = updateAiScriptValidator;
        }

        public async Task<List<string>> ValidateAsync(CopilotDraft draft, CancellationToken ct = default)
        {
            var errors = new List<string>();

            if (draft.ActionType is CopilotActionType.Chat
                or CopilotActionType.Get
                or CopilotActionType.Delete
                or CopilotActionType.Link
                or CopilotActionType.Unlink
                or CopilotActionType.Unknown)
            {
                return errors;
            }

            if (string.IsNullOrWhiteSpace(draft.PayloadJson))
            {
                errors.Add("Payload is required.");
                return errors;
            }

            try
            {
                switch (draft.ActionType, draft.EntityType)
                {
                    case (CopilotActionType.Create, CopilotEntityType.Show):
                        {
                            var dto = Deserialize<CreateShowDto>(draft.PayloadJson);
                            errors.AddRange(await ValidateDtoAsync(dto, _createShowValidator, ct));
                            break;
                        }

                    case (CopilotActionType.Update, CopilotEntityType.Show):
                        {
                            var dto = Deserialize<UpdateShowDto>(draft.PayloadJson);
                            errors.AddRange(await ValidateDtoAsync(dto, _updateShowValidator, ct));
                            break;
                        }

                    case (CopilotActionType.Create, CopilotEntityType.Character):
                        {
                            var dto = Deserialize<CreateCharacterDto>(draft.PayloadJson);
                            errors.AddRange(await ValidateDtoAsync(dto, _createCharacterValidator, ct));
                            break;
                        }

                    case (CopilotActionType.Update, CopilotEntityType.Character):
                        {
                            var dto = Deserialize<UpdateCharacterDto>(draft.PayloadJson);
                            errors.AddRange(await ValidateDtoAsync(dto, _updateCharacterValidator, ct));
                            break;
                        }

                    case (CopilotActionType.Create, CopilotEntityType.Episode):
                        {
                            var dto = Deserialize<CreateEpisodeDto>(draft.PayloadJson);
                            errors.AddRange(await ValidateDtoAsync(dto, _createEpisodeValidator, ct));
                            break;
                        }

                    case (CopilotActionType.Update, CopilotEntityType.Episode):
                        {
                            var dto = Deserialize<UpdateEpisodeDto>(draft.PayloadJson);
                            errors.AddRange(await ValidateDtoAsync(dto, _updateEpisodeValidator, ct));
                            break;
                        }

                    case (CopilotActionType.Create, CopilotEntityType.Location):
                        {
                            var dto = Deserialize<CreateLocationDto>(draft.PayloadJson);
                            errors.AddRange(await ValidateDtoAsync(dto, _createLocationValidator, ct));
                            break;
                        }

                    case (CopilotActionType.Update, CopilotEntityType.Location):
                        {
                            var dto = Deserialize<UpdateLocationDto>(draft.PayloadJson);
                            errors.AddRange(await ValidateDtoAsync(dto, _updateLocationValidator, ct));
                            break;
                        }

                    case (CopilotActionType.Create, CopilotEntityType.Scene):
                        {
                            var dto = Deserialize<CreateSceneDto>(draft.PayloadJson);
                            errors.AddRange(await ValidateDtoAsync(dto, _createSceneValidator, ct));
                            break;
                        }

                    case (CopilotActionType.Update, CopilotEntityType.Scene):
                        {
                            var dto = Deserialize<UpdateSceneDto>(draft.PayloadJson);
                            errors.AddRange(await ValidateDtoAsync(dto, _updateSceneValidator, ct));
                            break;
                        }

                    case (CopilotActionType.Create, CopilotEntityType.AiScript):
                        {
                            var dto = Deserialize<CreateAiScriptDto>(draft.PayloadJson);
                            errors.AddRange(await ValidateDtoAsync(dto, _createAiScriptValidator, ct));
                            break;
                        }

                    case (CopilotActionType.Update, CopilotEntityType.AiScript):
                        {
                            var dto = Deserialize<UpdateAiScriptDto>(draft.PayloadJson);
                            errors.AddRange(await ValidateDtoAsync(dto, _updateAiScriptValidator, ct));
                            break;
                        }

                    default:
                        errors.Add($"Payload validation is not configured for action '{draft.ActionType}' and entity '{draft.EntityType}'.");
                        break;
                }
            }
            catch (JsonException ex)
            {
                errors.Add($"Invalid payload JSON: {ex.Message}");
            }
            catch (Exception ex)
            {
                errors.Add($"Payload validation failed: {ex.Message}");
            }

            return errors.Distinct().ToList();
        }

        private static T Deserialize<T>(string json)
        {
            var result = JsonSerializer.Deserialize<T>(json, JsonOptions);

            if (result == null)
                throw new InvalidOperationException($"Unable to deserialize payload to {typeof(T).Name}.");

            return result;
        }

        private static async Task<List<string>> ValidateDtoAsync<T>(
            T dto,
            IValidator<T> validator,
            CancellationToken ct)
        {
            var result = await validator.ValidateAsync(dto, ct);
            return result.Errors.Select(x => x.ErrorMessage).ToList();
        }
    }
}