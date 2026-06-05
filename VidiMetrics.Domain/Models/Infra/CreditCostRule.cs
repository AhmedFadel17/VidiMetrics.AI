using VidiMetrics.Domain.Enums;

namespace VidiMetrics.Domain.Models.Infra;

public class CreditCostRule
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public CreditActionType ActionType { get; set; }
    public int CreditCost { get; set; }
    public bool IsEnabled { get; set; } = true;
}