using FluentValidation;
using VidiMetrics.Application.DTOs.Seo.SeoAudits;

namespace VidiMetrics.Application.Validators.Seo.SeoAudits
{
    public class CreateSeoAuditValidator : AbstractValidator<CreateSeoAuditDto>
    {
        public CreateSeoAuditValidator()
        {
            RuleFor(x => x.CriticalIssues).NotEmpty().WithMessage("CriticalIssues is required.");
            RuleFor(x => x.OptimizationSuggestions).NotEmpty().WithMessage("OptimizationSuggestions is required.");
            RuleFor(x => x.VideoId).NotEmpty().WithMessage("VideoId is required.");
        }
    }
}
