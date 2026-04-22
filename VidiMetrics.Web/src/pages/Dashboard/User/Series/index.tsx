import SeriesStats from './components/SeriesStats'
import ProductionVault from './components/ProductionVault'
import Pagination from './components/Pagination'

export default function SeriesLibrary() {
    return (
        <div className="space-y-16 pb-20">
            {/* Page Header */}
            <header className="flex justify-between items-center">
                <h1 className="text-5xl font-headline font-bold text-white tracking-tight flex items-center gap-4">
                    Series <span className="text-gradient-purple">Library</span>
                </h1>

                {/* Actions Group */}
                <div className="flex gap-4">
                    <button className="glass-card w-12 h-12 rounded-2xl flex items-center justify-center border border-white/5 hover:border-white/20 transition-all duration-300">
                        <span className="material-symbols-outlined text-white/60">notifications</span>
                    </button>
                    <button className="glass-card h-12 px-6 rounded-2xl flex items-center gap-3 border border-white/5 hover:border-white/20 transition-all duration-300">
                        <span className="material-symbols-outlined text-accent-purple">auto_awesome</span>
                        <span className="text-xs font-bold text-white uppercase tracking-widest">AI Status</span>
                    </button>
                </div>
            </header>

            {/* Top Stats Section */}
            <section>
                <SeriesStats />
            </section>

            {/* Main Library Section */}
            <section>
                <ProductionVault />
            </section>

        </div>
    )
}
