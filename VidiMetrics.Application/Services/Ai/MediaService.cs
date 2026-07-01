namespace VidiMetrics.Application.Services.Ai;

using System.Linq.Dynamic.Core;
using VidiMetrics.Application.DTOs.Ai.MediaStats;
using VidiMetrics.Application.Interfaces.Ai;
using VidiMetrics.DataAccess.Repositories.Ai.AiImages;
using VidiMetrics.DataAccess.Repositories.Ai.AiScripts;
using VidiMetrics.DataAccess.Repositories.Ai.AiVideos;
using VidiMetrics.Domain.Enums;

public class MediaService : IMediaService
{
    private readonly IAiImagesRepository _imageRepository;
    private readonly IAiScriptsRepository _scriptRepository;
    private readonly IAiVideosRepository _videoRepository;

    public MediaService(IAiImagesRepository imageRepository, IAiScriptsRepository scriptRepository, IAiVideosRepository videoRepository)
    {
        _imageRepository = imageRepository;
        _scriptRepository = scriptRepository;
        _videoRepository = videoRepository;
    }

    public async Task<MediaStatsResponseDto> GetStatsAsync(Guid userGuid, bool isAdmin, CancellationToken ct)
    {
        var videosQuery = _videoRepository.Query().Where(v => (v.UserId == userGuid || isAdmin));
        var scriptsQuery = _scriptRepository.Query().Where(s => (s.UserId == userGuid || isAdmin));
        var imagesQuery = _imageRepository.Query().Where(m => (m.UserId == userGuid || isAdmin));


        var totalVideos = videosQuery.Count();
        var totalScripts = scriptsQuery.Count();
        var totalImages = imagesQuery.Count();

        var unlinkedImages = imagesQuery.Where(x => x.IsLinked == false).Count();
        var unlinkedVideos = videosQuery.Where(x => x.IsLinked == false).Count();
        var unlinkedScripts = scriptsQuery.Where(x => x.IsLinked == false).Count();

        var totalGenerations = totalVideos + totalScripts + totalImages;
        var totalUnlinked = unlinkedImages + unlinkedVideos + unlinkedScripts;

        return new MediaStatsResponseDto
        {
            TotalVideos = totalVideos,
            TotalScripts = totalScripts,
            TotalImages = totalImages,
            TotalGenerations = totalGenerations,
            TotalUnlinked = totalUnlinked
        };
    }
}
