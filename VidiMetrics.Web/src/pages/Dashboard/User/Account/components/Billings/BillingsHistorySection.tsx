import { ErrorScreen, LoadingScreen } from "@/components/ui/Feedback/StatusScreens";
import { useGetSubscriptionHistoryQuery } from "@/store/apis";

export default function BillingsHistorySection() {
    const { data: historyData, isLoading: isHistoryLoading, error } = useGetSubscriptionHistoryQuery();

    const billingHistory = historyData?.data || [];
    if (isHistoryLoading) return <LoadingScreen message="Loading Billings History" />
    if (error) return <ErrorScreen title="Billing History Error" message="Failed to load billing history" />
    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-xl font-display font-bold text-white">Billing History</h3>
                <p className="text-xs text-white/40 mt-1">View all your billing history and invoices</p>
            </div>

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
                                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${history.status === 1
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
    );
}