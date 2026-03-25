using FluentValidation;
using VidiMetrics.Application.DTOs.Infra.ApiUsageQuotas;

namespace VidiMetrics.Application.Validators.Infra.ApiUsageQuotas
{
    public class CreateApiUsageQuotaValidator : AbstractValidator<CreateApiUsageQuotaDto>
    {
        public CreateApiUsageQuotaValidator()
        {
            RuleFor(x => x.Id).NotEmpty().WithMessage("Id is required.");
            RuleFor(x => x.UserAccountId).NotEmpty().WithMessage("UserAccountId is required.");
            RuleFor(x => x.ApiType).NotEmpty().WithMessage("ApiType is required.");
            RuleFor(x => x.PeriodStart).NotEmpty().WithMessage("PeriodStart is required.");
            RuleFor(x => x.PeriodEnd).NotEmpty().WithMessage("PeriodEnd is required.");
        }
    }
}
