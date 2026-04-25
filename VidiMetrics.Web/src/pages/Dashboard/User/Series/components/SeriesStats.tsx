
export default function SeriesStats() {

    return (
        <div className="grid grid-cols-3 gap-6">
            {/* Total Series */}
            <div className="glass-card rounded-3xl p-8 border border-white/5 relative overflow-hidden group hover:border-accent-purple/30 transition-all duration-500">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent-purple/5 blur-3xl -mr-10 -mt-10 group-hover:bg-accent-purple/10 transition-all duration-500"></div>
                <div className="relative z-10">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 block mb-4">Total Series</span>
                    <div className="flex items-baseline gap-4">
                        <span className="text-5xl font-headline font-bold text-white tracking-tight">1</span>
                    </div>
                </div>
                {/* Background Icon */}
                <div className="absolute -bottom-4 -right-4 opacity-[0.03] group-hover:opacity-[0.07] transition-all duration-500">
                    <span className="material-symbols-outlined text-[120px] select-none">folder_special</span>
                </div>
            </div>

            {/* Avg. Engagement */}
            <div className="glass-card rounded-3xl p-8 border border-white/5 relative overflow-hidden group hover:border-accent-cyan/30 transition-all duration-500">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent-cyan/5 blur-3xl -mr-10 -mt-10 group-hover:bg-accent-cyan/10 transition-all duration-500"></div>
                <div className="relative z-10">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 block mb-4">Avg. Engagement</span>
                    <div className="flex items-baseline gap-4">
                        <span className="text-5xl font-headline font-bold text-white tracking-tight">84.2%</span>
                        <span className="text-accent-purple text-xs font-bold font-body">Top 5%</span>
                    </div>
                </div>
                {/* Background Icon */}
                <div className="absolute -bottom-4 -right-4 opacity-[0.03] group-hover:opacity-[0.07] transition-all duration-500 transform -rotate-12">
                    <span className="material-symbols-outlined text-[120px] select-none">trending_up</span>
                </div>
            </div>

            {/* Storage Used */}
            <div className="glass-card rounded-3xl p-8 border border-white/5 relative overflow-hidden group hover:border-accent-pink/30 transition-all duration-500">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent-pink/5 blur-3xl -mr-10 -mt-10 group-hover:bg-accent-pink/10 transition-all duration-500"></div>
                <div className="relative z-10">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 block mb-4">Storage Used</span>
                    <div className="mb-6">
                        <span className="text-5xl font-headline font-bold text-white tracking-tight">1.2 TB</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-accent-cyan to-accent-purple w-[60%] shadow-[0_0_15px_rgba(0,242,255,0.4)]"></div>
                    </div>
                </div>
                {/* Background Icon */}
                <div className="absolute -bottom-4 -right-4 opacity-[0.03] group-hover:opacity-[0.07] transition-all duration-500">
                    <span className="material-symbols-outlined text-[120px] select-none">database</span>
                </div>
            </div>
        </div>
    )
}
