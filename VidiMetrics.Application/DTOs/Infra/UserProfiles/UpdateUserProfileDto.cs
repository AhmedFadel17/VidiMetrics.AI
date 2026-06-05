namespace VidiMetrics.Application.DTOs.Infra.UserProfiles
{
    public record UpdateUserProfileDto
    {
        public string? FullName { get; set; }
        public string? ProfilePictureUrl { get; set; }
        public string? Bio { get; set; }
    }
}
