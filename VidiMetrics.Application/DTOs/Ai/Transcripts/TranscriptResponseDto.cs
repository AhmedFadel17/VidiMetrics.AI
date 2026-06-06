
using VidiMetrics.Application.DTOs.Common;

namespace VidiMetrics.Application.DTOs.Ai.Transcripts
{
    public record TranscriptResponseDto : BaseResponseDto
    {
        public string RawText { get; set; } = string.Empty;
        public string CleanedText { get; set; } = string.Empty;
        public string LanguageCode { get; set; } = string.Empty;
        public string? TimestampsJson { get; set; }
        public Guid VideoId { get; set; }
    }
}
