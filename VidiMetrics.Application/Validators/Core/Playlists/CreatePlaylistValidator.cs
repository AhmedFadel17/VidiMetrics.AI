using FluentValidation;
using VidiMetrics.Application.DTOs.Core.Playlists;

namespace VidiMetrics.Application.Validators.Core.Playlists
{
    public class CreatePlaylistValidator : AbstractValidator<CreatePlaylistDto>
    {
        public CreatePlaylistValidator()
        {
            RuleFor(x => x.Title).NotEmpty().WithMessage("Title is required.");
            RuleFor(x => x.ChannelId).NotEmpty().WithMessage("ChannelId is required.");
        }
    }
}
