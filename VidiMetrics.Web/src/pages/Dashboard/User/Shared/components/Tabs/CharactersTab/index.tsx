import CharacterCard from "@/components/ui/Cards/CharacterCard";
import FilterDropdown from "@/components/ui/FilterDropdown";
import Pagination from "@/components/ui/Pagination";
import SearchInput from "@/components/ui/SearchInput";
import { useGetCharactersQuery } from "@/store/apis";
import { FilterOption } from "@/types";
import { Character } from "@/types/models/storyEngine";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface CharactersTabProps {
    showId: string;
}

export default function CharactersTab({ showId }: CharactersTabProps) {
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

    const filterOptions: FilterOption[] = [
        { label: 'Recently Added', value: 'newest', orderBy: 'CreatedAt', sortOrder: 'desc' },
        { label: 'Oldest First', value: 'oldest', orderBy: 'CreatedAt', sortOrder: 'asc' },
        { label: 'Name A-Z', value: 'name_asc', orderBy: 'Name', sortOrder: 'asc' },
        { label: 'Name Z-A', value: 'name_desc', orderBy: 'Name', sortOrder: 'desc' },
        { label: 'Insight Level (High-Low)', value: 'insightLevel_desc', orderBy: 'InsightLevel', sortOrder: 'desc' },
        { label: 'Insight Level (Low-High)', value: 'insightLevel_asc', orderBy: 'InsightLevel', sortOrder: 'asc' },
    ];

    const { data: response, isLoading, error } = useGetCharactersQuery(
        {
            showId,
            pageNumber: page,
            pageSize,
            orderBy: sortOption.orderBy,
            sortOrder: sortOption.sortOrder,
            searchTerm
        }
    );
    const characters: Character[] = response?.data?.items || []

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-white">Characters</h3>
                <div className="flex flex-wrap items-center gap-4">
                    {/* Search Bar */}
                    <SearchInput
                        value={searchTerm}
                        onChange={(val) => {
                            setSearchTerm(val);
                            setPage(1);
                        }}
                        placeholder="Search characters..."
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* New Episode Action */}
                <button onClick={() => navigate(`/dashboard/series/${showId}/characters/new`)} className="border-[1.5px] border-dashed border-white/10 rounded-[2rem] bg-white/[0.02] hover:bg-white/[0.04] hover:border-accent-cyan/40 transition-all duration-500 group flex flex-col items-center justify-center p-8 text-center min-h-[280px]">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:bg-accent-cyan/20 transition-all duration-500">
                        <span className="material-symbols-outlined text-white/50 group-hover:text-accent-cyan transition-colors text-2xl">auto_awesome</span>
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">Generate New Character</h4>
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Tap to launch AI character generator</p>
                </button>
                {isLoading ? (
                    [1, 2, 3].map(i => (
                        <div key={i} className="glass-card h-64 rounded-2xl animate-pulse bg-white/5 border border-white/5"></div>
                    ))
                ) : error ? (
                    <div className="col-span-full p-12 glass-panel border-error/20 flex flex-col items-center justify-center text-center space-y-4">
                        <span className="material-symbols-outlined text-error text-5xl">warning</span>
                        <h3 className="text-xl font-bold text-white">Neural Uplink Failed</h3>
                        <p className="text-white/40">Unable to retrieve character data.</p>
                    </div>
                ) : (
                    characters.map((char, index) => (
                        <CharacterCard key={index} character={char} />
                    ))
                )}
            </div>
            <section className="pt-8">
                <Pagination page={response?.data?.pageNumber || 0} pageSize={response?.data?.pageSize || 0} totalPages={response?.data?.totalPages || 0} totalCount={response?.data?.totalCount || 0} onPageChange={(page) => setPage(page)} />
            </section>
        </div>
    )
}