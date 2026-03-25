using FluentValidation;
using VidiMetrics.Application.DTOs.Seo.Keywords;

namespace VidiMetrics.Application.Validators.Seo.Keywords
{
    public class UpdateKeywordValidator : AbstractValidator<UpdateKeywordDto>
    {
        public UpdateKeywordValidator()
        {
            RuleFor(x => x.Text).NotEmpty().WithMessage("Text cannot be empty.").When(x => x.Text != null);
            RuleFor(x => x.Language).NotEmpty().WithMessage("Language cannot be empty.").When(x => x.Language != null);
            RuleFor(x => x.VideoId).NotEmpty().WithMessage("VideoId cannot be empty.").When(x => x.VideoId != null);
        }
    }
}
