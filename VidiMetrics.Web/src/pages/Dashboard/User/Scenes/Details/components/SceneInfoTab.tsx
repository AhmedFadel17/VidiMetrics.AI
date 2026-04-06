export default function SceneInfoTab() {
    return (
        <div className="glass-card rounded-[3rem] p-10 border border-white/5 space-y-8">
            <div>
                <h3 className="text-2xl font-headline font-bold text-white mb-2">Scene Telemetry</h3>
                <p className="text-white/60 text-sm">Directorial and camera movement details.</p>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40 block">Camera Lens</span>
                    <span className="text-white font-medium">Anamorphic 35mm</span>
                </div>
                <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40 block">Angle</span>
                    <span className="text-white font-medium">Low Tracking Shot</span>
                </div>
            </div>
        </div>
    )
}
