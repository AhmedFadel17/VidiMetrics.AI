using FluentValidation;
using VidiMetrics.Application.DTOs.Ai.AiTasks;

namespace VidiMetrics.Application.Validators.Ai.AiTasks
{
    public class UpdateAiTaskValidator : AbstractValidator<UpdateAiTaskDto>
    {
        public UpdateAiTaskValidator()
        {
            RuleFor(x => x.TaskType).NotEmpty().WithMessage("TaskType cannot be empty.").When(x => x.TaskType != null);
            RuleFor(x => x.Status).NotEmpty().WithMessage("Status cannot be empty.").When(x => x.Status != null);
            RuleFor(x => x.InputData).NotEmpty().WithMessage("InputData cannot be empty.").When(x => x.InputData != null);
            RuleFor(x => x.OutputData).NotEmpty().WithMessage("OutputData cannot be empty.").When(x => x.OutputData != null);
            RuleFor(x => x.ErrorMessage).NotEmpty().WithMessage("ErrorMessage cannot be empty.").When(x => x.ErrorMessage != null);
            RuleFor(x => x.VideoId).NotEmpty().WithMessage("VideoId cannot be empty.").When(x => x.VideoId != null);
        }
    }
}
