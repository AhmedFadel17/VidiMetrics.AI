using FluentValidation;
using VidiMetrics.Application.DTOs.Ai.Transcripts;

namespace VidiMetrics.Application.Validators.Ai.Transcripts
{
    public class UpdateTranscriptValidator : AbstractValidator<UpdateTranscriptDto>
    {
        public UpdateTranscriptValidator()
        {
            RuleFor(x => x.RawText).NotEmpty().WithMessage("RawText cannot be empty.").When(x => x.RawText != null);
            RuleFor(x => x.CleanedText).NotEmpty().WithMessage("CleanedText cannot be empty.").When(x => x.CleanedText != null);
            RuleFor(x => x.LanguageCode).NotEmpty().WithMessage("LanguageCode cannot be empty.").When(x => x.LanguageCode != null);
            RuleFor(x => x.TimestampsJson).NotEmpty().WithMessage("TimestampsJson cannot be empty.").When(x => x.TimestampsJson != null);
            RuleFor(x => x.VideoId).NotEmpty().WithMessage("VideoId cannot be empty.").When(x => x.VideoId != null);
        }
    }
}
