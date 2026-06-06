using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Domain.Enums;

namespace VidiMetrics.Application.DTOs.Ai.AiImages;

public record AiImageResponseDto : BaseResponseDto
{
    public string? ImageUrl { get; set; }
    public string? Prompt { get; set; }
    public long Seed { get; set; }
    public long Size { get; set; }
    public AssetType AssetType { get; set; }
    public bool IsLinked { get; set; }
    public Guid UserId { get; set; }
}
