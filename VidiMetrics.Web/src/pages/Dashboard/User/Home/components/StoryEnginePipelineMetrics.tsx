import DashboardStatCard from '@/components/ui/Cards/DashboardStatCard'
import { ErrorScreen, LoadingScreen } from '@/components/ui/Feedback/StatusScreens';
import { useGetStoryEngineStatsQuery } from '@/store/apis';

export default function StoryEnginePipelineMetrics() {
    const { data: response, isLoading, error } = useGetStoryEngineStatsQuery();
    if (isLoading) return <LoadingScreen message="Loading stats..." />
    if (error) return <ErrorScreen message="Failed to load stats" />

    const stats = response?.data;

    return (
        <div className="">
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <DashboardStatCard
                    label="Shows"
                    value={stats?.totalShows ?? 0}
                    icon="layers"
                    variant="grid-box"
                    size="lg"
                    accent="cyan"
                />
                <DashboardStatCard
                    label="Episodes"
                    value={stats?.totalEpisodes ?? 0}
                    icon="airplay"
                    variant="grid-box"
                    size="lg"
                    accent="purple"
                />
                {/* <DashboardStatCard
                    label="Scenes Configured"
                    value={stats?.totalScenes ?? 0}
                    icon="scene"
                    variant="grid-box"
                    size="lg"
                    accent="cyan"
                /> */}
                <DashboardStatCard
                    label="Characters"
                    value={stats?.totalCharacters ?? 0}
                    icon="people"
                    variant="grid-box"
                    size="lg"
                    accent="purple"
                />
                <DashboardStatCard
                    label="Locations"
                    value={stats?.totalLocations ?? 0}
                    icon="location_on"
                    variant="grid-box"
                    size="lg"
                    accent="cyan"
                />
            </div>
        </div>
    )
}