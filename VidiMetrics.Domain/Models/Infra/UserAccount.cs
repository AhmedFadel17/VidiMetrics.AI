
namespace VidiMetrics.Domain.Models.Infra
{
    internal class UserAccount
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public string ExternalId { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;

        public string SubscriptionTier { get; set; } = "Free"; 

        public DateTime LastLoginAt { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
