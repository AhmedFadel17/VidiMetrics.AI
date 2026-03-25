using FluentValidation;
using VidiMetrics.Application.DTOs.Core.LocalVideos;

namespace VidiMetrics.Application.Validators.Core.LocalVideos
{
    public class UpdateLocalVideoValidator : AbstractValidator<UpdateLocalVideoDto>
    {
        public UpdateLocalVideoValidator()
        {
            RuleFor(x => x.StorageUrl).NotEmpty().WithMessage("StorageUrl cannot be empty.").When(x => x.StorageUrl != null);
            RuleFor(x => x.FileExtension).NotEmpty().WithMessage("FileExtension cannot be empty.").When(x => x.FileExtension != null);
            RuleFor(x => x.ProcessingError).NotEmpty().WithMessage("ProcessingError cannot be empty.").When(x => x.ProcessingError != null);
        }
    }
}
