using FluentValidation;
using VidiMetrics.Application.DTOs.Infra.ApiUsageQuotas;

namespace VidiMetrics.Application.Validators.Infra.ApiUsageQuotas
{
    public class UpdateApiUsageQuotaValidator : AbstractValidator<UpdateApiUsageQuotaDto>
    {
        public UpdateApiUsageQuotaValidator()
        {
            RuleFor(x => x.UserAccountId).NotEmpty().WithMessage("UserAccountId cannot be empty.").When(x => x.UserAccountId != null);
            RuleFor(x => x.ApiType).NotEmpty().WithMessage("ApiType cannot be empty.").When(x => x.ApiType != null);
            RuleFor(x => x.PeriodStart).NotEmpty().WithMessage("PeriodStart cannot be empty.").When(x => x.PeriodStart != null);
            RuleFor(x => x.PeriodEnd).NotEmpty().WithMessage("PeriodEnd cannot be empty.").When(x => x.PeriodEnd != null);
        }
    }
}
