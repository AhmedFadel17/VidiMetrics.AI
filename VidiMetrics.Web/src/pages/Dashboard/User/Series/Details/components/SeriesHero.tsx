import { SeriesStatusBadge } from '@/components/ui/Badges/seriesStatusBadge';
import { Show } from '@/types/models/storyEngine';
import { formatDate } from '@/utils/dateFormatter';

interface SeriesHeroProps {
    show: Show;
    onDelete?: () => void; // Ready for your handle deletion engine
}

export default function SeriesHero({ show, onDelete }: SeriesHeroProps) {
    return (
        <div className="relative group w-full">

            <div className="glass-card rounded-xl p-8 md:p-12 border border-white/5 bg-gradient-to-b from-[#16171d]/80 to-[#0b0c10]/90 relative overflow-hidden flex flex-col-reverse lg:flex-row justify-between items-stretch lg:items-center gap-8 min-h-[420px] shadow-[0_30px_70px_rgba(0,0,0,0.5)] backdrop-blur-xl">

                <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-accent-purple/5 blur-[120px] -mr-32 -mt-32 group-hover:bg-accent-purple/10 transition-all duration-1000 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-accent-cyan/5 blur-[100px] -ml-24 -mb-24 pointer-events-none" />

                <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
                    <button
                        onClick={onDelete}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-rose-500/10 border border-white/5 hover:border-rose-500/30 text-white/40 hover:text-rose-400 font-mono text-[10px] font-black tracking-widest uppercase transition-all duration-300 active:scale-95 select-none shadow-md backdrop-blur-md"
                    >
                        <span className="material-symbols-outlined text-sm">delete</span>
                        Delete Series
                    </button>
                </div>

                <div className="relative z-10 max-w-3xl flex flex-col justify-between space-y-6 lg:space-y-8">

                    <div className="flex items-center gap-3">
                        <SeriesStatusBadge status={show.status} />
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-headline font-black text-white tracking-tight leading-[0.95] drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
                            {show.title}
                        </h1>
                        <p className="text-white/50 text-sm sm:text-base leading-relaxed max-w-2xl font-sans font-medium text-justify">
                            {show.description || "No project workflow summary overview statement recorded for the tracking pipeline sequence rules inside VidiMetrics Studio database context layers."}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 sm:gap-10 pt-4 border-t border-white/[0.04]">

                        <div className="flex items-center gap-3.5 min-w-[140px]">
                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-accent-purple shadow-inner">
                                <span className="material-symbols-outlined text-xl">video_library</span>
                            </div>
                            <div>
                                <span className="text-[9px] font-black uppercase tracking-widest text-white/30 block font-mono">Episodes</span>
                                <span className="text-xl font-headline font-bold text-white font-mono">
                                    {show.totalEpisodes || 0} <span className="text-xs font-sans text-white/40 font-normal">Ep.</span>
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3.5 min-w-[160px]">
                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-accent-cyan shadow-inner">
                                <span className="material-symbols-outlined text-xl">calendar_today</span>
                            </div>
                            <div>
                                <span className="text-[9px] font-black uppercase tracking-widest text-white/30 block font-mono">Creation Date</span>
                                <span className="text-sm font-headline font-bold text-white tracking-wide">
                                    {formatDate(show.createdAt)}
                                </span>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="relative z-10 self-center lg:self-auto flex items-center justify-center min-w-[260px] sm:min-w-[320px] lg:min-w-[380px] aspect-square lg:h-full max-h-[360px]">

                    <div className="absolute inset-0 rounded-3xl border border-white/5 animate-[spin_30s_linear_infinite] pointer-events-none" />
                    <div className="absolute inset-4 rounded-3xl border border-white/10 animate-[spin_20s_linear_infinite_reverse] pointer-events-none" />

                    <div className="relative w-[85%] h-[85%] rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_40px_rgba(138,43,226,0.15)] group-hover:border-accent-cyan/30 transition-colors duration-500 bg-[#12131a]">

                        {show.referenceImageUrl ? (
                            <img
                                src={show.referenceImageUrl}
                                alt={show.title}
                                className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[#2a2d3a] via-[#16171d] to-[#0b0c10] flex flex-col items-center justify-center gap-2 text-white/20">
                                <span className="material-symbols-outlined text-4xl animate-pulse">movie_filter</span>
                                <span className="text-[9px] font-mono tracking-widest uppercase font-black">No Media Reference</span>
                            </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-transparent to-transparent opacity-60 pointer-events-none" />

                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-[92%] h-[92%] rounded-[1.5rem] border border-accent-purple/20 shadow-[inset_0_0_15px_rgba(138,43,226,0.1)] group-hover:border-accent-cyan/30 transition-colors duration-500" />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}