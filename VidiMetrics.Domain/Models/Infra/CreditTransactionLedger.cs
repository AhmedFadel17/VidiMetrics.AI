using VidiMetrics.Domain.Enums.Infra;

namespace VidiMetrics.Domain.Models.Infra;

public class CreditTransactionLedger
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public UserProfile UserProfile { get; set; } = null!;
    public CreditActionType ActionType { get; set; }
    public int AmountDeducted { get; set; }
    public string Description { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}