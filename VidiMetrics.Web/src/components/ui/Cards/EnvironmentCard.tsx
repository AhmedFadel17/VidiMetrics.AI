import { StoryEnvironment } from "@/types/models/storyEngine";
import { Link } from "react-router-dom";

interface EnvironmentCardProps {
    environment: StoryEnvironment;
}

export default function EnvironmentCard({ environment }: EnvironmentCardProps) {
    const { id, name, visualDescription, atmosphere, showId, referenceImageUrl } = environment;
    const thumbnail = referenceImageUrl || 'https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?w=800&auto=format&fit=crop&q=60';
    return (
        <div className="relative h-36 rounded-2xl overflow-hidden group cursor-pointer border border-white/5 hover:border-accent-cyan/30 transition-all duration-300">
            <img src={thumbnail} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-r from-dashboard-bg/80 via-dashboard-bg/20 to-transparent"></div>
            <Link to={`/dashboard/shows/${showId}/environments/${id}`}>
                <div className="absolute inset-0 flex flex-col items-start justify-center px-6">
                    <span className="text-sm font-bold text-white group-hover:text-accent-cyan transition-colors mb-4">{name}</span>
                    <span className="text-xs text-gray-200 group-hover:text-accent-cyan transition-colors mb-2">{visualDescription}</span>
                    <span className="text-xs rounded bg-accent-purple/50 px-2 py-1 font-bold text-white transition-colors">{atmosphere}</span>
                </div>
            </Link>
        </div>
    )
}