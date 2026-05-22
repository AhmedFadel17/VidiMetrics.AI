using FluentValidation;
using VidiMetrics.Application.DTOs.Core.Channels;

namespace VidiMetrics.Application.Validators.Core.Channels
{
    public class UpdateChannelValidator : AbstractValidator<UpdateChannelDto>
    {
        public UpdateChannelValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Name cannot be empty.")
                .MaximumLength(100).WithMessage("Name cannot exceed 100 characters.")
                .When(x => x.Name != null);

            RuleFor(x => x.AvatarUrl)
                .NotEmpty().WithMessage("Avatar URL cannot be empty.")
                .Must(BeAValidUrl).WithMessage("Avatar URL must be a valid absolute URI path.")
                .When(x => x.AvatarUrl != null);

            RuleFor(x => x.AccessToken)
                .NotEmpty().WithMessage("Access Token cannot be an empty string value.")
                .When(x => x.AccessToken != null);

            RuleFor(x => x.ExpiresAt)
                .GreaterThan(DateTime.UtcNow).WithMessage("The updated token expiration timestamp must be in the future.")
                .When(x => x.ExpiresAt != null);

            RuleFor(x => x.Platform)
                .IsInEnum().WithMessage("The selected target platform is invalid.")
                .When(x => x.Platform != null);

            RuleFor(x => x.PlatformChannelId)
                .NotEmpty().WithMessage("Platform Channel ID cannot be empty.")
                .When(x => x.PlatformChannelId != null);
        }

        private bool BeAValidUrl(string? url)
        {
            if (string.IsNullOrEmpty(url)) return false;
            return Uri.TryCreate(url, UriKind.Absolute, out var uriResult)

                   && (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps);
        }
    }
}
