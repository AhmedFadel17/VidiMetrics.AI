import CharacterCard from "@/components/ui/Cards/CharacterCard";
import {
  ErrorScreen,
  LoadingScreen,
} from "@/components/ui/Feedback/StatusScreens";
import { useGetCharactersQuery } from "@/store/apis";
import { Character } from "@/types/models/storyEngine";
import { useNavigate } from "react-router-dom";

interface CharactersSectionProps {
  showId: string;
}

export default function CharactersSection({ showId }: CharactersSectionProps) {
  const navigate = useNavigate();
  const {
    data: response,
    isLoading,
    error,
  } = useGetCharactersQuery({ showId, limit: 2 });
  const characters: Character[] = response?.data?.items || [];
  if (isLoading) return <LoadingScreen message="Loading Characters" />;
  if (error)
    return (
      <ErrorScreen
        onRetry={() => {}}
        title="Error"
        message="Failed to load characters"
      />
    );
  return (
    <div className="glass-card rounded-3xl p-10 border border-white/5">
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-1">
          <h3 className="text-2xl font-headline font-bold text-white tracking-tight">
            Characters
          </h3>
        </div>
        <button
          onClick={() => navigate(`/dashboard/series/${showId}?tab=Characters`)}
          className="text-xs font-black uppercase tracking-widest text-accent-cyan hover:text-primary transition-colors duration-300 flex items-center gap-2"
        >
          <span>View All</span>
          <span className="material-symbols-outlined text-sm">
            arrow_forward
          </span>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {characters.length < 3 && (
          <button
            onClick={() =>
              navigate(`/dashboard/series/${showId}/characters/new`)
            }
            className={`col-span-${3 - characters.length} relative group overflow-hidden rounded-[2rem] border border-white/5 bg-gradient-to-br from-white/[0.01] to-white/[0.03] hover:from-white/[0.03] hover:to-white/[0.06] transition-all duration-500 flex flex-col items-center justify-center p-8 text-center min-h-[380px]`}
          >
            <div className="absolute -inset-y-12 -inset-x-12 bg-gradient-to-r from-accent-purple/0 via-accent-purple/5 to-accent-purple/0 group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
            <div className="relative space-y-4 z-10 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-accent-purple/5 border border-accent-purple/10 flex items-center justify-center group-hover:scale-110 group-hover:border-accent-purple/30 group-hover:shadow-[0_0_20px_rgba(138,43,226,0.15)] transition-all duration-500 animate-bounce [animation-duration:3s]">
                <span className="material-symbols-outlined text-accent-purple text-3xl">
                  groups
                </span>
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-bold text-white group-hover:text-accent-purple transition-colors">
                  Create New Character
                </h4>
                <p className="text-xs text-white/40 max-w-[280px] leading-relaxed">
                  Your universe needs characters. Click here to start your
                  journey and craft your new cast member!
                </p>
              </div>
            </div>
          </button>
        )}

        {characters.map((char, index) => (
          <div className="col-span-1" key={index}>
            <CharacterCard character={char} />
          </div>
        ))}
      </div>
    </div>
  );
}
