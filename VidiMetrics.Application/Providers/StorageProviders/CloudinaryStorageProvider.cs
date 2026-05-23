using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
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
        var uploadParams = new ImageUploadParams()
        {
            File = new FileDescription(fileName, memoryStream),
            PublicId = $"vidimetrics/images/{Path.GetFileNameWithoutExtension(fileName)}_{Guid.NewGuid().ToString().Substring(0, 6)}"
        };

        var uploadResult = await _cloudinary.UploadAsync(uploadParams);


        if (uploadResult.Error != null)
            throw new Exception($"Cloudinary Image Upload Error: {uploadResult.Error.Message}");

        return uploadResult.SecureUrl.ToString();

    }

    public async Task<string> UploadVideoAsync(byte[] fileBytes, string fileName)
    {
        using var memoryStream = new MemoryStream(fileBytes);
        var uploadParams = new VideoUploadParams()
        {
            File = new FileDescription(fileName, memoryStream),
            PublicId = $"vidimetrics/videos/{Path.GetFileNameWithoutExtension(fileName)}_{Guid.NewGuid().ToString().Substring(0, 6)}",
        };

        var uploadResult = await _cloudinary.UploadAsync(uploadParams);


        if (uploadResult.Error != null)
            throw new Exception($"Cloudinary Video Upload Error: {uploadResult.Error.Message}");

        return uploadResult.SecureUrl.ToString();
    }
}
