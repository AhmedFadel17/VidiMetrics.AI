
using MassTransit;
namespace VidiMetrics.API.Events;

[EntityName("user-registered-event")]
[MessageUrn("user-registered-event")]
public record UserRegisteredEvent
{
    public string UserId { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public DateTime RegisteredAt { get; set; }
};

