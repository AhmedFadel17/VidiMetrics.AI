import { ErrorScreen, LoadingScreen } from "@/components/ui/Feedback/StatusScreens";
import { useGetBalanceQuery } from "@/store/apis";


export default function CreditsSection() {
    const { data: balanceData, isLoading: isBalanceLoading, error } = useGetBalanceQuery();

    const wallet = balanceData?.data;
    const total = wallet?.totalCreditsAvailable ?? 0;
    const used = wallet?.creditsUsed ?? 0;
    const remaining = Math.max(0, total - used);
    const fillPercentage = total > 0 ? (remaining / total) * 100 : 0;
    if (isBalanceLoading) return <LoadingScreen message="Loading Balance" />
    if (error) return <ErrorScreen title="Credits Balance Error" message="Failed to load credits balance" />
    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-xl font-display font-bold text-white">Available Credits</h3>
                <p className="text-xs text-white/40 mt-1">Manage your generation credits and top-up when needed</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/40 mb-6">
                <span className="material-symbols-outlined text-sm text-accent-purple">
                    calendar_month
                </span>
                Refreshes: {wallet?.nextResetDate ? new Date(wallet.nextResetDate).toLocaleDateString() : 'End of Month'}
            </div>
            <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between h-40 group hover:bg-surface-container-high transition-all">
                <div className="flex justify-between items-start">
                    <span className="material-symbols-outlined text-tertiary text-3xl">
                        bolt
                    </span>
                    <span className="text-xs font-label text-on-surface-variant uppercase tracking-wider">
                        AI Credits
                    </span>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                        <span className="font-bold text-tertiary">{remaining} Left</span>
                        <span className="opacity-50">{total} Total</span>
                    </div>
                    <div className="w-full bg-surface-container-lowest h-1.5 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-tertiary to-tertiary-container h-full rounded-full shadow-[0_0_8px_rgba(255,176,205,0.4)]"
                            style={{ width: `${fillPercentage}%` }}
                        ></div>
                    </div>
                </div>

            </div>
        </div>
    );
}