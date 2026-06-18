using FluentValidation;
using VidiMetrics.Application.DTOs.Core.ChannelPosts;
using VidiMetrics.Domain.Enums.Core;

namespace VidiMetrics.Application.Validators.Core.ChannelPosts
{
    public class CreateChannelPostValidator : AbstractValidator<CreateChannelPostDto>
    {
        public CreateChannelPostValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Title is required.")
                .MaximumLength(100).WithMessage("Title cannot exceed 100 characters (Platform limit).");

            RuleFor(x => x.Description)
                .MaximumLength(2000).WithMessage("Description cannot exceed 2000 characters.");

            RuleFor(x => x.VideoUrl)
                .NotEmpty().WithMessage("Video content URL path is required.")
                .Must(BeAValidUrl).WithMessage("Video URL must be a valid absolute URI path (e.g. your S3 storage link).");

            RuleFor(x => x.ThumbnailUrl)
                .Must(BeAValidUrl).WithMessage("Thumbnail URL must be a valid absolute URI path.")
                .When(x => !string.IsNullOrEmpty(x.ThumbnailUrl));

            RuleFor(x => x.ChannelId)
                .NotEmpty().WithMessage("A parent Channel execution target ID is required.");

            RuleFor(x => x.Status)
                .IsInEnum().WithMessage("Invalid initial post distribution state.");

            // If a user marks it as instantly 'Queued', validate that the execution time is not in the past
            RuleFor(x => x.ScheduledAt)
                .GreaterThan(DateTime.UtcNow.AddMinutes(-1))
                .WithMessage("Scheduled execution time must be in the future.")
                .When(x => x.ScheduledAt.HasValue && x.Status == ChannelPostStatus.Queued);
        }

        private bool BeAValidUrl(string url)
        {
            return Uri.TryCreate(url, UriKind.Absolute, out var uriResult)

                   && (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps);
        }
    }
}
