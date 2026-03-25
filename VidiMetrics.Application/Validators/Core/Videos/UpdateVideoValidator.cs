using FluentValidation;
using VidiMetrics.Application.DTOs.Core.Videos;

namespace VidiMetrics.Application.Validators.Core.Videos
{
    public class UpdateVideoValidator : AbstractValidator<UpdateVideoDto>
    {
        public UpdateVideoValidator()
        {
            RuleFor(x => x.Title).NotEmpty().WithMessage("Title cannot be empty.").When(x => x.Title != null);
            RuleFor(x => x.Description).NotEmpty().WithMessage("Description cannot be empty.").When(x => x.Description != null);
            RuleFor(x => x.Duration).NotEmpty().WithMessage("Duration cannot be empty.").When(x => x.Duration != null);
            RuleFor(x => x.ThumbnailUrl).NotEmpty().WithMessage("ThumbnailUrl cannot be empty.").When(x => x.ThumbnailUrl != null);
            RuleFor(x => x.LastRankCheck).NotEmpty().WithMessage("LastRankCheck cannot be empty.").When(x => x.LastRankCheck != null);
            RuleFor(x => x.ChannelId).NotEmpty().WithMessage("ChannelId cannot be empty.").When(x => x.ChannelId != null);
        }
    }
}
