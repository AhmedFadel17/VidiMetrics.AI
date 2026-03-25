
namespace VidiMetrics.Application.DTOs.Ai.Transcripts
{
    public class TranscriptResponseDto
    {
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? CreatedBy { get; set; }
        public bool IsDeleted { get; set; }
        public string RawText { get; set; }
        public string CleanedText { get; set; }
        public string LanguageCode { get; set; }
        public string? TimestampsJson { get; set; }
        public Guid VideoId { get; set; }
    }
}
