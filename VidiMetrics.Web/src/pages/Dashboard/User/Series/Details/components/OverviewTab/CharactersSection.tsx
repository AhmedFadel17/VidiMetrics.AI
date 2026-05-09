import CharacterCard from "@/components/ui/Cards/CharacterCard"
import { ErrorScreen, LoadingScreen } from "@/components/ui/Feedback/StatusScreens"
import { useGetCharactersQuery } from "@/store/apis";
import { Character } from "@/types/models/storyEngine"
import { useNavigate } from "react-router-dom";

interface CharactersSectionProps {
    showId: string
}

export default function CharactersSection({ showId }: CharactersSectionProps) {
    const navigate = useNavigate();
    const { data: response, isLoading, error } = useGetCharactersQuery({ showId, limit: 2 });
    const characters: Character[] = response?.data?.items || []
    if (isLoading) return <LoadingScreen message="Loading Characters" />
    if (error) return <ErrorScreen onRetry={() => { }} title="Error" message="Failed to load characters" />
    return (
        <div className="glass-card rounded-3xl p-10 border border-white/5">
            <div className="flex justify-between items-center mb-8">
                <div className="space-y-1">
                    <h3 className="text-2xl font-headline font-bold text-white tracking-tight">Characters</h3>
                </div>
                <button
                    onClick={() => navigate(`/dashboard/series/${showId}?tab=Characters`)}
                    className="text-xs font-black uppercase tracking-widest text-accent-cyan hover:text-primary transition-colors duration-300 flex items-center gap-2">

                    <span>View All</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
            </div>

            <div className="grid grid-cols-3 gap-6">

                {characters.map((char, index) => (
                    <div className="col-span-1">
                        <CharacterCard key={index} character={char} />
                    </div>
                ))}

                {/* New Character Action */}
                <button
                    onClick={() => navigate(`/dashboard/series/${showId}/characters/new`)}
                    className="col-span-1 shrink-0 border-[1.5px] border-dashed border-white/10 rounded-[2rem] bg-white/[0.02] hover:bg-white/[0.04] hover:border-accent-purple/40 transition-all duration-500 group flex flex-col items-center justify-center p-8 text-center min-h-[380px]">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-accent-purple/20 transition-all duration-500">
                        <span className="material-symbols-outlined text-white group-hover:scale-125 transition-transform duration-500">person_add</span>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60">New Character</span>
                </button>
            </div>
        </div>
    )
}
