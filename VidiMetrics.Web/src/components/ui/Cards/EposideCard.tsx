import { Episode } from "@/types/models/storyEngine"
import { Link } from "react-router-dom";
import { formatDate } from "@/utils/dateFormatter";

interface EpisodeCardProps {
    episode: Episode
}

export default function EpisodeCard({ episode }: EpisodeCardProps) {
    const { id, title, plotSummary, thumbnailUrl, episodeNumber, showId, createdAt } = episode;
    const code = `E${episodeNumber}`
    return (
        <Link to={`/dashboard/series/${showId}/episodes/${id}`}>
            <div className="glass-card rounded-[2rem] p-4 border border-white/5 group hover:border-white/20 transition-all duration-500">
                <div className="relative h-44 rounded-2xl overflow-hidden mb-5">
                    <img src={thumbnailUrl} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60" />
                    <div className="absolute inset-0 bg-gradient-to-t from-dashboard-bg/90 to-transparent"></div>

                    <div className="absolute bottom-1 right-2">
                        <span className={`px-2 py-1 text-[8px] font-black uppercase tracking-widest rounded-md bg-primary/60 text-on-surface font-bold`}>

                            {formatDate(createdAt, 'ago')}
                        </span>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between items-start">
                        <h4 className="text-sm font-bold text-white group-hover:text-accent-cyan transition-colors">{code}: {title}</h4>
                    </div>
                    <div className="flex justify-between items-start">
                        <h4 className="text-xs text-gray-400 group-hover:text-accent-cyan transition-colors">{plotSummary}</h4>
                    </div>


                </div>
            </div>
        </Link>
    )
}


// {
//     status === 'RENDERING' && progress !== undefined && (
//         <div className="space-y-2">
//             <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-white/30">
//                 <span>Processing Layers</span>
//                 <span>{progress}%</span>
//             </div>
//             <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
//                 <div className="h-full bg-accent-purple shadow-[0_0_8px_#8a2be2]" style={{ width: `${progress}%` }}></div>
//             </div>
//         </div>
//     )
// }

// {
//     status === 'READY' && meta && (
//         <div className="flex items-center gap-3 pt-2">
//             <span className="text-[10px] font-bold text-white/40">{meta}</span>
//             <div className="flex gap-1">
//                 <span className="w-3 h-3 rounded-full bg-accent-cyan shadow-[0_0_4px_#00f2ff]"></span>
//                 <span className="w-3 h-3 rounded-full bg-accent-purple shadow-[0_0_4px_#8a2be2]"></span>
//             </div>
//         </div>
//     )
// }

// {
//     status === 'DRAFT' && (
//         <span className="text-[10px] font-bold text-white/20 block pt-2">Planning...</span>
//     )
// }