import { ErrorScreen, LoadingScreen } from "@/components/ui/Feedback/StatusScreens";
import { useGetCreditHistoryQuery } from "@/store/apis";


export default function CreditsLogsSection() {
    const { data: creditHistoryData, isLoading: isCreditHistoryLoading, error } = useGetCreditHistoryQuery();
    const creditLogs = creditHistoryData?.data || [];
    if (isCreditHistoryLoading) return <LoadingScreen message="Loading Credits Logs" />
    if (error) return <ErrorScreen title="Credits Logs Error" message="Failed to load credits logs" />
    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-xl font-display font-bold text-white">Usage & Credit Logs</h3>
                <p className="text-xs text-white/40 mt-1">View all your credits and usage history.</p>
            </div>
            <div className="bg-white/[0.01] border border-white/5 rounded-3xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/[0.02] text-[11px] font-bold uppercase tracking-wider text-white/40">
                            <th className="px-6 py-4">Action Details</th>
                            <th className="px-6 py-4">Timestamp</th>
                            <th className="px-6 py-4 text-right">Credits Delta</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03] text-sm text-white/80">
                        {creditLogs.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="px-6 py-10 text-center text-white/30 text-xs">
                                    No credit generation actions logged on this workspace yet.
                                </td>
                            </tr>
                        ) : (
                            creditLogs.map((log: any) => {
                                // In our database setup, a negative value implies a refund (returning credits)
                                const isRefund = log.amountDeducted < 0;
                                return (
                                    <tr key={log.id} className="hover:bg-white/[0.01] transition-colors">
                                        <td className="px-6 py-4 font-medium text-xs text-white/80">
                                            {log.description}
                                        </td>
                                        <td className="px-6 py-4 text-xs text-white/40">
                                            {new Date(log.timestamp).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-right font-mono text-xs font-bold">
                                            <span className={isRefund ? 'text-emerald-400' : 'text-white/60'}>
                                                {isRefund
                                                    ? `+${Math.abs(log.amountDeducted)}`
                                                    : `-${log.amountDeducted}`}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>

    );
}