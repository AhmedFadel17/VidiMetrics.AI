import { useDeleteAiImageMutation, useGetAiImagesQuery } from '@/store/apis';
import { AiImage, AssetType } from '@/types';
import { useState } from 'react';
import ImageCard from './ImageCard';
import { ErrorScreen, LoadingScreen } from '@/components/ui/Feedback/StatusScreens';
import ConfirmationDialog from '@/components/ui/Feedback/ConfirmationDialog'
import { showToast } from '@/utils/toast'
import { FilterGroupConfig, GenericDataGrid } from '@/components/ui/Grids/GenericDataGrid';

export default function ImagesGrid() {
    const [selectedId, setSelectedId] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');

    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(6)
    const [queryState, setQueryState] = useState({
        filters: {} as Record<string, any>,
        orderBy: 'createdAt',
        sortOrder: 'desc' as 'asc' | 'desc'
    });
    const { data: response, isLoading, error } = useGetAiImagesQuery({
        pageNumber: page,
        pageSize,
        searchTerm: searchTerm,
        assetType: queryState.filters.assetType,
        orderBy: queryState.orderBy,
        sortOrder: queryState.sortOrder
    })
    const [deleteImage, { isLoading: isDeleting }] = useDeleteAiImageMutation();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const handleDelete = async () => {
        if (!selectedId) {
            return;
        }
        try {
            await deleteImage(selectedId).unwrap();
            showToast.success('Image Deleted', `Image has been removed successfully.`);
        } catch (error: any) {
            showToast.error('Deletion Failed', error.data?.message || 'A system error occurred while trying to remove the image.');
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
                : 'ai-generation.png';

            a.download = finalFileName;

            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            showToast.success('Image Downloaded', `Image has been downloaded successfully.`);
        } catch (error: any) {
            showToast.error('Download Failed', error.data?.message || 'A system error occurred while trying to download the image.');
        }
    }

    const filterFields: FilterGroupConfig[] = [
        {
            id: 'assetType',
            label: 'Asset Type',
            type: 'radio',
            options: [
                { label: 'All', value: 'all' },
                { label: "Series", value: AssetType.Show },
                { label: "Episodes", value: AssetType.Episode },
                { label: "Characters", value: AssetType.Character },
                { label: "Locations", value: AssetType.Location },
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



    if (isLoading) {
        return <LoadingScreen message="Loading images..." />
    }
    if (error) {
        return <ErrorScreen title="Failed to fetch images" message="Please try again." />
    }
    const imagesData = response?.data;
    const images: AiImage[] = imagesData?.items || [];

    return (
        <div className="flex flex-col h-full overflow-hidden">

            <div>
                <GenericDataGrid<AiImage>
                    items={images}
                    isLoading={isLoading}
                    error={error}
                    loadingMessage="Loading images..."
                    errorTitle="Network Error"
                    errorMessage="Failed to fetch images. Please try again."
                    emptyStateMessage="No image parameters found matching your filters."
                    renderItem={(image) => <ImageCard image={image} handleDownload={(src) => handleDownload(src)}
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
                    paginationData={imagesData}
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

