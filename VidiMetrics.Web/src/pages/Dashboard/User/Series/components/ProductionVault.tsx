import ProductionCard from './ProductionCard'
import CreateSeriesCard from './CreateSeriesCard'
import { useGetShowsQuery } from '@/store/apis/storyEngine/shows.api'
import { Series } from '@/types/series'
import Pagination from './Pagination'
import { useState } from 'react'

export default function ProductionVault() {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const { data: response, isLoading, error } = useGetShowsQuery({ pageNumber: page, pageSize })
    const shows: Series[] = response?.data?.items || []

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Create New Card */}
                <CreateSeriesCard />

                {isLoading ? (
                    // Simple skeleton loader for cards
                    [1, 2].map(i => (
                        <div key={i} className="glass-card rounded-3xl h-[400px] animate-pulse bg-white/5 border border-white/5"></div>
                    ))
                ) : error ? (
                    <div className="col-span-full p-12 glass-panel border-error/20 flex flex-col items-center justify-center text-center space-y-4">
                        <span className="material-symbols-outlined text-error text-5xl">warning</span>
                        <h3 className="text-xl font-bold text-white">Neural Uplink Failed</h3>
                        <p className="text-white/40">Unable to retrieve series data from the core engine.</p>
                    </div>
                ) : (
                    shows.map(series => (
                        <ProductionCard
                            key={series.id}
                            id={series.id}
                            title={series.title}
                        // status, views, episodes will use defaults from ProductionCard
                        />
                    ))
                )}
            </div>
            {/* Footer Pagination */}
            <section className="pt-8">
                <Pagination page={response?.data?.pageNumber || 0} pageSize={response?.data?.pageSize || 0} totalPages={response?.data?.totalPages || 0} totalCount={response?.data?.totalCount || 0} onPageChange={(page) => setPage(page)} />
            </section>
        </div>
    )
}
