using FluentValidation;
using VidiMetrics.Application.DTOs.Ai.AiTasks;

namespace VidiMetrics.Application.Validators.Ai.AiTasks
{
    public class CreateAiTaskValidator : AbstractValidator<CreateAiTaskDto>
    {
        public CreateAiTaskValidator()
        {
            RuleFor(x => x.TaskType).NotEmpty().WithMessage("TaskType is required.");
            RuleFor(x => x.Status).NotEmpty().WithMessage("Status is required.");
            RuleFor(x => x.VideoId).NotEmpty().WithMessage("VideoId is required.");
        }
    }
}
