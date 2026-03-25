using FluentValidation;
using VidiMetrics.Application.DTOs.Core.YouTubeVideos;

namespace VidiMetrics.Application.Validators.Core.YouTubeVideos
{
    public class UpdateYouTubeVideoValidator : AbstractValidator<UpdateYouTubeVideoDto>
    {
        public UpdateYouTubeVideoValidator()
        {
            RuleFor(x => x.Id).NotEmpty().WithMessage("Id cannot be empty.").When(x => x.Id != null);
            RuleFor(x => x.YouTubeVideoId).NotEmpty().WithMessage("YouTubeVideoId cannot be empty.").When(x => x.YouTubeVideoId != null);
            RuleFor(x => x.PublishedAt).NotEmpty().WithMessage("PublishedAt cannot be empty.").When(x => x.PublishedAt != null);
            RuleFor(x => x.PrivacyStatus).NotEmpty().WithMessage("PrivacyStatus cannot be empty.").When(x => x.PrivacyStatus != null);
        }
    }
}
