using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Polly;
using Polly.Retry;
using VidiMetrics.Application.DTOs.Ai.AiImages;
using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Application.Interfaces.Ai;
using VidiMetrics.Application.Interfaces.Infra;
using VidiMetrics.Application.Providers.ImageProviders;
using VidiMetrics.Application.Providers.NotificationsProviders;
using VidiMetrics.DataAccess.Repositories.Ai.AiImages;
using VidiMetrics.Domain.Enums.Ai;
using VidiMetrics.Domain.Enums.Infra;
using VidiMetrics.Domain.Models.Ai;

namespace VidiMetrics.Application.Services.Ai;

public class AiImagesService : IAiImagesService
{
    private readonly HttpClient _httpClient;
    private readonly AsyncRetryPolicy _retryPolicy;
    private readonly IMapper _mapper;
    private readonly IAiImagesRepository _repo;
    private readonly IImageProvider _imageProvider;
    private readonly IValidator<UpdateAiImageDto> _updateValidator;
    private readonly IValidator<CreateCharacterImageDto> _createCharacterValidator;
    private readonly IValidator<CreateLocationImageDto> _createLocationValidator;
    private readonly IValidator<CreateShowImageDto> _createShowValidator;
    private readonly ICreditTransactionManager _creditManager;
    private readonly INotificationProvider _notificationProvider;

