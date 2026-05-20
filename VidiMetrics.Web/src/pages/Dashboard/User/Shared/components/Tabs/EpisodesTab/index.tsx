import EpisodeCard from "@/components/ui/Cards/EposideCard"
import Pagination from "@/components/ui/Pagination";
import SearchInput from "@/components/ui/Inputs/SearchInput";
import FilterDropdown from "@/components/ui/FilterDropdown";
import { useGetEpisodesQuery } from "@/store/apis";
import { Episode } from "@/types/models/storyEngine"
import { FilterOption } from "@/types/ui";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface EpisodesTabProps {
    showId: string;
}

export default function EpisodesTab({ showId }: EpisodesTabProps) {
    const navigate = useNavigate();
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(5)
    const [searchTerm, setSearchTerm] = useState('')
    const [sortOption, setSortOption] = useState<FilterOption>({
        label: 'Newest',
        value: 'newest',
        orderBy: 'CreatedAt',
        sortOrder: 'desc'
    })

    const { data: response, isLoading, error } = useGetEpisodesQuery({
        showId,
        pageNumber: page,
        pageSize,
        searchTerm,
        orderBy: sortOption.orderBy,
        sortOrder: sortOption.sortOrder
    });
    const episodes: Episode[] = response?.data?.items || []

    const filterOptions: FilterOption[] = [
        { label: 'Recently Added', value: 'newest', orderBy: 'CreatedAt', sortOrder: 'desc' },
        { label: 'Oldest First', value: 'oldest', orderBy: 'CreatedAt', sortOrder: 'asc' },
        { label: 'Episode Number (Low-High)', value: 'number_asc', orderBy: 'EpisodeNumber', sortOrder: 'asc' },
        { label: 'Episode Number (High-Low)', value: 'number_desc', orderBy: 'EpisodeNumber', sortOrder: 'desc' },
    ];

    return (
        <div className="space-y-8">
            {/* Header Area */}
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6">
                <div className="space-y-2">
                    <h3 className="text-3xl font-headline font-bold text-white tracking-tight">Episodes</h3>
                    <p className="text-white/40 text-sm font-medium">Manage and review your cinematic story entries.</p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    {/* Search Bar */}
                    <SearchInput
                        value={searchTerm}
                        onChange={(val) => {
                            setSearchTerm(val);
                            setPage(1);
                        }}
                        placeholder="Search episodes..."
                        className="w-48 md:w-64"
                    />

                    {/* Filter Dropdown */}
                    <FilterDropdown
                        value={sortOption.value}
                        onChange={(opt) => {
                            setSortOption(opt);
                            setPage(1);
                        }}
                        options={filterOptions}
                        className="w-48"
                    />


                </div>
            </div>

            {/* Episodes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* New Episode Action */}
                <button
                    onClick={() => navigate(`/dashboard/series/${showId}/episodes/new`)}
                    className="border-[1.5px] border-dashed border-white/10 rounded-[2.5rem] bg-white/[0.02] hover:bg-white/[0.04] hover:border-accent-cyan/40 transition-all duration-500 group flex flex-col items-center justify-center p-8 text-center min-h-[300px]"
                >
                    <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:bg-accent-cyan/20 transition-all duration-500">
                        <span className="material-symbols-outlined text-white/50 group-hover:text-accent-cyan transition-colors text-3xl">auto_awesome</span>
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">Generate New Episode</h4>
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Tap to launch AI screenwriter</p>
                </button>
                {isLoading ? (
                    [1, 2, 3].map(i => (
                        <div key={i} className="glass-card h-72 rounded-[2.5rem] animate-pulse bg-white/5 border border-white/5"></div>
                    ))
                ) : error ? (
                    <div className="col-span-full p-12 glass-panel border-error/20 flex flex-col items-center justify-center text-center space-y-4">
                        <span className="material-symbols-outlined text-error text-5xl">warning</span>
                        <h3 className="text-xl font-bold text-white">Neural Uplink Failed</h3>
                        <p className="text-white/40">Unable to retrieve episode data.</p>
                    </div>
                ) : (
                    episodes.map((ep, index) => (
                        <EpisodeCard key={index} episode={ep} />
                    ))
                )}
            </div>
            <section className="pt-8">
                <Pagination page={response?.data?.pageNumber || 0} pageSize={response?.data?.pageSize || 0} totalPages={response?.data?.totalPages || 0} totalCount={response?.data?.totalCount || 0} onPageChange={(page) => setPage(page)} />
            </section>
        </div>
    )
}
