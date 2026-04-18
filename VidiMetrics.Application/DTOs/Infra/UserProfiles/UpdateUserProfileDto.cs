namespace VidiMetrics.Application.DTOs.Infra.UserProfiles
{
    public class UpdateUserProfileDto
    {
        public string? Email { get; set; }
        public string? FullName { get; set; }
        public string? ProfilePictureUrl { get; set; }
        public string? Bio { get; set; }
        public Guid? SubscriptionPlanId { get; set; }
        public DateTime? LastLoginAt { get; set; }
        public bool? IsActive { get; set; }
    }
}
