import { Link } from 'react-router-dom'

export default function RecentScenes() {
    const scenes = [
        { id: 1, image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=60' },
        { id: 2, image: 'https://images.unsplash.com/photo-1535016120720-40c646be8958?w=800&auto=format&fit=crop&q=60' }
    ]

    return (
        <div className="glass-card rounded-[3rem] p-10 border border-white/5 h-full flex flex-col">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-headline font-bold text-white tracking-tight">Recent Scenes</h3>
                <Link to="/dashboard/storyboarder" className="text-[10px] font-black uppercase tracking-widest text-accent-purple hover:underline flex items-center gap-2">
                    Storyboarder <span className="material-symbols-outlined text-sm text-accent-purple">open_in_new</span>
                </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 flex-grow">
                {scenes.map((scene) => (
                    <div key={scene.id} className="relative aspect-video rounded-2xl overflow-hidden group cursor-pointer border border-white/5 hover:border-accent-purple/30 transition-all duration-300">
                        <img src={scene.image} alt={`Scene ${scene.id}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80" />
                        <div className="absolute inset-0 bg-gradient-to-t from-dashboard-bg/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                ))}
            </div>
        </div>
    )
}
