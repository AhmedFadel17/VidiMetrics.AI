namespace VidiMetrics.Domain.Models.Ai;

public class AiImage : BaseEntity
{
    public string ImageUrl { get; set; } = string.Empty;

    public string Prompt { get; set; } = string.Empty;

    public long Seed { get; set; }
    public Guid UserId { get; set; }
    public bool IsLinked { get; set; } = false;
}
