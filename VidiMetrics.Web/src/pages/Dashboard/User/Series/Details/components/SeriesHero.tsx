export default function SeriesHero() {
    return (
        <div className="relative group">
            {/* Hero Card */}
            <div className="glass-card rounded-[3rem] p-12 border border-white/5 relative overflow-hidden flex justify-between items-center min-h-[450px]">
                {/* Background Glows */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-purple/5 blur-[120px] -mr-40 -mt-40 group-hover:bg-accent-purple/10 transition-all duration-1000"></div>
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent-cyan/5 blur-[100px] -ml-20 -mb-20"></div>

                <div className="relative z-10 max-w-2xl space-y-8">
                    {/* Status Badge */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse shadow-[0_0_8px_#00f2ff]"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent-cyan">Active Production</span>
                        </div>
                    </div>

                    {/* Title & Description */}
                    <div className="space-y-4">
                        <h1 className="text-8xl font-headline font-bold text-white tracking-tight leading-[0.9]">
                            Neon <span className="italic font-light text-gradient-purple font-serif">Symphony</span>: <br />
                            Part II
                        </h1>
                        <p className="text-white/60 text-lg leading-relaxed max-w-xl">
                            A cyberpunk odyssey exploring the intersection of synthetic consciousness and forgotten street culture in the sprawling megacity of Neo-Kyoto.
                        </p>
                    </div>

                    {/* Progress Stats */}
                    <div className="flex items-end gap-12 pt-4">
                        <div className="w-64 space-y-3">
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Overall Progress</span>
                                <span className="text-xs font-bold text-white">68%</span>
                            </div>
                            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-accent-purple to-accent-pink w-[68%] shadow-[0_0_15px_rgba(138,43,226,0.4)]"></div>
                            </div>
                        </div>

                        <div className="flex gap-12 border-l border-white/10 pl-12">
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/30 block mb-1">Episodes</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-headline font-bold text-white">12</span>
                                    <span className="text-white/20 text-sm font-bold">/ 18</span>
                                </div>
                            </div>
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/30 block mb-1">Runtime</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-headline font-bold text-white">342</span>
                                    <span className="text-white/20 text-sm font-bold">m</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Circular Graphic Area */}
                <div className="relative z-10 w-[400px] h-[400px] flex items-center justify-center">
                    {/* The "Eye" / Abstract Graphic from image */}
                    <div className="absolute inset-0 rounded-full border border-white/5 animate-[spin_20s_linear_infinite]"></div>
                    <div className="absolute inset-4 rounded-full border border-white/10 animate-[spin_15s_linear_infinite_reverse]"></div>
                    
                    <div className="relative w-[300px] h-[300px] rounded-full overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(138,43,226,0.2)]">
                        {/* Placeholder for the central art */}
                        <div className="absolute inset-0 bg-cover bg-center opacity-80" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60)' }}></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-dashboard-bg/80 to-transparent"></div>
                        
                        {/* Neon Rings */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-[80%] h-[80%] rounded-full border-2 border-accent-pink/30 shadow-[0_0_20px_rgba(255,0,127,0.3)]"></div>
                            <div className="absolute w-[60%] h-[60%] rounded-full border border-accent-cyan/30 shadow-[0_0_20px_rgba(0,242,255,0.2)]"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
