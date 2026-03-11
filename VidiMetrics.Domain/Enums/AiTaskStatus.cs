namespace VidiMetrics.Domain.Enums
{
    public enum AiTaskStatus
    {
        Pending = 0,    // Task created, waiting in queue
        Processing = 1, // AI is currently working on it
        Completed = 2,  // Task finished successfully
        Failed = 3,     // Task failed (check ErrorMessage)
        Cancelled = 4   // Task manually stopped by user
    }
}