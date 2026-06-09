import EpisodeCard from "@/components/ui/Cards/EposideCard";
import { useGetEpisodesQuery } from "@/store/apis";
import { Episode } from "@/types/models/storyEngine";
import { useState } from "react";
import { GenericDataGrid } from "@/components/ui/Grids/GenericDataGrid";
import GlassLaunchButton from "@/components/ui/Buttons/GlassLaunchButton";
import { useNavigate } from "react-router-dom";

interface EpisodesTabProps {
    showId: string;
}

export default function EpisodesTab({ showId }: EpisodesTabProps) {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(8);
    const [searchTerm, setSearchTerm] = useState('');

    const [sortState, setSortState] = useState({
        orderBy: 'CreatedAt',
        sortOrder: 'desc' as 'asc' | 'desc'
    });

    const sortOptions = [
        { label: 'Recently Added', orderBy: 'CreatedAt', sortOrder: 'desc' as const },
        { label: 'Oldest First', orderBy: 'CreatedAt', sortOrder: 'asc' as const },
        { label: 'Episode Number (Low-High)', orderBy: 'EpisodeNumber', sortOrder: 'asc' as const },
        { label: 'Episode Number (High-Low)', orderBy: 'EpisodeNumber', sortOrder: 'desc' as const },
    ];

    const { data: response, isLoading, error } = useGetEpisodesQuery({
        showId,
        pageNumber: page,
        pageSize,
        searchTerm,
        orderBy: sortState.orderBy,
        sortOrder: sortState.sortOrder
    });

    const responseData = response?.data;
    const episodes: Episode[] = responseData?.items || [];

    return (
        <div className="space-y-6">
            {/* Header Area */}
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-3xl font-headline font-bold text-white tracking-tight">Episodes</h3>
                    <p className="text-white/40 text-sm font-medium">Manage and review your cinematic story entries.</p>
                </div>
                <GlassLaunchButton
                    title="Generate New Episode"
                    subtitle="Tap to Launch AI Episode Creator"
                    iconName="auto_awesome_motion"
                    variant="cyan"
                    onClick={() => navigate(`/dashboard/series/${showId}/environments/new`)}
                />
            </div>


            <GenericDataGrid<Episode>
                items={episodes}
                isLoading={isLoading}
                error={error}
                loadingMessage="Loading episodes..."
                errorTitle="Neural Uplink Failed"
                errorMessage="Unable to retrieve episode data. Please check your matrix layout connection."
                emptyStateMessage="No episodes found matching your current matrix criteria."
                renderItem={(ep) => <EpisodeCard episode={ep} />}
                searchOption={{
                    placeholder: "Search episodes...",
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
                cols={{ sm: 1, md: 2, lg: 4 }}
            />
        </div>
    );
}