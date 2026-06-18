import DashboardStatCard from "@/components/ui/Cards/DashboardStatCard";
import { ErrorScreen, LoadingScreen } from "@/components/ui/Feedback/StatusScreens";
import { useGetCopilotStatsQuery, useGetMyChannelsQuery } from "@/store/apis"
import { useNavigate } from "react-router-dom";

export default function AICopilotActivityCenter() {
    const navigate = useNavigate();
    const { data: response, isLoading, error } = useGetCopilotStatsQuery();

    if (isLoading) return <LoadingScreen message="Loading shows..." />
    if (error) return <ErrorScreen message="Failed to load shows" />
    const data = response?.data;
    return (
        <div className="space-y-8">

            <div className="space-y-6">
                <div className="flex justify-between items-end">
                    <div
                        onClick={() => navigate("/dashboard/copilot")}
                        className="flex items-center gap-3 cursor-pointer hover:scale-105 transition-all duration-300">
                        <span className="material-symbols-outlined text-accent-cyan">robot</span>
                        <h2 className="text-xl font-bold text-white tracking-wide">AI Copilot</h2>
                    </div>
                </div>
                <div className="glass-card rounded-3xl p-8 border border-white/5">

                    <div className="grid grid-cols-2 gap-4">
                        <DashboardStatCard
                            label="Total Chats"
                            value={data?.totalChats ?? 0}
                            icon="chat"
                            accent="cyan"
                            size="md"
                            onClick={() => navigate(`/dashboard/copilot`)}
                        />
                        <DashboardStatCard
                            label="Total Drafts"
                            value={data?.totalDrafts ?? 0}
                            icon="drafts"
                            accent="purple"
                            size="md"
                            onClick={() => navigate(`/dashboard/copilot`)}
                        />


                    </div>


                    <div className="relative overflow-hidden mt-3 p-2">
                        <div className="space-y-4">
                            <DashboardStatCard
                                label="Pending Actions"
                                value={data?.pendingDrafts ?? 0}
                                icon="pending"
                                variant="row-strip"
                                size="lg"
                                accent="cyan"
                            />
                            <DashboardStatCard
                                label="Executing Engine"
                                value={data?.executedDrafts ?? 0}
                                icon="sync"
                                variant="row-strip"
                                size="md"
                                accent="purple"
                            />
                            <DashboardStatCard
                                label="Rejected Drafts"
                                value={data?.rejectedDrafts ?? 0}
                                icon="block"
                                variant="row-strip"
                                size="sm"
                                accent="amber"
                            />
                            <DashboardStatCard
                                label="Failed Runs"
                                value={data?.failedDrafts ?? 0}
                                icon="error"
                                variant="row-strip"
                                size="sm"
                                accent="rose"
                            />
                        </div>
                    </div>

                </div>
            </div>
        </div>

    )
}