    public AiImagesService(
        HttpClient httpClient,
        IMapper mapper,
        IAiImagesRepository repo,
        IValidator<UpdateAiImageDto> updateValidator,
        IValidator<CreateCharacterImageDto> createCharacterValidator,
        IValidator<CreateLocationImageDto> createLocationValidator,
        IValidator<CreateShowImageDto> createShowValidator,
        IImageProvider imageProvider,
        ICreditTransactionManager creditManager,
        INotificationProvider notificationProvider)
    {
        _httpClient = httpClient;
        _mapper = mapper;
        _repo = repo;
        _imageProvider = imageProvider;
        _updateValidator = updateValidator;
        _createCharacterValidator = createCharacterValidator;
        _createLocationValidator = createLocationValidator;
        _createShowValidator = createShowValidator;
        _creditManager = creditManager;
        _notificationProvider = notificationProvider;

        _retryPolicy = Policy
            .Handle<HttpRequestException>()
            .Or<TaskCanceledException>()
            .WaitAndRetryAsync(3, retryAttempt => TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)));
    }

    public async Task<AiImageResponseDto> CreateCharacterImageAsync(Guid userId, CreateCharacterImageDto dto)
    {
        await _createCharacterValidator.ValidateAndThrowAsync(dto);

        string masterPrompt = $"Full body cinematic portrait of a CONSISTENT CHARACTER for a professional series. " +
                             $"Name: {dto.Name}, Role: {dto.Role}. " +
                             $"Appearance: {dto.PhysicalDescription}. " +
                             $"Outfit: {dto.ClothingStyle}. " +
                             $"Traits: {dto.PersonalityTraits}. " +
                             $"Maintain identical facial features, 8k, photorealistic, unreal engine 5, character reference sheet style.";
        var seed = new Random().Next(1, 999999);
        return await _creditManager.ExecuteWithCreditsAsync(
            userId,
            CreditActionType.GenerateImage,
            $"Character Generation: {dto.Name}",
            async () =>
            {
                ImageGenerationResult result = await _imageProvider.GenerateImageAsync(masterPrompt, seed);
                var img = await SaveAiImage(result, masterPrompt, seed, AssetType.Character, userId);

                await _notificationProvider.SendInAppNotificationAsync(
                    userId,
                    "Character Image Generated",
                    $"Your character image for '{dto.Name}' has been generated successfully.",
                    NotificationType.Success,
                    true,
                    $"User {userId} generated a new character image for '{dto.Name}'."
                );

                return _mapper.Map<AiImageResponseDto>(img);
            });
    }

    public async Task<AiImageResponseDto> CreateLocationImageAsync(Guid userId, CreateLocationImageDto dto)
    {
        await _createLocationValidator.ValidateAndThrowAsync(dto);

        string masterPrompt = $"Cinematic wide shot of a professional series location: {dto.Name}. " +
                             $"Visual Details: {dto.VisualDescription}. " +
                             $"Atmosphere and Mood: {dto.Atmosphere}. " +
                             $"Style: High-end film production design, hyper-realistic, 8k resolution, " +
                             $"volumetric lighting, shot on 35mm lens, Unreal Engine 5 render, " +
                             $"highly detailed textures, masterpiece, no people.";
        var seed = new Random().Next(1, 999999);
        return await _creditManager.ExecuteWithCreditsAsync(
            userId,
            CreditActionType.GenerateImage,
            $"Location Generation: {dto.Name}",
            async () =>
            {
                ImageGenerationResult result = await _imageProvider.GenerateImageAsync(masterPrompt, seed);
                var img = await SaveAiImage(result, masterPrompt, seed, AssetType.Location, userId);

                await _notificationProvider.SendInAppNotificationAsync(
                    userId,
                    "Location Image Generated",
                    $"Your location image for '{dto.Name}' has been generated successfully.",
                    NotificationType.Success,
                    true,
                    $"User {userId} generated a new location image for '{dto.Name}'."
                );

                return _mapper.Map<AiImageResponseDto>(img);
            });
    }

    public async Task<AiImageResponseDto> CreateShowImageAsync(Guid userId, CreateShowImageDto dto)
    {
        await _createShowValidator.ValidateAndThrowAsync(dto);

        string masterPrompt = $"A high-end cinematic show thumbnail poster titled '{dto.Title}'. " +
                             $"Subject: {dto.Description}. " +
                             $"Visual Art Style: {dto.VisualStyle}. " +
                             $"Atmosphere tailored for {dto.TargetAudience} audience. " +
                             $"Dramatic cinematic lighting, 8k resolution, highly detailed, photorealistic, depth of field, striking composition, trending on artstation, epic movie poster vibe. " +
                             $"--no text, words, typography, logo, watermark, blurry";

        var seed = new Random().Next(1, 999999);
        return await _creditManager.ExecuteWithCreditsAsync(
            userId,
            CreditActionType.GenerateImage,
            $"Show Generation: {dto.Title}",
            async () =>
            {
                ImageGenerationResult result = await _imageProvider.GenerateImageAsync(masterPrompt, seed);
                var img = await SaveAiImage(result, masterPrompt, seed, AssetType.Show, userId);

                await _notificationProvider.SendInAppNotificationAsync(
                    userId,
                    "Show Image Generated",
                    $"Your show image for '{dto.Title}' has been generated successfully.",
                    NotificationType.Success,
                    true,
                    $"User {userId} generated a new show image for '{dto.Title}'."
                );

                return _mapper.Map<AiImageResponseDto>(img);
            });
    }

    public async Task<bool> DeleteAsync(Guid userId, Guid id)
    {
        var entity = await _repo.Query().FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);
        if (entity == null) throw new KeyNotFoundException("Image not found.");

        _repo.Remove(entity);
        return await _repo.SaveChangesAsync();
    }

    public async Task<PaginationResponseDto<AiImageResponseDto>> GetAllAsync(Guid userId, AiImageFilterDto filter, CancellationToken ct = default)
    {
        IQueryable<AiImage> query = _repo.Query();
        query = query.Where(x => x.UserId == userId);


        if (filter.AssetType.HasValue)
        {
            if (filter.AssetType.Value == AssetType.Unlinked)
            {
                query = query.Where(x => !x.IsLinked);
            }
            else
            {
                query = query.Where(x => x.AssetType == filter.AssetType.Value);
            }
        }


        var (entities, totalCount) = await _repo.GetAllWithPaginationAsync(
            query,
            filter.PageNumber,
            filter.PageSize,
            filter.OrderBy,
            filter.SortOrder,
            filter.Limit,
            cancellationToken: ct);

        var paginationSource = new PaginationSource<AiImage>(entities.ToList(), filter.PageNumber, filter.PageSize, totalCount);
        return _mapper.Map<PaginationResponseDto<AiImageResponseDto>>(paginationSource);
    }

    public async Task<AiImageResponseDto> GetByIdAsync(Guid userId, Guid id, CancellationToken ct = default)
    {
        var entity = await _repo.Query().FirstOrDefaultAsync(s => s.Id == id && s.UserId == userId, cancellationToken: ct);
        if (entity == null) throw new KeyNotFoundException("Image not found.");
        return _mapper.Map<AiImageResponseDto>(entity);
    }

    public async Task<AiImageResponseDto> UpdateAsync(Guid userId, Guid id, UpdateAiImageDto dto)
    {
        await _updateValidator.ValidateAndThrowAsync(dto);
        var entity = await _repo.Query().FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);
        if (entity == null) throw new KeyNotFoundException("Image not found.");

        _mapper.Map(dto, entity);
        entity.UpdatedAt = DateTime.UtcNow;

        _repo.Update(entity);
        await _repo.SaveChangesAsync();

        return _mapper.Map<AiImageResponseDto>(entity);
    }

    private async Task<AiImage> SaveAiImage(ImageGenerationResult result, string prompt, int seed, AssetType type, Guid userId)
    {
        var img = new AiImage
        {
            Prompt = prompt,
            ImageUrl = result.ImageUrl,
            Size = result.SizeInBytes,
            Seed = seed,
            UserId = userId,
            AssetType = type
        };

        await _repo.AddAsync(img);
        await _repo.SaveChangesAsync();
        return img;
    }
}