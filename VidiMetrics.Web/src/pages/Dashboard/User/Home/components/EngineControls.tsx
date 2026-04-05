export default function EngineControls() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-accent-cyan">tune</span>
                    <h2 className="text-xl font-bold text-white tracking-wide">Engine Controls</h2>
                </div>
            </div>
            <div className="glass-card rounded-3xl p-8 border border-white/5">

                <div className="space-y-6">
                    {/* Control 1 */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-accent-purple/10 flex items-center justify-center">
                                <span className="material-symbols-outlined text-accent-purple text-lg italic">bolt</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-white">Turbo Render</span>
                                <span className="text-[9px] text-white/40 uppercase font-bold tracking-tighter">Maximum GPU Nodes</span>
                            </div>
                        </div>
                        <div className="w-10 h-5 bg-accent-purple rounded-full relative p-0.5 cursor-pointer shadow-[0_0_10px_#8a2be2]">
                            <div className="w-4 h-4 bg-white rounded-full ml-auto shadow-md transition-all"></div>
                        </div>
                    </div>

                    {/* Control 2 */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-accent-cyan/10 flex items-center justify-center">
                                <span className="material-symbols-outlined text-accent-cyan text-lg italic">crop_free</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-white">Smart Crop</span>
                                <span className="text-[9px] text-white/40 uppercase font-bold tracking-tighter">AI-driven 9:16 framing</span>
                            </div>
                        </div>
                        <div className="w-10 h-5 bg-accent-cyan rounded-full relative p-0.5 cursor-pointer shadow-[0_0_10px_#00f2ff]">
                            <div className="w-4 h-4 bg-white rounded-full ml-auto shadow-md transition-all"></div>
                        </div>
                    </div>

                    {/* Control 3 */}
                    <div className="flex items-center justify-between opacity-50">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                                <span className="material-symbols-outlined text-white/40 text-lg">notifications</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-white">Pulse Alerts</span>
                                <span className="text-[9px] text-white/40 uppercase font-bold tracking-tighter">Notify on viral momentum</span>
                            </div>
                        </div>
                        <div className="w-10 h-5 bg-white/10 rounded-full relative p-0.5 cursor-pointer">
                            <div className="w-4 h-4 bg-white/20 rounded-full shadow-md transition-all"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}