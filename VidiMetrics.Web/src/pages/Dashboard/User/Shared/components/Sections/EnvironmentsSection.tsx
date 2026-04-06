export default function EnvironmentsSection() {
    const environments = [
        { name: 'The Under-city', image: 'https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?w=800&auto=format&fit=crop&q=60' },
        { name: 'Sky Garden HQ', image: 'https://images.unsplash.com/photo-1449156006071-8597395ed74b?w=800&auto=format&fit=crop&q=60' }
    ]

    return (
        <div className="glass-card rounded-[3rem] p-10 border border-white/5 h-full flex flex-col">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-headline font-bold text-white tracking-tight">Environments</h3>
                <span className="material-symbols-outlined text-white/20">landscape</span>
            </div>

            <div className="space-y-4 flex-grow">
                {environments.map((env, index) => (
                    <div key={index} className="relative h-24 rounded-2xl overflow-hidden group cursor-pointer border border-white/5 hover:border-accent-cyan/30 transition-all duration-300">
                        <img src={env.image} alt={env.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60" />
                        <div className="absolute inset-0 bg-gradient-to-r from-dashboard-bg/80 via-dashboard-bg/20 to-transparent"></div>
                        <div className="absolute inset-0 flex items-center px-6">
                            <span className="text-sm font-bold text-white group-hover:text-accent-cyan transition-colors">{env.name}</span>
                        </div>
                    </div>
                ))}
            </div>

            <button className="mt-8 w-full glass-card hover:bg-white/10 px-6 py-4 rounded-xl flex items-center justify-center gap-3 border border-white/5 transition-all duration-300 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white">
                Generate New World
            </button>
        </div>
    )
}
