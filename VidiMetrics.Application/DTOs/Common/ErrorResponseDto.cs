
namespace VidiMetrics.Application.DTOs.Common
{
    public record ErrorResponseDto : ApiResponseDto
    {
        public Dictionary<string, List<string>>? Errors { get; init; }
    }
}
