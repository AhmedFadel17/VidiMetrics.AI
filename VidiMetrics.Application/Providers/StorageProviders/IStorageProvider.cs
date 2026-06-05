using Microsoft.AspNetCore.Http;
namespace VidiMetrics.Application.Providers.StorageProviders;

public interface IStorageProvider
{
    Task<string> UploadVideoAsync(byte[] fileBytes, string fileName);
    Task<string> UploadImageAsync(byte[] fileBytes, string fileName);
    Task<string> UploadImageFileAsync(IFormFile file, string fileName);

}
