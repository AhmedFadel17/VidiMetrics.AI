using Microsoft.EntityFrameworkCore;
using VidiMetrics.Application.Interfaces.Infra;
using VidiMetrics.DataAccess.Repositories.Infra.CreditCostRules;

using VidiMetrics.DataAccess.Repositories.Infra.CreditTransactionLedgers;
using VidiMetrics.DataAccess.Repositories.Infra.UserCreditWallets;
using VidiMetrics.Domain.Enums.Infra;
using VidiMetrics.Domain.Models.Infra;

namespace VidiMetrics.Application.Services.Infra;

public class CreditTransactionManager : ICreditTransactionManager
{
    private readonly IUserCreditWalletsRepository _walletsRepository;
    private readonly ICreditTransactionLedgersRepository _ledgersRepository;
    private readonly ICreditCostRulesRepository _rulesRepository;


    public CreditTransactionManager(
        IUserCreditWalletsRepository walletsRepository,

        ICreditTransactionLedgersRepository ledgersRepository,
        ICreditCostRulesRepository rulesRepository)
    {
        _walletsRepository = walletsRepository;
        _ledgersRepository = ledgersRepository;
        _rulesRepository = rulesRepository;
    }

    public async Task<T> ExecuteWithCreditsAsync<T>(
        Guid userId,
        CreditActionType actionType,
        string description,
        Func<Task<T>> actionToExecute)
    {
        var wallet = await _walletsRepository.Query()
            .FirstOrDefaultAsync(w => w.UserId == userId);

        if (wallet == null)
        {
            throw new Exception("No active credit balance wallet profile found associated with this user.");
        }

        var rule = await _rulesRepository.Query()
            .FirstOrDefaultAsync(r => r.ActionType == actionType && r.IsEnabled);

        if (rule == null)
        {
            throw new Exception($"The action '{actionType}' is currently disabled or has no defined cost configuration rules.");
        }

        await DeductCreditsAsync(wallet, actionType, rule.CreditCost, description);

        try
        {
            return await actionToExecute();
        }
        catch (Exception)
        {
            await RefundCreditsAsync(wallet, actionType, rule.CreditCost, $"Refund: Failed - {description}");
            throw;

        }
    }

    private async Task DeductCreditsAsync(UserCreditWallet wallet, CreditActionType actionType, int cost, string description)
    {
        if (!wallet.HasBalanceForAction(cost))
        {
            throw new Exception($"Insufficient credits. This action requires {cost} credits, but you only have {wallet.RemainingCredits} remaining.");
        }

        wallet.CreditsUsed += cost;
        _walletsRepository.Update(wallet);

        var ledgerEntry = new CreditTransactionLedger
        {
            Id = Guid.NewGuid(),
            UserId = wallet.UserId,
            ActionType = actionType,
            AmountDeducted = cost,

            Description = description,
            Timestamp = DateTime.UtcNow
        };

        await _ledgersRepository.AddAsync(ledgerEntry);
        await _walletsRepository.SaveChangesAsync();
    }

    private async Task RefundCreditsAsync(UserCreditWallet wallet, CreditActionType actionType, int cost, string description)
    {

        if (wallet == null) return;

        wallet.CreditsUsed = Math.Max(0, wallet.CreditsUsed - cost);
        _walletsRepository.Update(wallet);

        var refundLedgerEntry = new CreditTransactionLedger
        {
            Id = Guid.NewGuid(),
            UserId = wallet.UserId,
            ActionType = actionType,
            AmountDeducted = -cost,

            Description = description,
            Timestamp = DateTime.UtcNow
        };

        await _ledgersRepository.AddAsync(refundLedgerEntry);
        await _walletsRepository.SaveChangesAsync();
    }
}