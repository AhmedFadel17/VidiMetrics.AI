import { Environment } from "@/types/models/storyEngine";

interface EnvironmentCardProps {
    environment: Environment;
}

export default function EnvironmentCard({ environment }: EnvironmentCardProps) {
    const { name, location, referenceImageUrl } = environment;
    const type = "Environment" //TODO: FIX
    const thumbnail = referenceImageUrl || 'https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?w=800&auto=format&fit=crop&q=60';
    return (
        <div className="relative h-24 rounded-2xl overflow-hidden group cursor-pointer border border-white/5 hover:border-accent-cyan/30 transition-all duration-300">
            <img src={thumbnail} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-r from-dashboard-bg/80 via-dashboard-bg/20 to-transparent"></div>
            <div className="absolute inset-0 flex items-center px-6">
                <span className="text-sm font-bold text-white group-hover:text-accent-cyan transition-colors">{name}</span>
            </div>
        </div>
    )
}