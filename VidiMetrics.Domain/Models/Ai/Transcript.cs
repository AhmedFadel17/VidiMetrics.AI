using VidiMetrics.Domain.Models.Core;

namespace VidiMetrics.Domain.Models.Ai;

public class Transcript : BaseEntity
{
    public string RawText { get; set; } = string.Empty;
    public string CleanedText { get; set; } = string.Empty;
    public string LanguageCode { get; set; } = "en";

    public string? TimestampsJson { get; set; }

    public Guid VideoId { get; set; }
    public Video Video { get; set; } = null!;
}