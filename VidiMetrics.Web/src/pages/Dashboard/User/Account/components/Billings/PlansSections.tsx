import { ErrorScreen, LoadingScreen } from "@/components/ui/Feedback/StatusScreens";
import {
    useCancelSubscriptionMutation,
    useGetAllPlansQuery,
    useUpgradeSubscriptionMutation,
    useGetUserSubscriptionQuery
} from "@/store/apis";

export default function PlansSections() {
    const { data: userData, isLoading: isUserLoading, error: userError } = useGetUserSubscriptionQuery();
    const { data: plansData, isLoading: isPlansLoading, error: plansError } = useGetAllPlansQuery();
    const [upgradeSubscription] = useUpgradeSubscriptionMutation();
    const [cancelSubscription, { isLoading: isCanceling }] = useCancelSubscriptionMutation();

    const userSubscription = userData?.data;
    const plans = plansData?.data || [];

    // Find matching full plan object details from database mapping arrays
    const activePlanDetails = plans.find(p => p.id === userSubscription?.planId);

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
        if (!window.confirm('Are you sure you want to cancel your active subscription plan allocations?')) return;
        try {
            await cancelSubscription().unwrap();
            alert('Subscription cancelled successfully.');
        } catch (err) {
            console.error('Cancellation failed:', err);
        }
    };


    if (isUserLoading || isPlansLoading) return <LoadingScreen message="Loading Plans" />
    if (userError || plansError) return <ErrorScreen title="Plans Error" message="Failed to load plans" />
    return (
        <div className="space-y-10">

            {userSubscription && (
                <div className="glass-panel p-6 rounded-3xl relative overflow-hidden border border-white/5 bg-white/[0.01] bg-gradient-to-r from-accent-purple/[0.03] to-transparent">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent-purple/5 rounded-full blur-3xl"></div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-accent-purple bg-accent-purple/10 px-2.5 py-1 rounded-md">
                                    Active Contract
                                </span>
                                {userSubscription.cancelledAt && (
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-red-400 bg-red-500/10 px-2.5 py-1 rounded-md">
                                        Cancellation Pending
                                    </span>
                                )}
                            </div>

                            <h3 className="text-2xl font-display font-black text-white">
                                {activePlanDetails?.name || 'Free Account Tier'}
                            </h3>

                            <p className="text-xs text-white/60 font-medium">
                                {userSubscription.cancelledAt ? (
                                    <span className="text-red-400/80">
                                        Access will terminate automatically on: {new Date(userSubscription.currentPeriodEnd).toLocaleDateString()}
                                    </span>
                                ) : (
                                    <span className="text-white/40 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm text-accent-purple">sync</span>
                                        Next automated renewal run: {new Date(userSubscription.currentPeriodEnd).toLocaleDateString()}
                                    </span>
                                )}
                            </p>
                        </div>

                        <div className="flex items-center gap-3 self-end md:self-center">
                            <a
                                href="#tier-matrix"
                                className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all"
                            >
                                See Other Plans
                            </a>

                            {!userSubscription.cancelledAt && (
                                <button
                                    onClick={handleCancelClick}
                                    disabled={isCanceling}
                                    className="px-4 py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all disabled:opacity-40"
                                >
                                    {isCanceling ? 'Processing...' : 'Cancel Plan'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div id="tier-matrix" className="space-y-6 scroll-mt-6">
                <div>
                    <h3 className="text-xl font-display font-bold text-white">Change Subscription Plan</h3>
                    <p className="text-xs text-white/40 mt-1">Scale up your compute power allocations directly below</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {plans.map((plan) => {
                        const isCurrentPlan = userSubscription?.planId === plan.id;

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
                                    disabled={isCurrentPlan}
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