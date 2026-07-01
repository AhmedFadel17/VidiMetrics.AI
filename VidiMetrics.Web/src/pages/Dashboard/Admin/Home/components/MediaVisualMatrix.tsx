import DashboardStatCard from "@/components/ui/Cards/DashboardStatCard";
import { ErrorScreen, LoadingScreen } from "@/components/ui/Feedback/StatusScreens";
import { useGetMediaStatsQuery } from "@/store/apis"
import { useNavigate } from "react-router-dom";

export default function MediaActivityCenter() {
    const navigate = useNavigate();
    const { data: response, isLoading, error } = useGetMediaStatsQuery();

    if (isLoading) return <LoadingScreen message="Loading shows..." />
    if (error) return <ErrorScreen message="Failed to load shows" />
    const data = response?.data;
    return (
        <div className="space-y-8">

            <div className="space-y-6">
                <div className="flex justify-between items-end">
                    <div
                        onClick={() => navigate("/dashboard/media")}
                        className="flex items-center gap-3 cursor-pointer hover:scale-105 transition-all duration-300">
                        <span className="material-symbols-outlined text-accent-cyan">video_library</span>
                        <h2 className="text-xl font-bold text-white tracking-wide">Media</h2>
                    </div>
                </div>
                <div className="glass-card rounded-3xl p-8 border border-white/5">

                    <div className="grid grid-cols-3 gap-4">
                        <DashboardStatCard
                            label="Videos"
                            value={data?.totalVideos ?? 0}
                            icon="play_circle"
                            accent="cyan"
                            size="sm"
                            onClick={() => navigate(`/dashboard/media?tab=Videos`)}
                        />
                        <DashboardStatCard
                            label="Images"
                            value={data?.totalImages ?? 0}
                            icon="photo"
                            accent="purple"
                            size="sm"
                            onClick={() => navigate(`/dashboard/media?tab=Images`)}
                        />
                        <DashboardStatCard
                            label="Scripts"
                            value={data?.totalScripts ?? 0}
                            icon="description"
                            accent="purple"
                            size="sm"
                            onClick={() => navigate(`/dashboard/media?tab=Scripts`)}
                        />
                    </div>


                    <div className="relative overflow-hidden mt-3 p-2">
                        <div className="space-y-4">
                            <DashboardStatCard
                                label="Assets Generated"
                                value={data?.totalGenerations ?? 0}
                                icon="live_tv"
                                variant="row-strip"
                                size="lg"
                                accent="cyan"
                            />

                            <DashboardStatCard
                                label="Unlinked Assets"
                                value={data?.totalUnlinked ?? 0}
                                icon="block"
                                variant="row-strip"
                                size="sm"
                                accent="amber"
                            />

                        </div>
                    </div>

                </div>
            </div>
        </div>

    )
}
