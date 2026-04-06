export default function EnvironmentInfoTab() {
    return (
        <div className="glass-card rounded-[3rem] p-10 border border-white/5 space-y-8">
            <div>
                <h3 className="text-2xl font-headline font-bold text-white mb-2">Environment Blueprint</h3>
                <p className="text-white/60 text-sm">Lighting, scale, and atmosphere parameters.</p>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40 block">Atmosphere</span>
                    <span className="text-white font-medium">Volumetric Fog Level 4, Neon Saturation High</span>
                </div>
                <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40 block">Time Cycle</span>
                    <span className="text-white font-medium">Locked (Perpetual Night)</span>
                </div>
            </div>
        </div>
    )
}
