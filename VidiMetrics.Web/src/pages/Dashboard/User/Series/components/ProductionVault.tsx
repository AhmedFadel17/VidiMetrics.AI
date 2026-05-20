import SearchInput from '@/components/ui/Inputs/SearchInput'
import FilterDropdown from '@/components/ui/FilterDropdown'
import ProductionCard from './ProductionCard'
import CreateSeriesCard from './CreateSeriesCard'
import { useGetShowsQuery } from '@/store/apis/storyEngine/shows.api'
import { Series } from '@/types/series'
import { ShowStatus } from '@/types/enums'
import { FilterOption } from '@/types/ui'
import Pagination from '../../../../../components/ui/Pagination'
import { useState } from 'react'

export default function ProductionVault() {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(5)
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
        setStatus(newStatus === 'all' ? undefined : parseInt(newStatus) as ShowStatus)
        setPage(1) // Reset to first page on filter change
    }

    const statusOptions: FilterOption[] = [
        { label: 'All Status', value: 'all' },
        { label: 'Draft', value: ShowStatus.Draft },
        { label: 'In Production', value: ShowStatus.InProduction },
        { label: 'Published', value: ShowStatus.Published },
        { label: 'Archived', value: ShowStatus.Archived },
    ];

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
                    <SearchInput
                        value={searchTerm}
                        onChange={(val) => {
                            setSearchTerm(val);
                            setPage(1);
                        }}
                        placeholder="Search series..."
                        className="w-48 md:w-64"
                    />

                    {/* Status Dropdown */}
                    <FilterDropdown
                        value={status === undefined ? 'all' : status}
                        onChange={(opt) => handleStatusChange(opt.value.toString())}
                        options={statusOptions}
                        className="w-48"
                    />
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
