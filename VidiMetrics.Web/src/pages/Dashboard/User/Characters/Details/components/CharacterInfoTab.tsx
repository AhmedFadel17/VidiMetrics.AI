export default function CharacterInfoTab() {
    return (
        <div className="glass-card rounded-[3rem] p-10 border border-white/5 space-y-8">
            <div>
                <h3 className="text-2xl font-headline font-bold text-white mb-2">Character Bio</h3>
                <p className="text-white/60 text-sm">Detailed personal history and synthetic parameters.</p>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40 block">Origin</span>
                    <span className="text-white font-medium">Lower Sectors, Neo-Kyoto</span>
                </div>
                <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40 block">Archetype</span>
                    <span className="text-white font-medium">Rebel Hacker</span>
                </div>
            </div>
        </div>
    )
}
