import { Character } from "@/types/models/storyEngine"

interface CharacterCardProps {
    character: Character
}

export default function CharacterCard({ character }: CharacterCardProps) {
    const { name, personalityTraits, referenceImageUrl } = character
    const role = "Protagonist" //TODO: FIX
    const insightLevel = 100 //TODO: FIX
    const thumbnail = referenceImageUrl || 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=800&auto=format&fit=crop&q=60';
    const meta = ` traits`;
    return (
        <div className="glass-card rounded-2xl p-4 border border-white/5 group hover:border-accent-purple/30 transition-all duration-500 shrink-0">
            <div className="relative h-64 rounded-2xl overflow-hidden mb-6">
                <img src={thumbnail} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
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