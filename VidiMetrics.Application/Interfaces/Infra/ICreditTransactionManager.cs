using VidiMetrics.Domain.Enums.Infra;

namespace VidiMetrics.Application.Interfaces.Infra;

public interface ICreditTransactionManager
{
    Task<T> ExecuteWithCreditsAsync<T>(
        Guid userId,
        CreditActionType actionType,
        string description,
        Func<Task<T>> actionToExecute);
}
