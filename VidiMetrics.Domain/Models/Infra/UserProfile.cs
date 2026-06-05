namespace VidiMetrics.Domain.Models.Infra;

public class UserProfile
{
    public Guid UserId { get; set; }

    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string? ProfilePictureUrl { get; set; }
    public string? Bio { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? LastLoginAt { get; set; }
    public bool IsActive { get; set; } = true;


    public UserCreditWallet? CreditWallet { get; set; }
    public ICollection<UserSubscription> SubscriptionHistory { get; set; } = new List<UserSubscription>();
    public ICollection<CreditTransactionLedger> CreditLedgerLogs { get; set; } = new List<CreditTransactionLedger>();
}
