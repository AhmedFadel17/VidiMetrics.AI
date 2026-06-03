namespace VidiMetrics.Domain.Models.Infra;

public class UserCreditWallet
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public UserProfile UserProfile { get; set; } = null!;

    public int TotalCreditsAvailable { get; set; }
    public int CreditsUsed { get; set; }


    public int RemainingCredits => Math.Max(0, TotalCreditsAvailable - CreditsUsed);

    public DateTime LastResetDate { get; set; } = DateTime.UtcNow;
    public DateTime NextResetDate { get; set; }

    public bool HasBalanceForAction(int actionCost) => RemainingCredits >= actionCost;
}