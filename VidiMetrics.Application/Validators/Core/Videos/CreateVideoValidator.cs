using FluentValidation;
using VidiMetrics.Application.DTOs.Core.Videos;

namespace VidiMetrics.Application.Validators.Core.Videos
{
    public class CreateVideoValidator : AbstractValidator<CreateVideoDto>
    {
        public CreateVideoValidator()
        {
            RuleFor(x => x.Title).NotEmpty().WithMessage("Title is required.");
            RuleFor(x => x.Duration).NotEmpty().WithMessage("Duration is required.");
            RuleFor(x => x.ChannelId).NotEmpty().WithMessage("ChannelId is required.");
        }
    }
}
