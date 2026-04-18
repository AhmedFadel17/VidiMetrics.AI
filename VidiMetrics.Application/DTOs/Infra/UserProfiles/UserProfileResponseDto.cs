namespace VidiMetrics.Application.DTOs.Infra.UserProfiles
{
    public class UserProfileResponseDto
    {
        public Guid UserId { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Email { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string? ProfilePictureUrl { get; set; }
        public string? Bio { get; set; }
        public Guid SubscriptionPlanId { get; set; }
        public DateTime? LastLoginAt { get; set; }
        public bool IsActive { get; set; }
    }
}
