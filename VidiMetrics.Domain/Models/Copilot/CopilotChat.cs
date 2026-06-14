using VidiMetrics.Domain.Models;

namespace VidiMetrics.Domain.Models.Copilot;

public class CopilotChat : BaseEntity
{
    public Guid UserId { get; set; }
    public string Title { get; set; } = string.Empty;

    public ICollection<CopilotMessage> Messages { get; set; } = new List<CopilotMessage>();
    public ICollection<CopilotDraft> Drafts { get; set; } = new List<CopilotDraft>();
}
