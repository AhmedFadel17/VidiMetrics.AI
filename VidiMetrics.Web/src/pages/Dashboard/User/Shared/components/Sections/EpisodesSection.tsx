interface EpisodeCardProps {
    title: string
    code: string
    status: 'READY' | 'RENDERING' | 'DRAFT'
    image: string
    progress?: number
    meta?: string
}

function EpisodeCard({ title, code, status, image, progress, meta }: EpisodeCardProps) {
    const statusStyles = {
        'READY': 'bg-accent-cyan text-on-surface font-bold',
        'RENDERING': 'bg-accent-purple text-white animate-pulse',
        'DRAFT': 'bg-white/10 text-white/40'
    }

    return (
        <div className="glass-card rounded-[2rem] p-4 border border-white/5 group hover:border-white/20 transition-all duration-500">
            <div className="relative h-44 rounded-2xl overflow-hidden mb-5">
                <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-t from-dashboard-bg/90 to-transparent"></div>
                <div className="absolute top-4 left-4">
                    <span className={`px-2 py-1 text-[8px] font-black uppercase tracking-widest rounded-md ${statusStyles[status]}`}>
                        {status}
                    </span>
                </div>
            </div>
            
            <div className="space-y-3">
                <div className="flex justify-between items-start">
                    <h4 className="text-sm font-bold text-white group-hover:text-accent-cyan transition-colors">{code}: {title}</h4>
                </div>
                
                {status === 'RENDERING' && progress !== undefined && (
                    <div className="space-y-2">
                        <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-white/30">
                            <span>Processing Layers</span>
                            <span>{progress}%</span>
                        </div>
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-accent-purple shadow-[0_0_8px_#8a2be2]" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                )}
                
                {status === 'READY' && meta && (
                    <div className="flex items-center gap-3 pt-2">
                        <span className="text-[10px] font-bold text-white/40">{meta}</span>
                        <div className="flex gap-1">
                            <span className="w-3 h-3 rounded-full bg-accent-cyan shadow-[0_0_4px_#00f2ff]"></span>
                            <span className="w-3 h-3 rounded-full bg-accent-purple shadow-[0_0_4px_#8a2be2]"></span>
                        </div>
                    </div>
                )}

                {status === 'DRAFT' && (
                    <span className="text-[10px] font-bold text-white/20 block pt-2">Planning...</span>
                )}
            </div>
        </div>
    )
}

export default function EpisodesSection() {
    const episodes = [
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
                    <EpisodeCard key={index} {...ep} />
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
