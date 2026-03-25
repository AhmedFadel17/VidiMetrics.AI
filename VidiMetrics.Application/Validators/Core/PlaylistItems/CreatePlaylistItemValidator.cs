using FluentValidation;
using VidiMetrics.Application.DTOs.Core.PlaylistItems;

namespace VidiMetrics.Application.Validators.Core.PlaylistItems
{
    public class CreatePlaylistItemValidator : AbstractValidator<CreatePlaylistItemDto>
    {
        public CreatePlaylistItemValidator()
        {
            RuleFor(x => x.PlaylistId).NotEmpty().WithMessage("PlaylistId is required.");
            RuleFor(x => x.VideoId).NotEmpty().WithMessage("VideoId is required.");
        }
    }
}
