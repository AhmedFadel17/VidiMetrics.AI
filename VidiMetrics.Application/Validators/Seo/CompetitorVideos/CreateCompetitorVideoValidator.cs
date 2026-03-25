using FluentValidation;
using VidiMetrics.Application.DTOs.Seo.CompetitorVideos;

namespace VidiMetrics.Application.Validators.Seo.CompetitorVideos
{
    public class CreateCompetitorVideoValidator : AbstractValidator<CreateCompetitorVideoDto>
    {
        public CreateCompetitorVideoValidator()
        {
            RuleFor(x => x.YouTubeVideoId).NotEmpty().WithMessage("YouTubeVideoId is required.");
            RuleFor(x => x.Title).NotEmpty().WithMessage("Title is required.");
            RuleFor(x => x.ChannelName).NotEmpty().WithMessage("ChannelName is required.");
            RuleFor(x => x.TargetKeywordId).NotEmpty().WithMessage("TargetKeywordId is required.");
        }
    }
}
