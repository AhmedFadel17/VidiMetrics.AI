import { useDeleteAiVideoMutation, useGetAiVideosQuery } from '@/store/apis';
import { AiVideo, AssetType } from '@/types';
import { useState } from 'react';
import VideoCard from './VideoCard';
import ConfirmationDialog from '@/components/ui/Feedback/ConfirmationDialog'
import { showToast } from '@/utils/toast'
import { ErrorScreen, LoadingScreen } from '@/components/ui/Feedback/StatusScreens';
import { FilterGroupConfig, GenericDataGrid } from '@/components/ui/Grids/GenericDataGrid';


export default function VideosGrid() {
    const [selectedId, setSelectedId] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(6)
    const [queryState, setQueryState] = useState({
        filters: {} as Record<string, any>,
        orderBy: 'createdAt',
        sortOrder: 'desc' as 'asc' | 'desc'
    });
    const { data: response, isLoading, error } = useGetAiVideosQuery({
        pageNumber: page,
        pageSize,
        searchTerm: searchTerm,
        assetType: queryState.filters.assetType,
        orderBy: queryState.orderBy,
        sortOrder: queryState.sortOrder
    })
    const [deleteVideo, { isLoading: isDeleting }] = useDeleteAiVideoMutation();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const filterFields: FilterGroupConfig[] = [
        {
            id: 'assetType',
            label: 'Asset Type',
            type: 'radio',
            options: [
                { label: 'All', value: 'all' },
                { label: "Series", value: AssetType.Show },
                { label: "Episodes", value: AssetType.Episode },
                { label: "Scenes", value: AssetType.Scene },
                { label: "Unlinked", value: AssetType.Unlinked },
            ]
        }
    ];

    const sortConfig = {
        currentOrderBy: queryState.orderBy,
        currentSortOrder: queryState.sortOrder,
        options: [
            { label: 'Newest First', orderBy: 'createdAt', sortOrder: 'desc' as const },
            { label: 'Oldest First', orderBy: 'createdAt', sortOrder: 'asc' as const },
            { label: 'Size (Small to Large)', orderBy: 'size', sortOrder: 'asc' as const },
            { label: 'Size (Large to Small)', orderBy: 'size', sortOrder: 'desc' as const }
        ],
        onChange: (newOrderBy: string, newSortOrder: 'asc' | 'desc') => {
            setQueryState(prev => ({ ...prev, orderBy: newOrderBy, sortOrder: newSortOrder }));
            setPage(1);
        }
    };


    const handleDelete = async () => {
        if (!selectedId) {
            return;
        }
        try {
            await deleteVideo(selectedId).unwrap();
            showToast.success('Video Deleted', `Video has been removed successfully.`);
        } catch (error: any) {
            showToast.error('Deletion Failed', error.data?.message || 'A system error occurred while trying to remove the video.');
        } finally {
            setIsDeleteDialogOpen(false);
        }
    }

    const handleDownload = async (src: string) => {
        if (!src) {
            return;
        }
        try {
            const blob = await fetch(src).then(res => res.blob());
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;

            const cleanUrl = src.split('?')[0];

            const extractedFileName = cleanUrl.split('/').pop();

            const finalFileName = extractedFileName && extractedFileName.includes('.')
                ? extractedFileName
                : 'ai-generation.mp4';

            a.download = finalFileName;

            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            showToast.success('Video Downloaded', `Video has been downloaded successfully.`);
        } catch (error: any) {
            showToast.error('Download Failed', error.data?.message || 'A system error occurred while trying to download the video.');
        }
    }

    if (isLoading) {
        return <LoadingScreen message="Loading images..." />
    }
    if (error) {
        return <ErrorScreen title="Failed to fetch images" message="Please try again." />
    }
    const videosData = response?.data;
    const videos: AiVideo[] = videosData?.items || [];

    return (
        <div className="flex flex-col h-full overflow-hidden">

            <div>
                <GenericDataGrid<AiVideo>
                    items={videos}
                    isLoading={isLoading}
                    error={error}
                    loadingMessage="Loading videos..."
                    errorTitle="Network Error"
                    errorMessage="Failed to fetch videos. Please try again."
                    emptyStateMessage="No image parameters found matching your filters."
                    renderItem={(video) => <VideoCard video={video} handleDownload={(src) => handleDownload(src)}
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
                    paginationData={videosData}
                    onPageChange={(p) => setPage(p)}
                    onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
                    cols={{ sm: 1, md: 2, lg: 4 }}
                />

            </div>


            <ConfirmationDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDelete}
                title="Remove Video"
                description={`Are you sure you want to remove this video?`}
                confirmText="Delete"
                variant="danger"
                isLoading={isDeleting}
            />
        </div >
    );
};

