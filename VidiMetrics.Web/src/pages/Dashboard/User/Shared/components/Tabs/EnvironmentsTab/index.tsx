import EnvironmentCard from "@/components/ui/Cards/EnvironmentCard";
import { useGetEnvironmentsQuery } from "@/store/apis";
import { StoryEnvironment } from "@/types/models/storyEngine";
import { useState } from "react";
import { GenericDataGrid } from "@/components/ui/Grids/GenericDataGrid";
import GlassLaunchButton from "@/components/ui/Buttons/GlassLaunchButton";
import { useNavigate } from "react-router-dom";

interface EnvironmentsTabProps {
    showId: string;
}

export default function EnvironmentsTab({ showId }: EnvironmentsTabProps) {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const [searchTerm, setSearchTerm] = useState('');

    const [sortState, setSortState] = useState({
        orderBy: 'CreatedAt',
        sortOrder: 'desc' as 'asc' | 'desc'
    });

    const sortOptions = [
        { label: 'Recently Added', orderBy: 'CreatedAt', sortOrder: 'desc' as const },
        { label: 'Oldest First', orderBy: 'CreatedAt', sortOrder: 'asc' as const },
    ];

    const { data: response, isLoading, error } = useGetEnvironmentsQuery({
        showId,
        pageNumber: page,
        pageSize,
        searchTerm,
        orderBy: sortState.orderBy,
        sortOrder: sortState.sortOrder
    });

    const responseData = response?.data;
    const environments: StoryEnvironment[] = responseData?.items || [];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-3xl font-headline font-bold text-white tracking-tight">Environments</h3>
                    <p className="text-white/40 text-sm font-medium">Manage and review your show parameters and environments.</p>
                </div>
                <GlassLaunchButton
                    title="Generate New Environment"
                    subtitle="Tap to Launch AI Environment Creator"
                    iconName="auto_awesome_motion"
                    variant="cyan"
                    onClick={() => navigate(`/dashboard/series/${showId}/environments/new`)}
                />
            </div>

            <GenericDataGrid<StoryEnvironment>
                items={environments}
                isLoading={isLoading}
                error={error}
                loadingMessage="Loading environments..."
                errorTitle="Network Error"
                errorMessage="Failed to fetch environments. Please try again."
                emptyStateMessage="No show parameters found matching this production filter."
                renderItem={(env) => <EnvironmentCard environment={env} />}
                searchOption={{
                    placeholder: "Search environments catalog...",
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
                cols={{ sm: 1, md: 2, lg: 3 }}
            />
        </div>
    );
}