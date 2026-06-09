import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { PageHeader } from '@/components/ui/PageHeader';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetShowsQuery } from '@/store/apis/storyEngine/shows.api';
import { ShowStatus } from '@/types/enums';
import GlassLaunchButton from '@/components/ui/Buttons/GlassLaunchButton';
import { GenericDataGrid, FilterGroupConfig } from '@/components/ui/Grids/GenericDataGrid';
import SeriesCard from '@/components/ui/Cards/SeriesCard';
import { Show } from '@/types';

export default function SeriesLibrary() {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(8);
    const [searchTerm, setSearchTerm] = useState('');

    const [queryState, setQueryState] = useState({
        filters: {} as Record<string, any>,
        orderBy: 'createdAt',
        sortOrder: 'desc' as 'asc' | 'desc'
    });

    const { data: response, isLoading, error } = useGetShowsQuery({
        pageNumber: page,
        pageSize,
        searchTerm,
        status: queryState.filters.status,
        createdAfter: queryState.filters.createdAfter,
        orderBy: queryState.orderBy,
        sortOrder: queryState.sortOrder
    });

    const showsData = response?.data;
    const shows: Show[] = showsData?.items || [];

    const filterFields: FilterGroupConfig[] = [
        {
            id: 'status',
            label: 'Production Status',
            type: 'radio',
            options: [
                { label: 'All', value: 'all' },
                { label: 'Draft', value: ShowStatus.Draft },
                { label: 'In Production', value: ShowStatus.InProduction },
                { label: 'Published', value: ShowStatus.Published },
            ]
        },
        {
            id: 'createdAfter',
            label: 'Created After Date',
            type: 'date'
        }
    ];

    const sortConfig = {
        currentOrderBy: queryState.orderBy,
        currentSortOrder: queryState.sortOrder,
        options: [
            { label: 'Newest First', orderBy: 'createdAt', sortOrder: 'desc' as const },
            { label: 'Oldest First', orderBy: 'createdAt', sortOrder: 'asc' as const },
            { label: 'Name (A-Z)', orderBy: 'title', sortOrder: 'asc' as const },
            { label: 'Name (Z-A)', orderBy: 'title', sortOrder: 'desc' as const }
        ],
        onChange: (newOrderBy: string, newSortOrder: 'asc' | 'desc') => {
            setQueryState(prev => ({ ...prev, orderBy: newOrderBy, sortOrder: newSortOrder }));
            setPage(1);
        }
    };

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <div>
                <Breadcrumbs items={[
                    { label: 'Home', path: '/' },
                    { label: 'Series Library' }
                ]} />
                <div className="py-5 flex justify-between gap-6">
                    <PageHeader
                        chipText="Series Library"
                        titlePrefix="Manage "
                        gradientText="Series"
                        description="Manage and track your AI-generated cinematic series."
                    />
                    <div className="flex justify-end items-center">
                        <GlassLaunchButton
                            title="Generate New Series"
                            subtitle="Tap to Launch AI Screenwriter"
                            iconName="auto_awesome"
                            variant="cyan"
                            onClick={() => navigate('/dashboard/series/new')}
                        />
                    </div>
                </div>
            </div>

            <GenericDataGrid<Show>
                items={shows}
                isLoading={isLoading}
                error={error}
                loadingMessage="Loading shows..."
                errorTitle="Network Error"
                errorMessage="Failed to fetch series. Please try again."
                emptyStateMessage="No show parameters found matching your filters."
                renderItem={(show) => <SeriesCard show={show} />}
                searchOption={{
                    placeholder: "Search series catalog...",
                    value: searchTerm,
                    onChange: (val) => { setSearchTerm(val); setPage(1); }
                }}
                filterOptions={{
                    fields: filterFields,
                    values: queryState.filters,
                    onChange: (nextFilters) => {
                        setQueryState(prev => ({ ...prev, filters: nextFilters }));
                        setPage(1);
                    }
                }}
                sortOption={sortConfig}
                paginationData={showsData}
                onPageChange={(p) => setPage(p)}
                onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
                cols={{ sm: 1, md: 2, lg: 4 }}
            />
        </div>
    );
}