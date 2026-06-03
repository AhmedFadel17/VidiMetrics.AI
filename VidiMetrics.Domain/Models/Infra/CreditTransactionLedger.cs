using VidiMetrics.Domain.Enums;

namespace VidiMetrics.Domain.Models.Infra;

public class CreditTransactionLedger
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public CreditActionType ActionType { get; set; }
    public int AmountDeducted { get; set; }
    public string Description { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}