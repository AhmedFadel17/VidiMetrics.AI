using FluentValidation;
using VidiMetrics.Application.DTOs.Seo.CompetitorVideos;

namespace VidiMetrics.Application.Validators.Seo.CompetitorVideos
{
    public class UpdateCompetitorVideoValidator : AbstractValidator<UpdateCompetitorVideoDto>
    {
        public UpdateCompetitorVideoValidator()
        {
            RuleFor(x => x.YouTubeVideoId).NotEmpty().WithMessage("YouTubeVideoId cannot be empty.").When(x => x.YouTubeVideoId != null);
            RuleFor(x => x.Title).NotEmpty().WithMessage("Title cannot be empty.").When(x => x.Title != null);
            RuleFor(x => x.ChannelName).NotEmpty().WithMessage("ChannelName cannot be empty.").When(x => x.ChannelName != null);
            RuleFor(x => x.TargetKeywordId).NotEmpty().WithMessage("TargetKeywordId cannot be empty.").When(x => x.TargetKeywordId != null);
        }
    }
}
