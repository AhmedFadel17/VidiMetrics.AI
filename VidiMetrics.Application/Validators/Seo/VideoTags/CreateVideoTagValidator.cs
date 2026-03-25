using FluentValidation;
using VidiMetrics.Application.DTOs.Seo.VideoTags;

namespace VidiMetrics.Application.Validators.Seo.VideoTags
{
    public class CreateVideoTagValidator : AbstractValidator<CreateVideoTagDto>
    {
        public CreateVideoTagValidator()
        {
            RuleFor(x => x.Name).NotEmpty().WithMessage("Name is required.");
            RuleFor(x => x.VideoId).NotEmpty().WithMessage("VideoId is required.");
        }
    }
}
