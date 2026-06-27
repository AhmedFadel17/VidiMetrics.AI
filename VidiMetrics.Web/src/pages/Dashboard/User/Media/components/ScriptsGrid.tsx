import { useState } from 'react';
import ConfirmationDialog from '@/components/ui/Feedback/ConfirmationDialog'
import { showToast } from '@/utils/toast'
import { ErrorScreen, LoadingScreen } from '@/components/ui/Feedback/StatusScreens';
import ScriptCard from './ScriptCard';
import { useGetAiScriptsQuery, useDeleteAiScriptMutation } from '@/store/apis';
import { toast } from 'sonner';
import { FilterGroupConfig, GenericDataGrid } from '@/components/ui/Grids/GenericDataGrid';
import { AiScript } from '@/types';


export default function ScriptsGrid() {
    const [selectedId, setSelectedId] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(6)
    const [queryState, setQueryState] = useState({
        filters: {} as Record<string, any>,
        orderBy: 'createdAt',
        sortOrder: 'desc' as 'asc' | 'desc'
    });

    const { data: response, isLoading, error } = useGetAiScriptsQuery({
        pageNumber: page,
        pageSize,
        searchTerm: searchTerm,
        isLinked: queryState.filters.isLinked,
        orderBy: queryState.orderBy,
        sortOrder: queryState.sortOrder
    })
    const [deleteScript, { isLoading: isDeleting }] = useDeleteAiScriptMutation();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const handleDelete = async () => {
        if (!selectedId) {
            return;
        }
        try {
            await deleteScript(selectedId).unwrap();
            showToast.success('Script Deleted', `Script has been removed successfully.`);
        } catch (error: any) {
            showToast.error('Deletion Failed', error.data?.message || 'A system error occurred while trying to remove the script.');
        } finally {
            setIsDeleteDialogOpen(false);
        }
    }

    const handleDownload = async (src: string) => {
        if (!src) {
            return;
        }
        toast.warning("This feature is not available yet.")
    }

    const filterFields: FilterGroupConfig[] = [
        {
            id: 'isLinked',
            label: 'Asset Type',
            type: 'radio',
            options: [
                { label: 'All', value: "all" },
                { label: "Linked", value: true },
                { label: "Unlinked", value: false },
            ]
        }
    ];

    const sortConfig = {
        currentOrderBy: queryState.orderBy,
        currentSortOrder: queryState.sortOrder,
        options: [
            { label: 'Newest First', orderBy: 'createdAt', sortOrder: 'desc' as const },
            { label: 'Oldest First', orderBy: 'createdAt', sortOrder: 'asc' as const },
        ],
        onChange: (newOrderBy: string, newSortOrder: 'asc' | 'desc') => {
            setQueryState(prev => ({ ...prev, orderBy: newOrderBy, sortOrder: newSortOrder }));
            setPage(1);
        }
    };
    if (isLoading) {
        return <LoadingScreen message="Loading images..." />
    }
    if (error) {
        return <ErrorScreen title="Failed to fetch images" message="Please try again." />
    }
    const scriptsData = response?.data;
    const scripts: AiScript[] = scriptsData?.items || [];
    return (
        <div className="flex flex-col h-full overflow-hidden">

            <div>
                <GenericDataGrid<AiScript>
                    items={scripts}
                    isLoading={isLoading}
                    error={error}
                    loadingMessage="Loading images..."
                    errorTitle="Network Error"
                    errorMessage="Failed to fetch images. Please try again."
                    emptyStateMessage="No image parameters found matching your filters."
                    renderItem={(script) => <ScriptCard script={script} handleDownload={(src) => handleDownload(src)}
                        handleDelete={(id) => {
                            setSelectedId(id);
                            setIsDeleteDialogOpen(true);
                        }}
                    />}
                    searchOption={{
                        placeholder: "Search Media assets...",
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
                    paginationData={scriptsData}
                    onPageChange={(p) => setPage(p)}
                    onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
                    cols={{ sm: 1, md: 2, lg: 4 }}
                />

            </div>
            <ConfirmationDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDelete}
                title="Remove Script"
                description={`Are you sure you want to remove this script?`}
                confirmText="Delete"
                variant="danger"
                isLoading={isDeleting}
            />
        </div >
    );
};

