using FluentValidation;
using VidiMetrics.Application.DTOs.Core.LocalVideos;

namespace VidiMetrics.Application.Validators.Core.LocalVideos
{
    public class CreateLocalVideoValidator : AbstractValidator<CreateLocalVideoDto>
    {
        public CreateLocalVideoValidator()
        {
            RuleFor(x => x.StorageUrl).NotEmpty().WithMessage("StorageUrl is required.");
            RuleFor(x => x.FileExtension).NotEmpty().WithMessage("FileExtension is required.");
        }
    }
}
