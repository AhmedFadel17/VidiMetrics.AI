using FluentValidation;
using VidiMetrics.Application.DTOs.StoryEngine.Episodes;

namespace VidiMetrics.Application.Validators.StoryEngine.Episodes
{
    public class UpdateEpisodeValidator : AbstractValidator<UpdateEpisodeDto>
    {
        public UpdateEpisodeValidator()
        {
            RuleFor(x => x.Title).NotEmpty().WithMessage("Title cannot be empty.").When(x => x.Title != null);
            RuleFor(x => x.PlotSummary).NotEmpty().WithMessage("PlotSummary cannot be empty.").When(x => x.PlotSummary != null);
            RuleFor(x => x.ShowId).NotEmpty().WithMessage("ShowId cannot be empty.").When(x => x.ShowId != null);
            RuleFor(x => x.AiVideoId).NotEmpty().WithMessage("AiVideoId cannot be empty.").When(x => x.AiVideoId != null);
        }
    }
}
