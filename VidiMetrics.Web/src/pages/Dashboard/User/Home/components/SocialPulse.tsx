export default function SocialPulse() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-accent-cyan">sensors</span>
                    <h2 className="text-xl font-bold text-white tracking-wide">Social Pulse</h2>
                </div>
            </div>
            <div className="glass-card rounded-3xl p-8 border border-white/5">

                <div className="grid grid-cols-2 gap-4">
                    <div className="glass-card p-4 rounded-2xl border border-white/5 flex flex-col items-center gap-2 group hover:border-accent-pink/30 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/30">
                            <span className="material-symbols-outlined text-red-500 text-lg italic">youtube_activity</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-[9px] font-black uppercase tracking-widest text-white/40">YouTube</span>
                            <span className="text-[10px] font-bold text-accent-cyan uppercase">Connected</span>
                        </div>
                    </div>
                    <div className="glass-card p-4 rounded-2xl border border-white/5 flex flex-col items-center gap-2 group hover:border-accent-purple/30 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                            <span className="material-symbols-outlined text-white text-lg">music_note</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-[9px] font-black uppercase tracking-widest text-white/40">TikTok</span>
                            <span className="text-[10px] font-bold text-accent-cyan uppercase">Connected</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}