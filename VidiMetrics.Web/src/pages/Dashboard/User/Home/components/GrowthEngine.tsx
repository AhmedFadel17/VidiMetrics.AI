export default function GrowthEngine() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-accent-cyan">monitoring</span>
                    <h2 className="text-xl font-bold text-white tracking-wide">Growth Engine</h2>
                </div>
            </div>

            <div className="glass-card rounded-3xl p-8 border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent-cyan/5 blur-3xl -mr-10 -mt-10"></div>


                <div className="space-y-10">
                    {/* Stat 1 */}
                    <div>
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Total Views</span>
                            <span className="text-accent-cyan text-xs font-bold">+12.5%</span>
                        </div>
                        <div className="text-3xl font-headline font-bold text-white mb-4">2.4M</div>
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-accent-cyan w-[65%] shadow-[0_0_10px_#00f2ff]"></div>
                        </div>
                    </div>

                    {/* Stat 2 */}
                    <div>
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Engagement</span>
                            <span className="text-accent-purple text-xs font-bold">+4.2%</span>
                        </div>
                        <div className="text-3xl font-headline font-bold text-white mb-4">18.2k</div>
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-accent-purple w-[48%] shadow-[0_0_10px_#8a2be2]"></div>
                        </div>
                    </div>

                    {/* Stat 3 */}
                    <div>
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Subscribers</span>
                            <span className="text-accent-pink text-xs font-bold">+824</span>
                        </div>
                        <div className="text-3xl font-headline font-bold text-white mb-4">142k</div>
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-accent-pink w-[82%] shadow-[0_0_10px_#ff007f]"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
