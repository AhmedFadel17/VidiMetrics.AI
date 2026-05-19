using FluentValidation;
using VidiMetrics.Application.DTOs.StoryEngine.Episodes;

namespace VidiMetrics.Application.Validators.StoryEngine.Episodes
{
    public class CreateEpisodeValidator : AbstractValidator<CreateEpisodeDto>
    {
        public CreateEpisodeValidator()
        {
            RuleFor(x => x.EpisodeNumber)
                .GreaterThanOrEqualTo(1).WithMessage("EpisodeNumber must be at least 1.");

            RuleFor(x => x.Title).NotEmpty().WithMessage("Title is required.");
            RuleFor(x => x.PlotSummary).NotEmpty().WithMessage("PlotSummary is required.");
            RuleFor(x => x.ShowId).NotEmpty().WithMessage("ShowId is required.");
        }
    }
}
