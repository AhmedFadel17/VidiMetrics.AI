using FluentValidation;
using VidiMetrics.Application.DTOs.Seo.KeywordRankings;

namespace VidiMetrics.Application.Validators.Seo.KeywordRankings
{
    public class CreateKeywordRankingValidator : AbstractValidator<CreateKeywordRankingDto>
    {
        public CreateKeywordRankingValidator()
        {
            RuleFor(x => x.Id).NotEmpty().WithMessage("Id is required.");
            RuleFor(x => x.CapturedAt).NotEmpty().WithMessage("CapturedAt is required.");
            RuleFor(x => x.KeywordId).NotEmpty().WithMessage("KeywordId is required.");
        }
    }
}
