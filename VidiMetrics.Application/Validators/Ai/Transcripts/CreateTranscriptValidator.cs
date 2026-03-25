using FluentValidation;
using VidiMetrics.Application.DTOs.Ai.Transcripts;

namespace VidiMetrics.Application.Validators.Ai.Transcripts
{
    public class CreateTranscriptValidator : AbstractValidator<CreateTranscriptDto>
    {
        public CreateTranscriptValidator()
        {
            RuleFor(x => x.RawText).NotEmpty().WithMessage("RawText is required.");
            RuleFor(x => x.CleanedText).NotEmpty().WithMessage("CleanedText is required.");
            RuleFor(x => x.LanguageCode).NotEmpty().WithMessage("LanguageCode is required.");
            RuleFor(x => x.VideoId).NotEmpty().WithMessage("VideoId is required.");
        }
    }
}
