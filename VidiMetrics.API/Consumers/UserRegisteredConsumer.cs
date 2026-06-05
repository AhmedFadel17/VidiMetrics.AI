using MassTransit;
using Microsoft.Extensions.Options;
using VidiMetrics.API.Events;
using VidiMetrics.Application.DTOs.Infra.UserProfiles;
using VidiMetrics.Application.Interfaces.Infra;
using VidiMetrics.Domain.Settings;

namespace VidiMetrics.API.Consumers;

public class UserRegisteredConsumer : IConsumer<UserRegisteredEvent>
{
    private readonly IUserProfilesService _service;
    private readonly SubscriptionSettings _settings;

    public UserRegisteredConsumer(IUserProfilesService service, IOptions<SubscriptionSettings> options)
    {
        _service = service;
        _settings = options.Value;
    }

    public async Task Consume(ConsumeContext<UserRegisteredEvent> context)
    {
        var msg = context.Message;

        var dto = new CreateUserProfileDto
        {
            UserId = Guid.Parse(msg.UserId),
            Email = msg.Email,
            FullName = msg.DisplayName,
            CreatedAt = msg.RegisteredAt,
            SubscriptionPlanId = Guid.Parse(_settings.FreePlan.Id)
        };

        await _service.CreateAsync(dto);
    }
}