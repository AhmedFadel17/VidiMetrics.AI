using System.ComponentModel.DataAnnotations.Schema;
using VidiMetrics.Domain.Enums.Copilot;
using VidiMetrics.Domain.Models;

namespace VidiMetrics.Domain.Models.Copilot;

public class CopilotMessage : BaseEntity
{
    public Guid ChatId { get; set; }

    [ForeignKey(nameof(ChatId))]
    public CopilotChat Chat { get; set; } = null!;

    public CopilotMessageRole Role { get; set; }
    public string Content { get; set; } = string.Empty;

    public Guid? DraftId { get; set; }

    [ForeignKey(nameof(DraftId))]
    public CopilotDraft? Draft { get; set; }
}
