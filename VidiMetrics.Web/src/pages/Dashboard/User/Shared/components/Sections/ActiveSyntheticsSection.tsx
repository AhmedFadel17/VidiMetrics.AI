export default function ActiveSyntheticsSection() {
    const synthetics = [
        { name: 'Dialogue Generation', meta: 'S02 E04 Scripting', progress: 82, color: 'accent-purple' },
        { name: 'Score Composition', meta: 'Main Theme Redux', progress: 12, color: 'accent-cyan' }
    ]

    return (
        <div className="glass-card rounded-[3rem] p-10 border border-white/5 h-full flex flex-col">
            <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-headline font-bold text-white tracking-tight">Active Synthetics</h3>
                <div className="px-3 py-1 bg-accent-pink/10 rounded-full border border-accent-pink/20">
                    <span className="text-[8px] font-black uppercase tracking-widest text-accent-pink">3 Running</span>
                </div>
            </div>

            <div className="space-y-6 flex-grow">
                {synthetics.map((task, index) => (
                    <div key={index} className={`glass-card rounded-2xl p-6 border-l-4 border-${task.color} border-white/5 space-y-4`}>
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-white/40 text-lg">
                                        {task.name.includes('Dialogue') ? 'forum' : 'music_note'}
                                    </span>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white">{task.name}</h4>
                                    <p className="text-[10px] font-bold text-white/30">{task.meta}</p>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-white">{task.progress}%</span>
                        </div>
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className={`h-full bg-${task.color} shadow-[0_0_8px_rgba(0,0,0,0.5)]`} style={{ width: `${task.progress}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
