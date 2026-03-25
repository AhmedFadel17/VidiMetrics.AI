using FluentValidation;
using VidiMetrics.Application.DTOs.Seo.SeoAudits;

namespace VidiMetrics.Application.Validators.Seo.SeoAudits
{
    public class UpdateSeoAuditValidator : AbstractValidator<UpdateSeoAuditDto>
    {
        public UpdateSeoAuditValidator()
        {
            RuleFor(x => x.CriticalIssues).NotEmpty().WithMessage("CriticalIssues cannot be empty.").When(x => x.CriticalIssues != null);
            RuleFor(x => x.OptimizationSuggestions).NotEmpty().WithMessage("OptimizationSuggestions cannot be empty.").When(x => x.OptimizationSuggestions != null);
            RuleFor(x => x.VideoId).NotEmpty().WithMessage("VideoId cannot be empty.").When(x => x.VideoId != null);
        }
    }
}
