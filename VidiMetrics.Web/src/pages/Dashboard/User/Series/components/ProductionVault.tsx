import ProductionCard from './ProductionCard'
import CreateSeriesCard from './CreateSeriesCard'

const SAMPLE_SERIES = [
    {
        id: '1',
        title: 'Neon Chronicles: Void',
        episodes: 12,
        views: '45.2k',
        status: 'IN PRODUCTION' as const,
        image: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=800&auto=format&fit=crop&q=60'
    },
    {
        id: '2',
        title: 'Fractal Architectures',
        episodes: 8,
        views: '128.9k',
        status: 'RELEASED' as const,
        image: 'https://images.unsplash.com/photo-1633167606207-d840b5070fc2?w=800&auto=format&fit=crop&q=60'
    },
    {
        id: '3',
        title: 'The Ember Path',
        episodes: 0,
        views: '--',
        status: 'DRAFT' as const,
        image: 'https://images.unsplash.com/photo-1464802686167-b939a67e0b21?w=800&auto=format&fit=crop&q=60'
    },
    {
        id: '4',
        title: 'Station Delta: Echoes',
        episodes: 4,
        views: '12.1k',
        status: 'IN PRODUCTION' as const,
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60'
    },
    {
        id: '5',
        title: "Nature's Algorithm",
        episodes: 15,
        views: '890.3k',
        status: 'RELEASED' as const,
        image: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800&auto=format&fit=crop&q=60'
    }
]

export default function ProductionVault() {
    return (
        <div className="space-y-10">
            {/* Header Area */}
            <div className="flex justify-between items-end">
                <div className="space-y-2">
                    <h2 className="text-4xl font-headline font-bold text-white tracking-tight">Production Vault</h2>
                    <p className="text-white/40 text-sm font-medium">Manage and track your active cinematic AI series.</p>
                </div>

                {/* Filter Button */}
                <button className="glass-card hover:bg-white/10 px-6 py-3 rounded-2xl flex items-center gap-3 border border-white/5 transition-all duration-300">
                    <span className="material-symbols-outlined text-white/60">filter_list</span>
                    <span className="text-xs font-bold text-white uppercase tracking-widest">All Status</span>
                </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-3 gap-8">
                {/* Create New Card */}

                <div className="">
                    <CreateSeriesCard />
                </div>
                {SAMPLE_SERIES.map(series => (
                    <ProductionCard key={series.id} {...series} />
                ))}


            </div>
        </div>
    )
}
