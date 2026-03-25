using FluentValidation;
using VidiMetrics.Application.DTOs.Core.PlaylistItems;

namespace VidiMetrics.Application.Validators.Core.PlaylistItems
{
    public class UpdatePlaylistItemValidator : AbstractValidator<UpdatePlaylistItemDto>
    {
        public UpdatePlaylistItemValidator()
        {
            RuleFor(x => x.Note).NotEmpty().WithMessage("Note cannot be empty.").When(x => x.Note != null);
            RuleFor(x => x.PlaylistId).NotEmpty().WithMessage("PlaylistId cannot be empty.").When(x => x.PlaylistId != null);
            RuleFor(x => x.VideoId).NotEmpty().WithMessage("VideoId cannot be empty.").When(x => x.VideoId != null);
        }
    }
}
