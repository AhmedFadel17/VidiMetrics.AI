export default function TimelinesTab() {
    return (
        <div className="space-y-8">
            {/* Distribution Channels */}
            <div className="glass-card rounded-[3rem] p-10 border border-white/5 space-y-8 relative overflow-hidden">
                <div className="flex justify-between items-center relative z-10">
                    <div>
                        <h3 className="text-2xl font-headline font-bold text-white tracking-tight flex items-center gap-3">
                            <span className="material-symbols-outlined text-accent-cyan">hub</span>
                            Linked Channels
                        </h3>
                        <p className="text-white/40 text-sm mt-1">Manage automated distribution points.</p>
                    </div>
                    <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-white transition-all border border-white/10 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">add</span> Add Channel
                    </button>
                </div>

                <div className="grid grid-cols-3 gap-6 relative z-10">
                    {/* YouTube */}
                    <div className="glass-card p-6 rounded-2xl border border-white/5 border-l-4 border-l-red-500 hover:bg-white/[0.04] transition-all flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-red-500">
                                <span className="material-symbols-outlined">smart_display</span>
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-sm">CyberKyoto Official</h4>
                                <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-1">YouTube</p>
                            </div>
                        </div>
                        <div className="w-10 h-5 bg-accent-cyan/20 rounded-full flex items-center p-1 cursor-pointer">
                            <div className="w-3 h-3 bg-accent-cyan rounded-full shadow-[0_0_10px_#00f2ff] transform translate-x-5"></div>
                        </div>
                    </div>

                    {/* TikTok */}
                    <div className="glass-card p-6 rounded-2xl border border-white/5 border-l-4 border-l-accent-pink hover:bg-white/[0.04] transition-all flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-accent-pink">
                                <span className="material-symbols-outlined">music_video</span>
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-sm">@NeonSymphony</h4>
                                <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-1">TikTok</p>
                            </div>
                        </div>
                        <div className="w-10 h-5 bg-accent-cyan/20 rounded-full flex items-center p-1 cursor-pointer">
                            <div className="w-3 h-3 bg-accent-cyan rounded-full shadow-[0_0_10px_#00f2ff] transform translate-x-5"></div>
                        </div>
                    </div>

                    {/* Instagram */}
                    <div className="glass-card p-6 rounded-2xl border border-white/5 border-l-4 border-l-orange-400 hover:bg-white/[0.04] transition-all flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-orange-400">
                                <span className="material-symbols-outlined">photo_camera</span>
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-sm">Neon Symphony</h4>
                                <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-1">Instagram</p>
                            </div>
                        </div>
                        <div className="w-10 h-5 bg-white/10 rounded-full flex items-center p-1 cursor-pointer">
                            <div className="w-3 h-3 bg-white/30 rounded-full transform translate-x-0"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Posting & Reel Studio Grid */}
            <div className="grid grid-cols-12 gap-8">
                {/* Reel Studio / Content Splitting */}
                <div className="col-span-7 glass-card rounded-[3rem] p-10 border border-white/5 relative overflow-hidden">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-2xl font-headline font-bold text-white tracking-tight flex items-center gap-3">
                                <span className="material-symbols-outlined text-accent-purple">content_cut</span>
                                Reel Studio
                            </h3>
                            <p className="text-white/40 text-sm mt-1">Process full episodes into short-form content.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Ready to cut items */}
                        <div className="glass-card p-4 rounded-2xl border border-white/5 flex gap-4 items-center group">
                            <div className="w-24 h-16 rounded-xl overflow-hidden relative">
                                <img src="https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=800&auto=format&fit=crop&q=60" alt="S02E01" className="w-full h-full object-cover opacity-60" />
                                <div className="absolute inset-0 bg-gradient-to-t from-dashboard-bg/80 to-transparent"></div>
                                <span className="absolute bottom-1 right-1 text-[8px] font-bold text-white px-1 bg-black/50 rounded">28:45</span>
                            </div>
                            <div className="flex-grow">
                                <h4 className="text-sm font-bold text-white">S02 E01: The Ghost Signal</h4>
                                <p className="text-white/40 text-[10px] uppercase font-black tracking-widest mt-1">Ready for extraction</p>
                            </div>
                            <button className="px-4 py-2 bg-gradient-to-r from-accent-purple to-accent-pink text-white text-xs font-bold rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-[0_0_15px_rgba(138,43,226,0.3)] hover:scale-105">
                                AI Auto-Cut
                            </button>
                        </div>

                        {/* Processing item */}
                        <div className="glass-card p-4 rounded-2xl border border-accent-cyan/20 flex gap-4 items-center bg-accent-cyan/5">
                            <div className="w-24 h-16 rounded-xl overflow-hidden relative">
                                <img src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&auto=format&fit=crop&q=60" alt="S02E02" className="w-full h-full object-cover opacity-40 grayscale" />
                            </div>
                            <div className="flex-grow">
                                <div className="flex justify-between items-center mb-1">
                                    <h4 className="text-sm font-bold text-white">S01 E12 Recap Reel</h4>
                                    <span className="text-xs font-bold text-accent-cyan">74%</span>
                                </div>
                                <div className="w-full h-1 bg-black/40 rounded-full overflow-hidden">
                                     <div className="h-full bg-accent-cyan shadow-[0_0_8px_#00f2ff] w-[74%]"></div>
                                </div>
                                <p className="text-accent-cyan/60 text-[10px] uppercase font-black tracking-widest mt-2 animate-pulse">Generating Captions...</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Posting Schedule */}
                <div className="col-span-5 glass-card rounded-[3rem] p-10 border border-white/5 relative">
                     <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-2xl font-headline font-bold text-white tracking-tight flex items-center gap-3">
                                <span className="material-symbols-outlined text-accent-pink">schedule</span>
                                Upcoming Schedule
                            </h3>
                        </div>
                    </div>

                    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent pl-8">
                        
                        {/* Timeline Item 1 */}
                        <div className="relative">
                            <div className="absolute -left-11 w-6 h-6 rounded-full bg-dashboard-bg border-2 border-accent-cyan flex items-center justify-center shadow-[0_0_10px_rgba(0,242,255,0.3)]">
                                <div className="w-2 h-2 bg-accent-cyan rounded-full"></div>
                            </div>
                            <div className="glass-card p-4 rounded-xl border border-white/5 hover:border-white/20 transition-all cursor-pointer group">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-black text-accent-cyan uppercase tracking-widest">Today, 18:00</span>
                                    <span className="material-symbols-outlined text-sm text-white/40 group-hover:text-white">smart_display</span>
                                </div>
                                <h4 className="text-sm font-bold text-white mb-1">Trailer: Neon Symphony Pt 2</h4>
                                <p className="text-xs text-white/40">YouTube • TikTok</p>
                            </div>
                        </div>

                         {/* Timeline Item 2 */}
                         <div className="relative">
                            <div className="absolute -left-11 w-6 h-6 rounded-full bg-dashboard-bg border-2 border-accent-purple flex items-center justify-center shadow-[0_0_10px_rgba(138,43,226,0.3)]">
                                <div className="w-2 h-2 bg-accent-purple rounded-full"></div>
                            </div>
                            <div className="glass-card p-4 rounded-xl border border-white/5 hover:border-white/20 transition-all cursor-pointer group">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Tomorrow, 12:30</span>
                                    <span className="material-symbols-outlined text-sm text-white/40 group-hover:text-white">music_video</span>
                                </div>
                                <h4 className="text-sm font-bold text-white mb-1">BTS: Environment Forge</h4>
                                <p className="text-xs text-white/40">TikTok</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
