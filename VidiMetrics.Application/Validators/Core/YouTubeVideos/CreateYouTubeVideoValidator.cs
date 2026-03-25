using FluentValidation;
using VidiMetrics.Application.DTOs.Core.YouTubeVideos;

namespace VidiMetrics.Application.Validators.Core.YouTubeVideos
{
    public class CreateYouTubeVideoValidator : AbstractValidator<CreateYouTubeVideoDto>
    {
        public CreateYouTubeVideoValidator()
        {
            RuleFor(x => x.YouTubeVideoId).NotEmpty().WithMessage("YouTubeVideoId is required.");
            RuleFor(x => x.PublishedAt).NotEmpty().WithMessage("PublishedAt is required.");
        }
    }
}
