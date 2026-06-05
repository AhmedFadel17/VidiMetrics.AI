using System;
using System.IO;
using System.Threading.Tasks;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using VidiMetrics.Domain.Settings;

namespace VidiMetrics.Application.Providers.StorageProviders;

public class CloudinaryStorageProvider : IStorageProvider
{
    private readonly Cloudinary _cloudinary;
    private readonly ApiSettings _settings;

    public CloudinaryStorageProvider(IOptions<ApisSettings> options)
    {
        _settings = options.Value.Cloudinary;
        var account = new Account(
            _settings.Name,
            _settings.ApiKey,
            _settings.ClientSecret
        );
        _cloudinary = new Cloudinary(account);
    }

    public async Task<string> UploadImageAsync(byte[] fileBytes, string fileName)
    {
        using var memoryStream = new MemoryStream(fileBytes);
        var fileDescription = new FileDescription(fileName, memoryStream);


        return await ExecuteImageUploadAsync(fileDescription, fileName);
    }

    public async Task<string> UploadImageFileAsync(IFormFile file, string fileName)
    {
        using var fileStream = file.OpenReadStream();
        var fileDescription = new FileDescription(fileName, fileStream);


        return await ExecuteImageUploadAsync(fileDescription, fileName);
    }

    public async Task<string> UploadVideoAsync(byte[] fileBytes, string fileName)
    {
        using var memoryStream = new MemoryStream(fileBytes);
        var fileDescription = new FileDescription(fileName, memoryStream);


        return await ExecuteVideoUploadAsync(fileDescription, fileName);
    }



    private async Task<string> ExecuteImageUploadAsync(FileDescription fileDescription, string originalFileName)
    {
        var uploadParams = new ImageUploadParams()
        {
            File = fileDescription,
            PublicId = $"vidimetrics/images/{Path.GetFileNameWithoutExtension(originalFileName)}_{Guid.NewGuid().ToString().Substring(0, 6)}"
        };

        var uploadResult = await _cloudinary.UploadAsync(uploadParams);

        if (uploadResult.Error != null)
            throw new Exception($"Cloudinary Image Upload Error: {uploadResult.Error.Message}");

        return uploadResult.SecureUrl.ToString();
    }

    private async Task<string> ExecuteVideoUploadAsync(FileDescription fileDescription, string originalFileName)
    {
        var uploadParams = new VideoUploadParams()
        {
            File = fileDescription,
            PublicId = $"vidimetrics/videos/{Path.GetFileNameWithoutExtension(originalFileName)}_{Guid.NewGuid().ToString().Substring(0, 6)}"
        };

        var uploadResult = await _cloudinary.UploadAsync(uploadParams);

        if (uploadResult.Error != null)
            throw new Exception($"Cloudinary Video Upload Error: {uploadResult.Error.Message}");

        return uploadResult.SecureUrl.ToString();
    }

}