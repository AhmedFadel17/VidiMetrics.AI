import {
  useGetSubscriptionHistoryQuery,
  useGetAllPlansQuery,
  useUpgradeSubscriptionMutation,
  useCancelSubscriptionMutation
} from '@/store/apis';

interface BillingsTabProps {
  wallet: any;
}
export default function BillingsTab({ wallet }: BillingsTabProps) {
  const { data: historyData, isLoading: isHistoryLoading } = useGetSubscriptionHistoryQuery();
  const { data: plansData, isLoading: isPlansLoading } = useGetAllPlansQuery();

  const [upgradeSubscription, { isLoading: isUpgrading }] = useUpgradeSubscriptionMutation();
  const [cancelSubscription, { isLoading: isCanceling }] = useCancelSubscriptionMutation();

  const billingHistory = historyData?.data || [];
  const plans = plansData?.data || [];

  const handlePlanAction = async (planId: string, isCurrentPlan: boolean) => {
    if (isCurrentPlan) return;
    try {
      await upgradeSubscription({ planId }).unwrap();
      alert('Plan updated successfully!');
    } catch (err) {
      console.error('Failed to change plan:', err);
    }
  };

  const handleCancelClick = async () => {
    if (!window.confirm('Are you sure you want to cancel your active subscription?')) return;
    try {
      await cancelSubscription().unwrap();
      alert('Subscription cancelled successfully.');
    } catch (err) {
      console.error('Cancellation failed:', err);
    }
  };

  const isLoading = isHistoryLoading || isPlansLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-purple"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Top Section: Billing History & Current Plan Summary */}
      <div className="grid grid-cols-12 gap-6">

        {/* Left Side: Ledger/Invoice History Grid */}
        <div className="col-span-12 lg:col-span-7 space-y-4">
          <h3 className="text-xl font-display font-bold text-white mb-6">
            Billing History
          </h3>
          <div className="bg-white/[0.01] border border-white/5 rounded-3xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02] text-[11px] font-bold uppercase tracking-wider text-white/40">
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Billing Period</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03] text-sm text-white/80">
                {billingHistory.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-10 text-center text-white/30 text-xs">
                      No invoices found or associated with this account profile.
                    </td>
                  </tr>
                ) : (
                  billingHistory.map((history) => (
                    <tr key={history.id} className="hover:bg-white/[0.01] transition-colors">
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${history.status === 1 // Assuming 1 = Active/Paid
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10'
                          : 'bg-white/5 text-white/40'
                          }`}>
                          {history.status === 1 ? 'Paid' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-xs text-white/60">
                        {new Date(history.startDate).toLocaleDateString()} — {history.cancelledAt ? new Date(history.cancelledAt).toLocaleDateString() : 'Present'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-xs font-bold text-accent-purple hover:text-white transition-colors">
                          View Receipt
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Active Subscription Card */}
        <div className="col-span-12 lg:col-span-5">
          <div className="glass-panel p-8 rounded-3xl relative overflow-hidden border border-white/5 bg-white/[0.01]">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent-purple/10 rounded-full blur-3xl"></div>
            <h3 className="text-xl font-display font-bold text-white mb-6">Active Plan</h3>

            <div className="space-y-4">
              <div className="bg-gradient-to-br from-accent-purple/10 to-transparent p-6 rounded-2xl border border-accent-purple/20">
                <p className="text-[10px] font-bold uppercase tracking-widest text-accent-purple mb-1">
                  Current Tier Status
                </p>
                <h4 className="text-2xl font-display font-extrabold text-white mb-2">
                  {wallet?.remainingCredits !== undefined ? 'Active Wallet Member' : 'Free Tier'}
                </h4>
                <div className="flex items-center gap-2 text-xs text-white/40 mb-6">
                  <span className="material-symbols-outlined text-sm text-accent-purple">
                    calendar_month
                  </span>
                  Refreshes: {wallet?.nextResetDate ? new Date(wallet.nextResetDate).toLocaleDateString() : 'End of Month'}
                </div>

                <button
                  onClick={handleCancelClick}
                  disabled={isCanceling}
                  className="w-full py-3 bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-red-500/10 hover:border-red-500/20 font-bold rounded-xl transition-all text-xs uppercase tracking-wider disabled:opacity-40"
                >
                  {isCanceling ? 'Cancelling...' : 'Cancel Subscription'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Upgrades Tier Matrix */}
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-display font-bold text-white">Change Subscription Plan</h3>
          <p className="text-xs text-white/40 mt-1">Scale up your compute power allocations directly below</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            // Evaluates if this plan matches the user's current tier configuration limit
            const isCurrentPlan = wallet?.totalCreditsAvailable === plan.baseMonthlyCredits;

            return (
              <div
                key={plan.id}
                className={`p-6 rounded-3xl border flex flex-col justify-between transition-all relative overflow-hidden ${isCurrentPlan
                  ? 'bg-accent-purple/5 border-accent-purple shadow-[0_0_30px_rgba(138,43,226,0.15)]'
                  : 'bg-white/[0.01] border-white/5 hover:border-white/10'
                  }`}
              >
                {isCurrentPlan && (
                  <span className="absolute top-3 right-3 bg-accent-purple text-white font-bold text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full">
                    Current
                  </span>
                )}

                <div>
                  <h4 className="text-lg font-bold text-white mb-1">{plan.name}</h4>
                  <p className="text-xs text-white/40 mb-4 min-h-[32px]">{plan.description}</p>

                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-3xl font-black text-white">${Number(plan.monthlyPrice).toFixed(0)}</span>
                    <span className="text-xs text-white/40">/ month</span>
                  </div>

                  <div className="space-y-2.5 border-t border-white/5 pt-4 mb-6">
                    <div className="flex items-center gap-2 text-xs text-white/70">
                      <span className="material-symbols-outlined text-sm text-accent-purple">star</span>
                      <span>{plan.baseMonthlyCredits.toLocaleString()} Generation Credits</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/70">
                      <span className="material-symbols-outlined text-sm text-accent-purple">movie</span>
                      <span>Up to {plan.maxChannelsAllowed} Channels Sync</span>
                    </div>
                  </div>
                </div>

                <button
                  disabled={isCurrentPlan || isUpgrading}
                  onClick={() => handlePlanAction(plan.id, isCurrentPlan)}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all uppercase tracking-wider ${isCurrentPlan
                    ? 'bg-accent-purple/20 text-accent-purple border border-accent-purple/30 cursor-not-allowed'
                    : 'bg-white text-black hover:scale-[1.02] active:scale-95'
                    }`}
                >
                  {isCurrentPlan ? 'Your Active Plan' : `Upgrade to ${plan.name}`}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}