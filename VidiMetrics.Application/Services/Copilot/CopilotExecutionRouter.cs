using System;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Ai.AiScripts;
using VidiMetrics.Application.DTOs.StoryEngine.Characters;
using VidiMetrics.Application.DTOs.StoryEngine.Episodes;
using VidiMetrics.Application.DTOs.StoryEngine.Locations;
using VidiMetrics.Application.DTOs.StoryEngine.Scenes;
using VidiMetrics.Application.DTOs.StoryEngine.Shows;
using VidiMetrics.Application.Interfaces.Ai;
using VidiMetrics.Application.Interfaces.Copilot;
using VidiMetrics.Application.Interfaces.StoryEngine;
using VidiMetrics.Domain.Enums.Copilot;
using VidiMetrics.Domain.Models.Copilot;

namespace VidiMetrics.Application.Services.Copilot;

public class CopilotExecutionRouter : ICopilotExecutionRouter
{
    private readonly IShowsService _showService;
    private readonly IEpisodesService _episodeService;
    private readonly ICharactersService _characterService;
    private readonly ILocationsService _locationService;
    private readonly IScenesService _sceneService;
    private readonly IAiScriptsService _aiScriptService;

    public CopilotExecutionRouter(
        IShowsService showService,
        IEpisodesService episodeService,
        ICharactersService characterService,
        ILocationsService locationService,
        IScenesService sceneService,
        IAiScriptsService aiScriptService)
    {
        _showService = showService;
        _episodeService = episodeService;
        _characterService = characterService;
        _locationService = locationService;
        _sceneService = sceneService;
        _aiScriptService = aiScriptService;
    }

    public async Task<object?> ExecuteAsync(Guid userId, CopilotDraft draft, CancellationToken ct = default)
    {
        return (draft.ActionType, draft.EntityType) switch
        {
            (CopilotActionType.Create, CopilotEntityType.Show) => await ExecuteCreateShowAsync(userId, draft, ct),
            (CopilotActionType.Update, CopilotEntityType.Show) => await ExecuteUpdateShowAsync(userId, draft, ct),
            (CopilotActionType.Delete, CopilotEntityType.Show) => await ExecuteDeleteShowAsync(userId, draft, ct),
            (CopilotActionType.Get, CopilotEntityType.Show) => await ExecuteGetShowAsync(userId, draft, ct),

            (CopilotActionType.Create, CopilotEntityType.Episode) => await ExecuteCreateEpisodeAsync(userId, draft, ct),
            (CopilotActionType.Update, CopilotEntityType.Episode) => await ExecuteUpdateEpisodeAsync(userId, draft, ct),
            (CopilotActionType.Delete, CopilotEntityType.Episode) => await ExecuteDeleteEpisodeAsync(userId, draft, ct),
            (CopilotActionType.Get, CopilotEntityType.Episode) => await ExecuteGetEpisodeAsync(userId, draft, ct),

            (CopilotActionType.Create, CopilotEntityType.Character) => await ExecuteCreateCharacterAsync(userId, draft, ct),
            (CopilotActionType.Update, CopilotEntityType.Character) => await ExecuteUpdateCharacterAsync(userId, draft, ct),
            (CopilotActionType.Delete, CopilotEntityType.Character) => await ExecuteDeleteCharacterAsync(userId, draft, ct),
            (CopilotActionType.Get, CopilotEntityType.Character) => await ExecuteGetCharacterAsync(userId, draft, ct),

            (CopilotActionType.Create, CopilotEntityType.Location) => await ExecuteCreateLocationAsync(userId, draft, ct),
            (CopilotActionType.Update, CopilotEntityType.Location) => await ExecuteUpdateLocationAsync(userId, draft, ct),
            (CopilotActionType.Delete, CopilotEntityType.Location) => await ExecuteDeleteLocationAsync(userId, draft, ct),
            (CopilotActionType.Get, CopilotEntityType.Location) => await ExecuteGetLocationAsync(userId, draft, ct),

            (CopilotActionType.Create, CopilotEntityType.Scene) => await ExecuteCreateSceneAsync(userId, draft, ct),
            (CopilotActionType.Update, CopilotEntityType.Scene) => await ExecuteUpdateSceneAsync(userId, draft, ct),
            (CopilotActionType.Delete, CopilotEntityType.Scene) => await ExecuteDeleteSceneAsync(userId, draft, ct),
            (CopilotActionType.Get, CopilotEntityType.Scene) => await ExecuteGetSceneAsync(userId, draft, ct),

            (CopilotActionType.Create, CopilotEntityType.AiScript) => await ExecuteCreateAiScriptAsync(userId, draft, ct),
            (CopilotActionType.Update, CopilotEntityType.AiScript) => await ExecuteUpdateAiScriptAsync(userId, draft, ct),
            (CopilotActionType.Delete, CopilotEntityType.AiScript) => await ExecuteDeleteAiScriptAsync(userId, draft, ct),
            (CopilotActionType.Get, CopilotEntityType.AiScript) => await ExecuteGetAiScriptAsync(userId, draft, ct),

            // (CopilotActionType.Link, CopilotEntityType.SceneCharacter) => await ExecuteLinkCharacterToSceneAsync(userId, draft, ct),
            // (CopilotActionType.Unlink, CopilotEntityType.SceneCharacter) => await ExecuteUnlinkCharacterFromSceneAsync(userId, draft, ct),

            _ => throw new NotSupportedException($"Unsupported draft action/entity combination: {draft.ActionType}/{draft.EntityType}")
        };
    }

