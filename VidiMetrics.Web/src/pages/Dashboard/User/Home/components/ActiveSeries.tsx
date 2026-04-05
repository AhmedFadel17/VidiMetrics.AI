export default function ActiveSeries() {
    return (
        <div className=" space-y-6">
            <div className="flex justify-between items-end">
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-accent-purple">movie_filter</span>
                    <h2 className="text-xl font-bold text-white tracking-wide">Active Series</h2>
                </div>
                <button className="text-xs font-black uppercase tracking-widest text-accent-cyan hover:underline">View All
                    <span className="material-symbols-outlined text-sm pl-2">arrow_forward</span>
                </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="glass-card rounded-2xl overflow-hidden group border border-white/5 hover:border-accent-purple/30 transition-all duration-500">
                    <div className="relative h-48 overflow-hidden bg-white/5">
                        <img
                            src="https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=800&auto=format&fit=crop&q=60"
                            alt="Production"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dashboard-bg via-dashboard-bg/20 to-transparent"></div>
                        <div className="absolute top-4 left-4 flex gap-2">
                            <span className="px-2 py-1 bg-accent-purple text-white text-[9px] font-black uppercase tracking-widest rounded-md animate-pulse">Rendering</span>
                            <span className="px-2 py-1 bg-white/10 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest rounded-md border border-white/10">84% complete</span>
                        </div>
                    </div>
                    <div className="p-6">
                        <h3 className="text-lg font-bold text-white mb-1">Cybernetic Dreams V4</h3>
                        <p className="text-white/40 text-xs font-medium">Episode 12: The Grid Collapse</p>
                    </div>
                </div>

                <div className="glass-card rounded-2xl overflow-hidden group border border-white/5 hover:border-accent-cyan/30 transition-all duration-500">
                    <div className="relative h-48 overflow-hidden bg-white/5">
                        <img
                            src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&auto=format&fit=crop&q=60"
                            alt="Production"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-40 italic"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dashboard-bg via-dashboard-bg/20 to-transparent"></div>
                        <div className="absolute top-4 left-4 flex gap-2">
                            <span className="px-2 py-1 bg-white/20 text-white text-[9px] font-black uppercase tracking-widest rounded-md">Idle</span>
                            <span className="px-2 py-1 bg-white/10 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest rounded-md border border-white/10">Awaiting prompt</span>
                        </div>
                    </div>
                    <div className="p-6">
                        <h3 className="text-lg font-bold text-white mb-1">Neon Noir Horizons</h3>
                        <p className="text-white/40 text-xs font-medium">Season 2 Template Ready</p>
                    </div>
                </div>

                <div className="glass-card rounded-2xl overflow-hidden group border border-white/5 hover:border-accent-cyan/30 transition-all duration-500">
                    <div className="relative h-48 overflow-hidden bg-white/5">
                        <img
                            src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&auto=format&fit=crop&q=60"
                            alt="Production"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-40 italic"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dashboard-bg via-dashboard-bg/20 to-transparent"></div>
                        <div className="absolute top-4 left-4 flex gap-2">
                            <span className="px-2 py-1 bg-white/20 text-white text-[9px] font-black uppercase tracking-widest rounded-md">Idle</span>
                            <span className="px-2 py-1 bg-white/10 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest rounded-md border border-white/10">Awaiting prompt</span>
                        </div>
                    </div>
                    <div className="p-6">
                        <h3 className="text-lg font-bold text-white mb-1">Neon Noir Horizons</h3>
                        <p className="text-white/40 text-xs font-medium">Season 2 Template Ready</p>
                    </div>
                </div>

                <div className="glass-card rounded-2xl overflow-hidden group border border-white/5 hover:border-accent-cyan/30 transition-all duration-500">
                    <div className="relative h-48 overflow-hidden bg-white/5">
                        <img
                            src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&auto=format&fit=crop&q=60"
                            alt="Production"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-40 italic"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dashboard-bg via-dashboard-bg/20 to-transparent"></div>
                        <div className="absolute top-4 left-4 flex gap-2">
                            <span className="px-2 py-1 bg-white/20 text-white text-[9px] font-black uppercase tracking-widest rounded-md">Idle</span>
                            <span className="px-2 py-1 bg-white/10 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest rounded-md border border-white/10">Awaiting prompt</span>
                        </div>
                    </div>
                    <div className="p-6">
                        <h3 className="text-lg font-bold text-white mb-1">Neon Noir Horizons</h3>
                        <p className="text-white/40 text-xs font-medium">Season 2 Template Ready</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
