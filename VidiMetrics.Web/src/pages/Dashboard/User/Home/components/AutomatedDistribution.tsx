export default function AutomatedDistribution() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-accent-pink">auto_awesome</span>
                    <h2 className="text-xl font-bold text-white tracking-wide">Automated Distribution</h2>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-1.5 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan text-[10px] font-black uppercase tracking-widest">Shorts</button>
                    <button className="px-4 py-1.5 rounded-full bg-white/5 text-white/40 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">Reels</button>
                </div>
            </div>
            <div className="glass-card rounded-3xl p-10 border border-white/5">
                <div className="space-y-8 relative">
                    {/* Vertical Line */}
                    <div className="absolute left-1 top-2 bottom-2 w-0.5 bg-gradient-to-b from-accent-purple via-accent-cyan to-white/5"></div>

                    {/* Item 1 */}
                    <div className="flex items-start gap-10 relative">
                        <div className="w-2.5 h-2.5 rounded-full bg-accent-purple shadow-[0_0_10px_#8a2be2] mt-2 relative z-10"></div>
                        <div className="w-full grid grid-cols-12">
                            <div className="col-span-8">
                                <h4 className="text-sm font-bold text-white">Viral Hook Extraction</h4>
                                <p className="text-white/40 text-[11px] font-medium">Cybernetic Dreams V4 #Shorts_01</p>
                            </div>
                            <div className="col-span-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-accent-cyan">Completed</span>
                            </div>
                            <div className="col-span-2">
                                <span className="text-[10px] font-bold text-white/20">2 mins ago</span>
                            </div>
                        </div>
                    </div>

                    {/* Item 2 */}
                    <div className="flex items-start gap-10 relative">
                        <div className="w-2.5 h-2.5 rounded-full bg-accent-cyan shadow-[0_0_10px_#00f2ff] mt-2 relative z-10"></div>
                        <div className="w-full grid grid-cols-12">
                            <div className="col-span-8">
                                <h4 className="text-sm font-bold text-white">Auto-Captioning Engine</h4>
                                <p className="text-white/40 text-[11px] font-medium">Multi-language overlay generation</p>
                            </div>
                            <div className="col-span-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-accent-cyan animate-pulse">Processing</span>
                            </div>
                            <div className="col-span-2">
                                <span className="text-[10px] font-bold text-white/20">Est. 45s</span>
                            </div>
                        </div>
                    </div>

                    {/* Item 3 */}
                    <div className="flex items-start gap-10 relative opacity-40">
                        <div className="w-2.5 h-2.5 rounded-full bg-white/20 mt-2 relative z-10"></div>
                        <div className="w-full grid grid-cols-12">
                            <div className="col-span-8">
                                <h4 className="text-sm font-bold text-white">Global Distribution</h4>
                                <p className="text-white/40 text-[11px] font-medium">Pushing to YT, TT, IG, FB</p>
                            </div>
                            <div className="col-span-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Queued</span>
                            </div>
                            <div className="col-span-2">
                                <span className="text-[10px] font-bold text-white/20">Next in line</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}