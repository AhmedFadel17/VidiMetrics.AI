import CharacterCard from "@/components/ui/Cards/CharacterCard";
import { useGetCharactersQuery } from "@/store/apis";
import { Character } from "@/types/models/storyEngine";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GenericDataGrid } from "@/components/ui/Grids/GenericDataGrid";
import GlassLaunchButton from "@/components/ui/Buttons/GlassLaunchButton";

interface CharactersTabProps {
    showId: string;
}

export default function CharactersTab({ showId }: CharactersTabProps) {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(4);
    const [searchTerm, setSearchTerm] = useState('');

    const [sortState, setSortState] = useState({
        orderBy: 'CreatedAt',
        sortOrder: 'desc' as 'asc' | 'desc'
    });

    const sortOptions = [
        { label: 'Recently Added', orderBy: 'CreatedAt', sortOrder: 'desc' as const },
        { label: 'Oldest First', orderBy: 'CreatedAt', sortOrder: 'asc' as const },
        { label: 'Name A-Z', orderBy: 'Name', sortOrder: 'asc' as const },
        { label: 'Name Z-A', orderBy: 'Name', sortOrder: 'desc' as const },
        { label: 'Insight Level (High-Low)', orderBy: 'InsightLevel', sortOrder: 'desc' as const },
        { label: 'Insight Level (Low-High)', orderBy: 'InsightLevel', sortOrder: 'asc' as const },
    ];

    const { data: response, isLoading, error } = useGetCharactersQuery({
        showId,
        pageNumber: page,
        pageSize,
        orderBy: sortState.orderBy,
        sortOrder: sortState.sortOrder,
        searchTerm
    });

    const responseData = response?.data;
    const characters: Character[] = responseData?.items || [];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-3xl font-headline font-bold text-white tracking-tight">Characters</h3>
                    <p className="text-white/40 text-sm font-medium">Manage and review your cinematic story characters.</p>
                </div>
                <div>
                    <GlassLaunchButton
                        title="Generate New Character"
                        subtitle="Tap to Launch AI Character Creator"
                        iconName="auto_awesome"
                        variant="cyan"
                        onClick={() => navigate(`/dashboard/series/${showId}/characters/new`)}
                    />
                </div>
            </div>

            <GenericDataGrid<Character>
                items={characters}
                isLoading={isLoading}
                error={error}
                loadingMessage="Loading characters..."
                errorTitle="Neural Uplink Failed"
                errorMessage="Unable to retrieve character data. Please check your matrix environment."
                emptyStateMessage="No characters found matching your active filter values."
                searchOption={{
                    placeholder: "Search characters...",
                    value: searchTerm,
                    onChange: (val) => { setSearchTerm(val); setPage(1); }
                }}
                sortOption={{
                    options: sortOptions,
                    currentOrderBy: sortState.orderBy,
                    currentSortOrder: sortState.sortOrder,
                    onChange: (newOrderBy, newSortOrder) => {
                        setSortState({ orderBy: newOrderBy, sortOrder: newSortOrder });
                        setPage(1);
                    }
                }}
                paginationData={responseData ? {
                    pageNumber: responseData.pageNumber || 1,
                    totalPages: responseData.totalPages || 1,
                    pageSize: responseData.pageSize || 5,
                    totalCount: responseData.totalCount || 0
                } : undefined}
                onPageChange={(p) => setPage(p)}
                onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
                cols={{ sm: 1, md: 1, lg: 2 }}
                renderItem={(char) => <CharacterCard character={char} />}
            >
            </GenericDataGrid>
        </div>
    );
}