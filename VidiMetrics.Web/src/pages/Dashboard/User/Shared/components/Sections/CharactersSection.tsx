interface CharacterCardProps {
    name: string
    role: string
    insightLevel: number
    image: string
}

function CharacterCard({ name, role, insightLevel, image }: CharacterCardProps) {
    return (
        <div className="glass-card rounded-2xl p-4 border border-white/5 group hover:border-accent-purple/30 transition-all duration-500 shrink-0">
            <div className="relative h-64 rounded-2xl overflow-hidden mb-6">
                <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-dashboard-bg/80 via-transparent to-transparent"></div>
            </div>
            <div className="space-y-1">
                <h4 className="text-lg font-bold text-white group-hover:text-accent-purple transition-colors">{name}</h4>
                <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">{role}</p>
            </div>

            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-widest text-white/20 italic">Insight Level: {insightLevel}%</span>
                <span className="material-symbols-outlined text-xs text-accent-purple">bolt</span>
            </div>
        </div>
    )
}

export default function CharactersSection() {
    const characters = [
        {
            name: 'Kaelen Voss',
            role: 'Protagonist | Lead Hacktivist',
            insightLevel: 94,
            image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=60'
        },
        {
            name: 'Elias Thorne',
            role: 'Antagonist | CEO Thorne Corp',
            insightLevel: 78,
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=60'
        }
    ]

    return (
        <div className="glass-card rounded-3xl p-10 border border-white/5">
            <div className="flex justify-between items-center mb-8">
                <div className="space-y-1">
                    <h3 className="text-2xl font-headline font-bold text-white tracking-tight">Characters</h3>
                    <p className="text-white/40 text-xs font-medium">24 Creative entities active</p>
                </div>
                <button className="text-[10px] font-black uppercase tracking-widest text-accent-cyan hover:underline flex items-center gap-2">
                    View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
            </div>

            <div className="grid grid-cols-3 gap-6">

                {characters.map((char, index) => (
                    <div className="col-span-1">
                        <CharacterCard key={index} {...char} />
                    </div>
                ))}

                {/* New Character Action */}
                <button className="col-span-1 shrink-0 border-[1.5px] border-dashed border-white/10 rounded-[2rem] bg-white/[0.02] hover:bg-white/[0.04] hover:border-accent-purple/40 transition-all duration-500 group flex flex-col items-center justify-center p-8 text-center min-h-[380px]">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-accent-purple/20 transition-all duration-500">
                        <span className="material-symbols-outlined text-white group-hover:scale-125 transition-transform duration-500">person_add</span>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60">New Character</span>
                </button>
            </div>
        </div>
    )
}
