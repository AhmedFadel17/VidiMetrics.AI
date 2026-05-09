import EpisodeCard from "@/components/ui/Cards/EposideCard"
import { ErrorScreen, LoadingScreen } from "@/components/ui/Feedback/StatusScreens"
import { useGetEpisodesQuery } from "@/store/apis"
import { Episode } from "@/types/models/storyEngine"
import { useNavigate } from "react-router-dom"

interface EpisodesSectionProps {
    showId: string
}

export default function EpisodesSection({ showId }: EpisodesSectionProps) {
    const navigate = useNavigate()
    const { data: response, isLoading, error } = useGetEpisodesQuery({ showId, limit: 3 });
    const episodes: Episode[] = response?.data?.items || []
    if (isLoading) return <LoadingScreen message="Loading Episodes" />
    if (error) return <ErrorScreen onRetry={() => { }} title="Error" message="Failed to load episodes" />
    return (
        <div className="glass-card rounded-[3rem] p-10 border border-white/5">
            <div className="flex justify-between items-center mb-10">
                <h3 className="text-3xl font-headline font-bold text-white tracking-tight">Episodes</h3>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(`/dashboard/series/${showId}?tab=Episodes`)}
                        className="text-xs font-black uppercase tracking-widest text-accent-cyan hover:text-primary transition-colors duration-300 flex items-center gap-2">

                        <span>View All</span>
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-6">
                {episodes.map((ep, index) => (
                    <EpisodeCard key={index} episode={ep} />
                ))}

                {/* New Episode Action */}
                <button
                    onClick={() => navigate(`/dashboard/series/${showId}/episodes/new`)}
                    className="border-[1.5px] border-dashed border-white/10 rounded-[2rem] bg-white/[0.02] hover:bg-white/[0.04] hover:border-accent-cyan/40 transition-all duration-500 group flex flex-col items-center justify-center p-8 text-center min-h-[280px]">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:bg-accent-cyan/20 transition-all duration-500">
                        <span className="material-symbols-outlined text-white group-hover:scale-125 transition-transform duration-500">add_circle</span>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60">New Episode Slot</span>
                </button>
            </div>
        </div>
    )
}
