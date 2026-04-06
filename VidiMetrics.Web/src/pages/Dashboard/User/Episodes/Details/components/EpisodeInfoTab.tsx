export default function EpisodeInfoTab() {
    return (
        <div className="glass-card rounded-[3rem] p-10 border border-white/5 space-y-8">
            <div>
                <h3 className="text-2xl font-headline font-bold text-white mb-2">Episode Details</h3>
                <p className="text-white/60 text-sm">Detailed metadata and technical specifications for this episode.</p>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40 block">Resolution</span>
                    <span className="text-white font-medium">4K Ultra HD (3840x2160)</span>
                </div>
                <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40 block">Audio Format</span>
                    <span className="text-white font-medium">Dolby Atmos Spatial Audio</span>
                </div>
                <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40 block">Frame Rate</span>
                    <span className="text-white font-medium">60 FPS</span>
                </div>
                <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40 block">Render Engine</span>
                    <span className="text-white font-medium">VidiMetrics Synthetic Core v4.2</span>
                </div>
            </div>
        </div>
    )
}
