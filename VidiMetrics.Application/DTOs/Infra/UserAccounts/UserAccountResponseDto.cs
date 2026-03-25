
namespace VidiMetrics.Application.DTOs.Infra.UserAccounts
{
    public class UserAccountResponseDto
    {
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? CreatedBy { get; set; }
        public bool IsDeleted { get; set; }
        public string ExternalId { get; set; }
        public string Email { get; set; }
        public string FullName { get; set; }
        public string SubscriptionTier { get; set; }
        public DateTime LastLoginAt { get; set; }
        public bool IsActive { get; set; }
    }
}
