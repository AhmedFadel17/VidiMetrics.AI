using VidiMetrics.Domain.Enums;

namespace VidiMetrics.Domain.Models.Ai;

public class VoiceProfile : BaseEntity
{
    public string Name { get; set; } = string.Empty;

    public VoiceProvider Provider { get; set; } = VoiceProvider.Custom;
    public string? ProviderVoiceId { get; set; }

    public string? PreviewUrl { get; set; }

    public string Language { get; set; } = "en-US";
}
