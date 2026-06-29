using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;
using FFMpegCore;
using Microsoft.Extensions.Logging;
using VidiMetrics.Application.DTOs.Ai.AiVideos;
using VidiMetrics.Application.Providers.StorageProviders;

namespace VidiMetrics.Application.Providers.VideoProviders;

public class FFmpegVideoProvider : IFFmpegVideoProvider
{
    private readonly ILogger<FFmpegVideoProvider> _logger;
    private readonly IStorageProvider _storageProvider;
    private readonly IHttpClientFactory _httpClientFactory;

    public FFmpegVideoProvider(
        ILogger<FFmpegVideoProvider> logger,
        IStorageProvider storageProvider,
        IHttpClientFactory httpClientFactory)
    {
        _logger = logger;
        _storageProvider = storageProvider;
        _httpClientFactory = httpClientFactory;
    }

    public async Task<VideoGenerationResult> StitchVideosAsync(List<string> videoUrls, int seed, int width = 1024, int height = 1024)
    {
        if (videoUrls == null || videoUrls.Count == 0)
            throw new ArgumentException("No video URLs provided for stitching.");

        _logger.LogInformation("Starting stitching process for {Count} cloud video URLs.", videoUrls.Count);

        string outputDirectory = Path.Combine(Path.GetTempPath(), "VidiMetrics_Stitcher");
        if (!Directory.Exists(outputDirectory))
            Directory.CreateDirectory(outputDirectory);

        string uniqueId = Guid.NewGuid().ToString();
        string outputFileName = $"episode_cut_{uniqueId}.mp4";
        string outputFilePath = Path.Combine(outputDirectory, outputFileName);

        var downloadedLocalPaths = new List<string>();

        try
        {
            var httpClient = _httpClientFactory.CreateClient();

            _logger.LogInformation("Downloading video scenes from cloud to local storage...");
            for (int i = 0; i < videoUrls.Count; i++)
            {
                string url = videoUrls[i];
                string localScenePath = Path.Combine(outputDirectory, $"scene_{uniqueId}_{i}.mp4");

                _logger.LogInformation("Downloading scene {Index} from: {Url}", i, url);

                using (var response = await httpClient.GetAsync(url, HttpCompletionOption.ResponseHeadersRead))
                {
                    response.EnsureSuccessStatusCode();
                    using (var streamToReadFrom = await response.Content.ReadAsStreamAsync())
                    using (var streamToWriteTo = File.Open(localScenePath, FileMode.Create))
                    {
                        await streamToReadFrom.CopyToAsync(streamToWriteTo);
                    }
                }

                downloadedLocalPaths.Add(localScenePath);
            }

            _logger.LogInformation("Executing FFmpeg Demux Concat directly via local paths...");
            await FFMpegArguments
                .FromDemuxConcatInput(downloadedLocalPaths)
                .OutputToFile(outputFilePath, overwrite: true, options => options.WithVideoCodec("copy").WithAudioCodec("copy"))
                .ProcessAsynchronously();

            _logger.LogInformation("Successfully stitched videos into local path: {OutputPath}", outputFilePath);

            long sizeInBytes = 0;
            if (File.Exists(outputFilePath))
            {
                sizeInBytes = new FileInfo(outputFilePath).Length;
            }

            TimeSpan videoDuration = TimeSpan.Zero;
            try
            {
                var mediaInfo = await FFProbe.AnalyseAsync(outputFilePath);
                videoDuration = mediaInfo.Duration;
                _logger.LogInformation("Calculated video duration dynamically: {Duration}", videoDuration);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Could not analyze video duration dynamically using FFProbe. Falling back to default.");
                videoDuration = TimeSpan.FromSeconds(5);
            }

            byte[] videoBytes = await File.ReadAllBytesAsync(outputFilePath);
            _logger.LogInformation("Uploading stitched video to cloud storage...");
            string cloudVideoUrl = await _storageProvider.UploadVideoAsync(videoBytes, outputFileName);

            return new VideoGenerationResult
            {
                VideoUrl = cloudVideoUrl,
                ThumbnailUrl = cloudVideoUrl.Replace(".mp4", ".jpg"),
                Duration = videoDuration,
                SizeInBytes = sizeInBytes
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to download, stitch, or upload videos using FFmpeg.");
            throw;
        }
        finally
        {
            _logger.LogInformation("Cleaning up temporary local files from container storage...");

            if (File.Exists(outputFilePath))
                File.Delete(outputFilePath);

            foreach (var localPath in downloadedLocalPaths)
            {
                if (File.Exists(localPath))
                    File.Delete(localPath);
            }
        }
    }
}