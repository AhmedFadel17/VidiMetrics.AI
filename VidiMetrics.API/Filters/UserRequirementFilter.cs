using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Options;
using VidiMetrics.Application.DTOs.Infra.UserProfiles;
using VidiMetrics.Application.Interfaces.Infra;
using VidiMetrics.Domain.Settings;

namespace VidiMetrics.API.Filters;

public class UserRequirementFilter : IAsyncActionFilter
{
    private readonly IUserProfilesService _service;
    private readonly SubscriptionSettings _settings;

    public UserRequirementFilter(IUserProfilesService service, IOptions<SubscriptionSettings> options)
    {
        _service = service;
        _settings = options.Value;
    }

    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var user = context.HttpContext.User;


        var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value

                        ?? user.FindFirst("sub")?.Value;

        if (Guid.TryParse(userIdClaim, out var userId))
        {
            var profile = await _service.GetByIdAsync(userId);

            if (profile == null)
            {
                var email = user.FindFirst(ClaimTypes.Email)?.Value ?? "";
                var name = user.FindFirst("name")?.Value

                           ?? user.FindFirst(ClaimTypes.Name)?.Value

                           ?? "New User";

                var createDto = new CreateUserProfileDto
                {
                    UserId = userId,
                    Email = email,
                    FullName = name,
                    CreatedAt = DateTime.UtcNow,
                    SubscriptionPlanId = Guid.Parse(_settings.FreePlan.Id)
                };

                try

                {
                    await _service.CreateAsync(createDto);
                }
                catch (Exception)
                {
                    context.Result = new ObjectResult(new { message = "Syncing your profile, please refresh." })

                    { StatusCode = 403 };
                    return;
                }
            }
        }
        else
        {
            context.Result = new UnauthorizedResult();
            return;
        }

        await next();
    }
}