
namespace VidiMetrics.Application.DTOs.Ai.Transcripts
{
    public record CreateTranscriptDto
    {
        public required string RawText { get; set; }
        public required string CleanedText { get; set; }
        public required string LanguageCode { get; set; }
        public string? TimestampsJson { get; set; }
        public Guid VideoId { get; set; }
    }
}
