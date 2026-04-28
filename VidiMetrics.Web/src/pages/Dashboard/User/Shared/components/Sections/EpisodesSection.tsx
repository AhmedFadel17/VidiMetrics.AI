import EpisodeCard from "@/components/ui/Cards/EposideCard"
import { Episode } from "@/types/models/storyEngine"

interface EpisodesSectionProps {
    showId: string
    initialData?: Episode[]
}

export default function EpisodesSection({ showId, initialData = [] }: EpisodesSectionProps) {
    const episodes = initialData.length > 0 ? initialData : [];
    return (
        <div className="glass-card rounded-[3rem] p-10 border border-white/5">
            <div className="flex justify-between items-center mb-10">
                <h3 className="text-3xl font-headline font-bold text-white tracking-tight">Episodes</h3>
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all">
                        <span className="material-symbols-outlined text-sm text-accent-cyan">sort</span>
                        <span className="text-[9px] font-black uppercase tracking-widest text-white">Latest First</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-6">
                {episodes.map((ep, index) => (
                    <EpisodeCard key={index} episode={ep} />
                ))}

                {/* New Episode Action */}
                <button className="border-[1.5px] border-dashed border-white/10 rounded-[2rem] bg-white/[0.02] hover:bg-white/[0.04] hover:border-accent-cyan/40 transition-all duration-500 group flex flex-col items-center justify-center p-8 text-center min-h-[280px]">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:bg-accent-cyan/20 transition-all duration-500">
                        <span className="material-symbols-outlined text-white group-hover:scale-125 transition-transform duration-500">add_circle</span>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60">New Episode Slot</span>
                </button>
            </div>
        </div>
    )
}
