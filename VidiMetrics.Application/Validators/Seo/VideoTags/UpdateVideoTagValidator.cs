using FluentValidation;
using VidiMetrics.Application.DTOs.Seo.VideoTags;

namespace VidiMetrics.Application.Validators.Seo.VideoTags
{
    public class UpdateVideoTagValidator : AbstractValidator<UpdateVideoTagDto>
    {
        public UpdateVideoTagValidator()
        {
            RuleFor(x => x.Name).NotEmpty().WithMessage("Name cannot be empty.").When(x => x.Name != null);
            RuleFor(x => x.VideoId).NotEmpty().WithMessage("VideoId cannot be empty.").When(x => x.VideoId != null);
        }
    }
}
