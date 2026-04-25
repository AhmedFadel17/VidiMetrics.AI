import EpisodeCard from "@/components/ui/Cards/EposideCard"
import { Episode } from "@/types/models/storyEngine"

interface EpisodesSectionProps {
    showId: string
    initialData?: Episode[]
}

export default function EpisodesSection({ showId, initialData = [] }: EpisodesSectionProps) {
    const episodes = initialData.length > 0 ? initialData.map(ep => ({
        title: ep.title,
        code: `E${ep.episodeNumber.toString().padStart(2, '0')}`,
        status: 'READY' as const, // Placeholder status logic
        meta: 'Active',
        image: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=800&auto=format&fit=crop&q=60'
    })) : [
        {
            title: 'The Ghost Signal',
            code: 'S02 E01',
            status: 'READY' as const,
            meta: '28m 45s',
            image: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=800&auto=format&fit=crop&q=60'
        },
        {
            title: 'Fractured Mirror',
            code: 'S02 E02',
            status: 'RENDERING' as const,
            progress: 45,
            image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&auto=format&fit=crop&q=60'
        },
        {
            title: 'Orbital Drift',
            code: 'S02 E03',
            status: 'DRAFT' as const,
            image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60'
        }
    ]

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
