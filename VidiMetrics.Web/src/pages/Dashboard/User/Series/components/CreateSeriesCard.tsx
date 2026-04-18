import { Link } from 'react-router-dom'

export default function CreateSeriesCard() {
    return (
        <Link to="/dashboard/series/new" className="h-full w-full border-[1.5px] border-dashed border-white/10 rounded-[2.5rem] bg-white/[0.02] hover:bg-white/[0.04] hover:border-accent-purple/40 transition-all duration-500 group flex flex-col items-center justify-center p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:bg-accent-purple/20 transition-all duration-500">
                <span className="material-symbols-outlined text-3xl text-white group-hover:scale-125 transition-transform duration-500">add</span>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">Start New Series</h3>
            <p className="text-white/40 text-sm font-medium">Launch a fresh cinematic journey</p>

            {/* Animated Glow in center on hover */}
            <div className="absolute inset-x-0 bottom-0 top-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000 overflow-hidden rounded-[2.5rem]">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-accent-purple/10 blur-[100px]"></div>
            </div>
        </Link>
    )
}
