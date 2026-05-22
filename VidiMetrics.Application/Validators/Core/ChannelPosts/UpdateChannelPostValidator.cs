using FluentValidation;
using VidiMetrics.Application.DTOs.Core.ChannelPosts;

namespace VidiMetrics.Application.Validators.Core.ChannelPosts
{
    public class UpdateChannelPostValidator : AbstractValidator<UpdateChannelPostDto>
    {
        public UpdateChannelPostValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Title cannot be an empty string value.")
                .MaximumLength(100).WithMessage("Title cannot exceed 100 characters.")
                .When(x => x.Title != null);

            RuleFor(x => x.Description)
                .MaximumLength(2000).WithMessage("Description cannot exceed 2000 characters.")
                .When(x => x.Description != null);

            RuleFor(x => x.VideoUrl)
                .NotEmpty().WithMessage("Video source path cannot be left empty.")
                .Must(BeAValidUrl).WithMessage("Video source must resolve to a valid absolute URI path.")
                .When(x => x.VideoUrl != null);

            RuleFor(x => x.ThumbnailUrl)
                .NotEmpty().WithMessage("Thumbnail path cannot be left empty.")
                .Must(BeAValidUrl).WithMessage("Thumbnail source must resolve to a valid absolute URI path.")
                .When(x => x.ThumbnailUrl != null);

            RuleFor(x => x.Status)
                .IsInEnum().WithMessage("Invalid targeted post status.")
                .When(x => x.Status != null);

            RuleFor(x => x.ScheduledAt)
                .GreaterThan(DateTime.UtcNow.AddMinutes(-1)).WithMessage("Updated schedule targets must reside in the future.")
                .When(x => x.ScheduledAt != null);
        }

        private bool BeAValidUrl(string? url)
        {
            if (string.IsNullOrEmpty(url)) return false;
            return Uri.TryCreate(url, UriKind.Absolute, out var uriResult)

                   && (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps);
        }
    }
}
