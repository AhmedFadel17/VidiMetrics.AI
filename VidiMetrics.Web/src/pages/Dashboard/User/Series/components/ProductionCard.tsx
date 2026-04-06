import { Link } from 'react-router-dom'

interface ProductionCardProps {
    id: string
    title: string
    episodes: number
    views: string
    status: 'IN PRODUCTION' | 'RELEASED' | 'DRAFT'
    image: string
}

const statusStyles = {
    'IN PRODUCTION': 'bg-accent-purple text-white shadow-[0_0_10px_rgba(138,43,226,0.3)]',
    'RELEASED': 'bg-accent-cyan text-on-surface font-bold shadow-[0_0_10px_rgba(0,242,255,0.3)]',
    'DRAFT': 'bg-white/20 text-white backdrop-blur-md'
}

export default function ProductionCard({ id, title, episodes, views, status, image }: ProductionCardProps) {
    return (
        <Link
            to={`/dashboard/series/${id}`}
            className="glass-card rounded-3xl overflow-hidden group border border-white/5 hover:border-white/20 transition-all duration-500 block relative"
        >
            {/* Image Section */}
            <div className="relative h-64 overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dashboard-bg via-dashboard-bg/20 to-transparent"></div>

                {/* Status Badge */}
                <div className="absolute top-6 left-6">
                    <span className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] rounded-lg ${statusStyles[status]}`}>
                        {status}
                    </span>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-4">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-accent-cyan transition-colors duration-300">
                    {title}
                </h3>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-white/40">
                        <span className="material-symbols-outlined text-lg">schedule</span>
                        <span className="text-xs font-bold">{episodes} Episodes</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/40">
                        <span className="material-symbols-outlined text-lg">visibility</span>
                        <span className="text-xs font-bold">{views}</span>
                    </div>
                </div>
            </div>

            {/* Hover Glow - Bottom border neon effect */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent-cyan/0 to-transparent group-hover:via-accent-cyan/50 transition-all duration-500"></div>
        </Link>
    )
}
