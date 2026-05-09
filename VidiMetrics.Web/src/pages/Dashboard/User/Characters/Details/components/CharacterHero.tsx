import { Character, Show } from "@/types";

interface CharacterHeroProps {
    character: Character;
    show: Show
}
export default function CharacterHero({ character, show }: CharacterHeroProps) {
    const { name, physicalDescription, clothingStyle, personalityTraits, role, insightLevel, voiceId, referenceImageUrl } = character;

    return (
        <div className="relative group">
            <div className="glass-card rounded-[3rem] p-12 border border-white/5 relative overflow-hidden flex justify-between items-center min-h-[400px]">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-purple/10 blur-[120px] -mr-40 -mt-40 group-hover:bg-accent-purple/20 transition-all duration-1000"></div>

                <div className="relative z-10 max-w-2xl space-y-8">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent-purple">Creative Entity</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-6xl font-headline font-bold text-white tracking-tight leading-[0.9]">
                            {name}
                        </h1>
                        <p className="text-white/60 text-lg leading-relaxed max-w-xl">
                            {role}
                        </p>
                    </div>

                    <div className="flex items-end gap-12 pt-4">
                        <div className="flex gap-12 border-l border-white/10 pl-12">
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/30 block mb-1">Insight Level</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-headline font-bold text-white">{insightLevel}</span>
                                    <span className="text-white/20 text-sm font-bold">%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
