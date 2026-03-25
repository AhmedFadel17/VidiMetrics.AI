using FluentValidation;
using VidiMetrics.Application.DTOs.Core.Playlists;

namespace VidiMetrics.Application.Validators.Core.Playlists
{
    public class UpdatePlaylistValidator : AbstractValidator<UpdatePlaylistDto>
    {
        public UpdatePlaylistValidator()
        {
            RuleFor(x => x.Title).NotEmpty().WithMessage("Title cannot be empty.").When(x => x.Title != null);
            RuleFor(x => x.Description).NotEmpty().WithMessage("Description cannot be empty.").When(x => x.Description != null);
            RuleFor(x => x.YouTubePlaylistId).NotEmpty().WithMessage("YouTubePlaylistId cannot be empty.").When(x => x.YouTubePlaylistId != null);
            RuleFor(x => x.ChannelId).NotEmpty().WithMessage("ChannelId cannot be empty.").When(x => x.ChannelId != null);
        }
    }
}
