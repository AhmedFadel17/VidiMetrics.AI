import EpisodeCard from "@/components/ui/Cards/EposideCard";
import {
  ErrorScreen,
  LoadingScreen,
} from "@/components/ui/Feedback/StatusScreens";
import { useGetEpisodesQuery } from "@/store/apis";
import { Episode } from "@/types/models/storyEngine";
import { useNavigate } from "react-router-dom";

interface EpisodesSectionProps {
  showId: string;
}

export default function EpisodesSection({ showId }: EpisodesSectionProps) {
  const navigate = useNavigate();
  const {
    data: response,
    isLoading,
    error,
  } = useGetEpisodesQuery({ showId, limit: 3 });
  const episodes: Episode[] = response?.data?.items || [];
  if (isLoading) return <LoadingScreen message="Loading Episodes" />;
  if (error)
    return (
      <ErrorScreen
        onRetry={() => { }}
        title="Error"
        message="Failed to load episodes"
      />
    );
  return (
    <div className="glass-card rounded-xl p-10 border border-white/5">
      <div className="flex justify-between items-center mb-10">
        <h3 className="text-3xl font-headline font-bold text-white tracking-tight">
          Episodes
        </h3>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/dashboard/series/${showId}?tab=Episodes`)}
            className="text-xs font-black uppercase tracking-widest text-accent-cyan hover:text-primary transition-colors duration-300 flex items-center gap-2"
          >
            <span>View All</span>
            <span className="material-symbols-outlined text-sm">
              arrow_forward
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {episodes.length === 0 && (
          <button
            onClick={() => navigate(`/dashboard/series/${showId}/episodes/new`)}
            className="col-span-4 relative group overflow-hidden hover:from-white/[0.03] hover:to-white/[0.06] transition-all duration-500 flex flex-col items-center justify-center p-8 text-center"
          >
            <div className="absolute -inset-y-12 -inset-x-12 bg-gradient-to-r from-accent-cyan/0 via-accent-cyan/5 to-accent-cyan/0 group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
            <div className="relative space-y-4 z-10 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-accent-cyan/5 border border-accent-cyan/10 flex items-center justify-center group-hover:scale-110 group-hover:border-accent-cyan/30 group-hover:shadow-[0_0_20px_rgba(0,242,255,0.15)] transition-all duration-500 animate-bounce [animation-duration:3s]">
                <span className="material-symbols-outlined text-accent-cyan text-3xl">
                  movie
                </span>
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-bold text-white group-hover:text-accent-cyan transition-colors">
                  No Episodes Generated
                </h4>
                <p className="text-xs text-white/40 max-w-[320px] leading-relaxed">
                  Your series has no episodes yet. Click here to start your
                  journey and generate your first AI episode!
                </p>
              </div>
            </div>
          </button>
        )}

        {episodes.map((ep, index) => (
          <EpisodeCard key={index} episode={ep} />
        ))}

        {/* New Episode Action */}
        {episodes.length > 0 && (
          <button
            onClick={() => navigate(`/dashboard/series/${showId}/episodes/new`)}
            className="border-[1.5px] border-dashed border-white/10 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] hover:border-accent-cyan/40 transition-all duration-500 group flex flex-col items-center justify-center p-8 text-center "
          >
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:bg-accent-cyan/20 transition-all duration-500">
              <span className="material-symbols-outlined text-white group-hover:scale-125 transition-transform duration-500">
                add_circle
              </span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
              New Episode Slot
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
