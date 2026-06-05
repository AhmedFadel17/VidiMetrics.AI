using System.IO;
using System.Linq;
using FluentValidation;
using Microsoft.AspNetCore.Http;
using VidiMetrics.Application.DTOs.Infra.UserProfiles;

namespace VidiMetrics.Application.Validators.Infra.UserProfiles;

public class UploadProfilePictureValidator : AbstractValidator<UploadProfilePictureDto>
{
    private readonly string[] _permittedExtensions = { ".jpg", ".jpeg", ".png" };
    private readonly string[] _permittedMimeTypes = { "image/jpeg", "image/png", "image/jpg" };
    private const long MaxFileSizeInBytes = 5 * 1024 * 1024;


    public UploadProfilePictureValidator()
    {
        RuleFor(x => x.File)
            .NotNull().WithMessage("A files-payload stream binary must be supplied.")
            .Must(file => file.Length > 0).WithMessage("Empty file payload rejected.")
            .Must(file => file.Length <= MaxFileSizeInBytes).WithMessage("File size cannot exceed our security boundary constraint of 5MB.");

        RuleFor(x => x.File)
            .Must(ValidateExtension).WithMessage("Unsupported image file extension format type.")
            .Must(ValidateMimeType).WithMessage("Mime signature header validation check mismatch failure.");
    }

    private bool ValidateExtension(IFormFile file)
    {
        var ext = Path.GetExtension(file.FileName).ToLower();
        return !string.IsNullOrEmpty(ext) && _permittedExtensions.Contains(ext);
    }

    private bool ValidateMimeType(IFormFile file)
    {
        return _permittedMimeTypes.Contains(file.ContentType.ToLower());
    }
}
