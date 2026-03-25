using FluentValidation;
using VidiMetrics.Application.DTOs.Seo.KeywordRankings;

namespace VidiMetrics.Application.Validators.Seo.KeywordRankings
{
    public class UpdateKeywordRankingValidator : AbstractValidator<UpdateKeywordRankingDto>
    {
        public UpdateKeywordRankingValidator()
        {
            RuleFor(x => x.CapturedAt).NotEmpty().WithMessage("CapturedAt cannot be empty.").When(x => x.CapturedAt != null);
            RuleFor(x => x.KeywordId).NotEmpty().WithMessage("KeywordId cannot be empty.").When(x => x.KeywordId != null);
        }
    }
}
