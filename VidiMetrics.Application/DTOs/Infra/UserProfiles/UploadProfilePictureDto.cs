using Microsoft.AspNetCore.Http;

namespace VidiMetrics.Application.DTOs.Infra.UserProfiles;

public record UploadProfilePictureDto
{
    public IFormFile File { get; set; } = null!;
}
