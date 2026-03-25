using FluentValidation;
using VidiMetrics.Application.DTOs.Core.Channels;

namespace VidiMetrics.Application.Validators.Core.Channels
{
    public class UpdateChannelValidator : AbstractValidator<UpdateChannelDto>
    {
        public UpdateChannelValidator()
        {
            RuleFor(x => x.Name).NotEmpty().WithMessage("Name cannot be empty.").When(x => x.Name != null);
            RuleFor(x => x.YouTubeChannelId).NotEmpty().WithMessage("YouTubeChannelId cannot be empty.").When(x => x.YouTubeChannelId != null);
            RuleFor(x => x.Description).NotEmpty().WithMessage("Description cannot be empty.").When(x => x.Description != null);
            RuleFor(x => x.CustomUrl).NotEmpty().WithMessage("CustomUrl cannot be empty.").When(x => x.CustomUrl != null);
        }
    }
}
