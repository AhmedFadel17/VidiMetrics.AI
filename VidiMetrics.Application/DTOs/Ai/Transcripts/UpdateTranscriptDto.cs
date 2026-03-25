
namespace VidiMetrics.Application.DTOs.Ai.Transcripts
{
    public class UpdateTranscriptDto
    {
        public Guid Id { get; set; }
        public string RawText { get; set; }
        public string CleanedText { get; set; }
        public string LanguageCode { get; set; }
        public string? TimestampsJson { get; set; }
        public Guid VideoId { get; set; }
    }
}
