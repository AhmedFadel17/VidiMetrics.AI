import EnvironmentCard from "@/components/ui/Cards/EnvironmentCard"
import { ErrorScreen, LoadingScreen } from "@/components/ui/Feedback/StatusScreens";
import { useGetEnvironmentsQuery } from "@/store/apis";
import { StoryEnvironment } from "@/types/models/storyEngine"
import { useNavigate } from "react-router-dom";

interface EnvironmentsSectionProps {
    showId: string
}

export default function EnvironmentsSection({ showId }: EnvironmentsSectionProps) {
    const { data: response, isLoading, error } = useGetEnvironmentsQuery({ showId, limit: 2 });
    const environments: StoryEnvironment[] = response?.data?.items || []
    const navigate = useNavigate();
    if (isLoading) return <LoadingScreen message="Loading Environments" />
    if (error) return <ErrorScreen onRetry={() => { }} title="Error" message="Failed to load environments" />
    return (
        <div className="glass-card rounded-[3rem] p-10 border border-white/5 h-full flex flex-col">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-headline font-bold text-white tracking-tight">Environments</h3>
                <span className="material-symbols-outlined text-white/20">landscape</span>
            </div>

            <div className="space-y-4 flex-grow">
                {environments.map((env, index) => (
                    <EnvironmentCard key={index} environment={env} />
                ))}
            </div>
            <div className="mt-4">
                <div className="flex items-center justify-center">
                    <button
                        onClick={() => navigate(`/dashboard/series/${showId}?tab=Environments`)}
                        className="text-xs font-black uppercase tracking-widest text-accent-cyan hover:text-primary transition-colors duration-300 flex items-center gap-2">

                        <span>View All</span>
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                </div>

                <button
                    onClick={() => navigate(`/dashboard/series/${showId}/environments/new`)}
                    className="mt-2 w-full glass-card hover:bg-white/10 px-6 py-4 rounded-xl flex items-center justify-center gap-3 border border-white/5 transition-all duration-300 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white">
                    Generate New World
                </button>
            </div>
        </div>
    )
}
