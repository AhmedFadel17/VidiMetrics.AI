using FluentValidation;
using VidiMetrics.Application.DTOs.Core.Channels;

namespace VidiMetrics.Application.Validators.Core.Channels
{
    public class CreateChannelValidator : AbstractValidator<CreateChannelDto>
    {
        public CreateChannelValidator()
        {
            RuleFor(x => x.Name).NotEmpty().WithMessage("Name is required.");
        }
    }
}