    #region Show Executors
    private async Task<object?> ExecuteCreateShowAsync(Guid userId, CopilotDraft draft, CancellationToken ct)
    {
        var dto = Deserialize<CreateShowDto>(draft.PayloadJson);
        return await _showService.CreateAsync(userId, dto);
    }

    private async Task<object?> ExecuteUpdateShowAsync(Guid userId, CopilotDraft draft, CancellationToken ct)
    {
        EnsureEntityIdHasValue(draft);
        var dto = Deserialize<UpdateShowDto>(draft.PayloadJson);
        return await _showService.UpdateAsync(userId, draft.EntityId!.Value, dto);
    }

    private async Task<object?> ExecuteDeleteShowAsync(Guid userId, CopilotDraft draft, CancellationToken ct)
    {
        EnsureEntityIdHasValue(draft);
        return await _showService.DeleteAsync(userId, draft.EntityId!.Value);
    }

    private async Task<object?> ExecuteGetShowAsync(Guid userId, CopilotDraft draft, CancellationToken ct)
    {
        EnsureEntityIdHasValue(draft);
        return await _showService.GetByIdAsync(userId, draft.EntityId!.Value);
    }
    #endregion

    #region Episode Executors
    private async Task<object?> ExecuteCreateEpisodeAsync(Guid userId, CopilotDraft draft, CancellationToken ct)
    {
        var dto = Deserialize<CreateEpisodeDto>(draft.PayloadJson);
        return await _episodeService.CreateAsync(userId, dto);
    }

    private async Task<object?> ExecuteUpdateEpisodeAsync(Guid userId, CopilotDraft draft, CancellationToken ct)
    {
        EnsureEntityIdHasValue(draft);
        var dto = Deserialize<UpdateEpisodeDto>(draft.PayloadJson);
        return await _episodeService.UpdateAsync(userId, draft.EntityId!.Value, dto);
    }

    private async Task<object?> ExecuteDeleteEpisodeAsync(Guid userId, CopilotDraft draft, CancellationToken ct)
    {
        EnsureEntityIdHasValue(draft);
        return await _episodeService.DeleteAsync(userId, draft.EntityId!.Value);
    }

    private async Task<object?> ExecuteGetEpisodeAsync(Guid userId, CopilotDraft draft, CancellationToken ct)
    {
        EnsureEntityIdHasValue(draft);
        return await _episodeService.GetByIdAsync(userId, draft.EntityId!.Value, ct);
    }
    #endregion

    #region Character Executors
    private async Task<object?> ExecuteCreateCharacterAsync(Guid userId, CopilotDraft draft, CancellationToken ct)
    {
        var dto = Deserialize<CreateCharacterDto>(draft.PayloadJson);
        return await _characterService.CreateAsync(userId, dto);
    }

    private async Task<object?> ExecuteUpdateCharacterAsync(Guid userId, CopilotDraft draft, CancellationToken ct)
    {
        EnsureEntityIdHasValue(draft);
        var dto = Deserialize<UpdateCharacterDto>(draft.PayloadJson);
        return await _characterService.UpdateAsync(userId, draft.EntityId!.Value, dto);
    }

    private async Task<object?> ExecuteDeleteCharacterAsync(Guid userId, CopilotDraft draft, CancellationToken ct)
    {
        EnsureEntityIdHasValue(draft);
        return await _characterService.DeleteAsync(userId, draft.EntityId!.Value);
    }

    private async Task<object?> ExecuteGetCharacterAsync(Guid userId, CopilotDraft draft, CancellationToken ct)
    {
        EnsureEntityIdHasValue(draft);
        return await _characterService.GetByIdAsync(userId, draft.EntityId!.Value, ct);
    }
    #endregion

    #region Location Executors
    private async Task<object?> ExecuteCreateLocationAsync(Guid userId, CopilotDraft draft, CancellationToken ct)
    {
        var dto = Deserialize<CreateLocationDto>(draft.PayloadJson);
        return await _locationService.CreateAsync(userId, dto);
    }

    private async Task<object?> ExecuteUpdateLocationAsync(Guid userId, CopilotDraft draft, CancellationToken ct)
    {
        EnsureEntityIdHasValue(draft);
        var dto = Deserialize<UpdateLocationDto>(draft.PayloadJson);
        return await _locationService.UpdateAsync(userId, draft.EntityId!.Value, dto);
    }

