import { Episode, Show } from "@/types/models/storyEngine";
import { formatDate } from "@/utils/dateFormatter";

interface EpisodeHeroProps {
    show: Show;
    episode: Episode;
}

export default function EpisodeHero({ show, episode }: EpisodeHeroProps) {
    return (
        <div className="relative group">
            <div className="glass-card rounded-[3rem] p-12 border border-white/5 relative overflow-hidden flex justify-between items-center min-h-[400px]">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-cyan/10 blur-[120px] -mr-40 -mt-40 group-hover:bg-accent-cyan/20 transition-all duration-1000"></div>

                <div className="relative z-10 max-w-2xl space-y-8">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent-cyan">
                                {show.title} • E{episode.episodeNumber}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-6xl font-headline font-bold text-white tracking-tight leading-[0.9]">
                            {episode.title}
                        </h1>
                        <p className="text-white/60 text-lg leading-relaxed max-w-xl">
                            {episode.plotSummary}
                        </p>
                    </div>

                    <div className="flex items-end gap-12 pt-4">
                        <div className="flex gap-12 border-l border-white/10 pl-12">
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/30 block mb-1">Created At</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-xl font-headline font-bold text-accent-cyan uppercase">{formatDate(episode.createdAt)}</span>
                                </div>
                            </div>
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/30 block mb-1">Production ID</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-headline font-bold text-white uppercase">{episode.id.slice(0, 4)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
