
namespace VidiMetrics.Application.DTOs.Infra.UserAccounts
{
    public class CreateUserAccountDto
    {
        public Guid Id { get; set; }
        public string ExternalId { get; set; }
        public string Email { get; set; }
        public string FullName { get; set; }
        public string SubscriptionTier { get; set; }
        public DateTime LastLoginAt { get; set; }
        public bool IsActive { get; set; }
    }
}