    private async Task<object?> ExecuteDeleteLocationAsync(Guid userId, CopilotDraft draft, CancellationToken ct)
    {
        EnsureEntityIdHasValue(draft);
        return await _locationService.DeleteAsync(userId, draft.EntityId!.Value);
    }

    private async Task<object?> ExecuteGetLocationAsync(Guid userId, CopilotDraft draft, CancellationToken ct)
    {
        EnsureEntityIdHasValue(draft);
        return await _locationService.GetByIdAsync(userId, draft.EntityId!.Value, ct);
    }
    #endregion

    #region Scene Executors
    private async Task<object?> ExecuteCreateSceneAsync(Guid userId, CopilotDraft draft, CancellationToken ct)
    {
        var dto = Deserialize<CreateSceneDto>(draft.PayloadJson);
        return await _sceneService.CreateAsync(userId, dto);
    }

    private async Task<object?> ExecuteUpdateSceneAsync(Guid userId, CopilotDraft draft, CancellationToken ct)
    {
        EnsureEntityIdHasValue(draft);
        var dto = Deserialize<UpdateSceneDto>(draft.PayloadJson);
        return await _sceneService.UpdateAsync(userId, draft.EntityId!.Value, dto);
    }

    private async Task<object?> ExecuteDeleteSceneAsync(Guid userId, CopilotDraft draft, CancellationToken ct)
    {
        EnsureEntityIdHasValue(draft);
        return await _sceneService.DeleteAsync(userId, draft.EntityId!.Value);
    }

    private async Task<object?> ExecuteGetSceneAsync(Guid userId, CopilotDraft draft, CancellationToken ct)
    {
        EnsureEntityIdHasValue(draft);
        return await _sceneService.GetByIdAsync(userId, draft.EntityId!.Value, ct);
    }
    #endregion

    #region AI Script Executors
    private async Task<object?> ExecuteCreateAiScriptAsync(Guid userId, CopilotDraft draft, CancellationToken ct)
    {
        var dto = Deserialize<CreateAiScriptDto>(draft.PayloadJson);
        return await _aiScriptService.CreateAsync(userId, dto);
    }

    private async Task<object?> ExecuteUpdateAiScriptAsync(Guid userId, CopilotDraft draft, CancellationToken ct)
    {
        EnsureEntityIdHasValue(draft);
        var dto = Deserialize<UpdateAiScriptDto>(draft.PayloadJson);
        return await _aiScriptService.UpdateAsync(userId, draft.EntityId!.Value, dto);
    }

    private async Task<object?> ExecuteDeleteAiScriptAsync(Guid userId, CopilotDraft draft, CancellationToken ct)
    {
        EnsureEntityIdHasValue(draft);
        return await _aiScriptService.DeleteAsync(userId, draft.EntityId!.Value);
    }

    private async Task<object?> ExecuteGetAiScriptAsync(Guid userId, CopilotDraft draft, CancellationToken ct)
    {
        EnsureEntityIdHasValue(draft);
        return await _aiScriptService.GetByIdAsync(userId, draft.EntityId!.Value, ct);
    }
    #endregion

    // #region Relationships Links
    // private async Task<object?> ExecuteLinkCharacterToSceneAsync(Guid userId, CopilotDraft draft, CancellationToken ct)
    // {
    //     var dto = Deserialize<LinkCharacterToSceneDraftPayloadDto>(draft.PayloadJson);
    //     return await _sceneCharacterService.LinkCharacterToSceneAsync(userId, dto.SceneId, dto.CharacterId);
    // }

    // private async Task<object?> ExecuteUnlinkCharacterFromSceneAsync(Guid userId, CopilotDraft draft, CancellationToken ct)
    // {
    //     var dto = Deserialize<UnlinkCharacterFromSceneDraftPayloadDto>(draft.PayloadJson);
    //     return await _sceneCharacterService.UnlinkCharacterFromSceneAsync(userId, dto.SceneId, dto.CharacterId);
    // }
    // #endregion

    #region Private Helpers
    private static void EnsureEntityIdHasValue(CopilotDraft draft)
    {
        if (!draft.EntityId.HasValue || draft.EntityId.Value == Guid.Empty)
        {
            throw new ArgumentException($"EntityId is required for action '{draft.ActionType}' on entity '{draft.EntityType}'.");
        }
    }

    private static T Deserialize<T>(string json)
    {
        var result = JsonSerializer.Deserialize<T>(json, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true,
            AllowTrailingCommas = true,
            ReadCommentHandling = JsonCommentHandling.Skip
        });

        if (result == null)
            throw new InvalidOperationException($"Unable to deserialize payload to {typeof(T).Name}");

        return result;
    }
    #endregion
}