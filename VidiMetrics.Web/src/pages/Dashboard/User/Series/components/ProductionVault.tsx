import ProductionCard from './ProductionCard'
import CreateSeriesCard from './CreateSeriesCard'
import { useGetShowsQuery } from '@/store/apis/storyEngine/shows.api'
import { Series } from '@/types/series'
import { ShowStatus } from '@/types/enums'
import Pagination from './Pagination'
import { useState } from 'react'

export default function ProductionVault() {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [status, setStatus] = useState<ShowStatus | undefined>(undefined)
    const [searchTerm, setSearchTerm] = useState('')

    const { data: response, isLoading, error } = useGetShowsQuery({
        pageNumber: page,
        pageSize,
        status,
        searchTerm
    })

    const shows: Series[] = response?.data?.items || []


    const handleStatusChange = (newStatus: string) => {
        setStatus(newStatus === 'all' ? undefined : parseInt(newStatus))
        setPage(1) // Reset to first page on filter change
    }

    return (
        <div className="space-y-10">
            {/* Header Area */}
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6">
                <div className="space-y-2">
                    <h2 className="text-4xl font-headline font-bold text-white tracking-tight">Production Vault</h2>
                    <p className="text-white/40 text-sm font-medium">Manage and track your active cinematic AI series.</p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    {/* Search Bar */}
                    <div className="flex items-center glass-card border border-white/5 rounded-2xl overflow-hidden focus-within:border-white/20 transition-all duration-300">
                        <input
                            type="text"
                            placeholder="Search series..."
                            className="bg-transparent border-none outline-none px-5 py-3 text-white text-sm w-48 md:w-64"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value)
                                setPage(1)
                            }}
                        />
                        <div className="px-4 py-3 bg-white/5 text-white/60 border-l border-white/5">
                            <span className="material-symbols-outlined text-lg text-white/40">search</span>
                        </div>
                    </div>

                    {/* Status Dropdown */}
                    <div className="relative group">
                        <select
                            className="glass-card appearance-none bg-transparent hover:bg-white/10 px-6 py-3 pr-12 rounded-2xl text-xs font-bold text-white uppercase tracking-widest border border-white/5 transition-all duration-300 outline-none cursor-pointer"
                            value={status === undefined ? 'all' : status.toString()}
                            onChange={(e) => handleStatusChange(e.target.value)}
                        >
                            <option value="all" className="bg-[#0f0f0f] text-white">All Status</option>
                            <option value={ShowStatus.Draft} className="bg-[#0f0f0f] text-white">Draft</option>
                            <option value={ShowStatus.InProduction} className="bg-[#0f0f0f] text-white">In Production</option>
                            <option value={ShowStatus.Published} className="bg-[#0f0f0f] text-white">Published</option>
                            <option value={ShowStatus.Archived} className="bg-[#0f0f0f] text-white">Archived</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40 group-hover:text-white/60 transition-colors">
                            expand_more
                        </span>
                    </div>
                </div>
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
                            status={series.status}
                            episodes={series.totalEpisodes}
                        // views will use default from ProductionCard
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
