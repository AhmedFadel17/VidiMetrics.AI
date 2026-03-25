using FluentValidation;
using VidiMetrics.Application.DTOs.Seo.Keywords;

namespace VidiMetrics.Application.Validators.Seo.Keywords
{
    public class CreateKeywordValidator : AbstractValidator<CreateKeywordDto>
    {
        public CreateKeywordValidator()
        {
            RuleFor(x => x.Text).NotEmpty().WithMessage("Text is required.");
            RuleFor(x => x.Language).NotEmpty().WithMessage("Language is required.");
            RuleFor(x => x.VideoId).NotEmpty().WithMessage("VideoId is required.");
        }
    }
}
