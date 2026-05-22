using FluentValidation;
using VidiMetrics.Application.DTOs.Core.Channels;

namespace VidiMetrics.Application.Validators.Core.Channels
{
    public class CreateChannelValidator : AbstractValidator<CreateChannelDto>
    {
        public CreateChannelValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Channel Name is required.")
                .MaximumLength(100).WithMessage("Channel Name cannot exceed 100 characters.");

            RuleFor(x => x.AvatarUrl)
                .NotEmpty().WithMessage("Avatar URL is required.")
                .Must(BeAValidUrl).WithMessage("Avatar URL must be a valid absolute URI path.");

            When(x => x.IsConnected, () =>
            {
                RuleFor(x => x.AccessToken)
                    .NotEmpty().WithMessage("Access Token is required when a channel is actively connected.");


                RuleFor(x => x.ExpiresAt)
                    .NotEmpty().WithMessage("Expiration timestamp is required for connected channels.")
                    .GreaterThan(DateTime.UtcNow).WithMessage("The provided access token has already expired.");
            });

            RuleFor(x => x.Platform)
                .IsInEnum().WithMessage("The selected target platform is invalid or unsupported.");

            RuleFor(x => x.PlatformChannelId)
                .NotEmpty().WithMessage("Platform Channel ID from the third-party API provider is required.");
        }

        private bool BeAValidUrl(string url)
        {
            return Uri.TryCreate(url, UriKind.Absolute, out var uriResult)

                   && (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps);
        }
    }
}
