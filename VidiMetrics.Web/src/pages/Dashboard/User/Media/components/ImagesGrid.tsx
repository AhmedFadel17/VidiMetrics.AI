import { useDeleteAiImageMutation, useGetAiImagesQuery } from '@/store/apis';
import { AssetType } from '@/types';
import { useState } from 'react';
import ImageCard from './ImageCard';
import Pagination from '@/components/ui/Pagination';
import { ErrorScreen, LoadingScreen } from '@/components/ui/Feedback/StatusScreens';
import ConfirmationDialog from '@/components/ui/Feedback/ConfirmationDialog'
import { showToast } from '@/utils/toast'

export default function ImagesGrid() {
    const [activeTab, setActiveTab] = useState<AssetType | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedId, setSelectedId] = useState<string>('');

    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(6)
    const { data: response, isLoading, error } = useGetAiImagesQuery({
        pageNumber: page,
        pageSize,
        searchTerm: searchQuery,
        assetType: activeTab
    })
    const [deleteVideo, { isLoading: isDeleting }] = useDeleteAiImageMutation();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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

    return (
        <div className="flex flex-col h-full overflow-hidden">


            {/* ── Page Header ── */}
            <div className="pt-2 pb-5 flex flex-col md:flex-row md:items-end justify-between gap-6 shrink-0">
                <div className="flex-1 max-w-md relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-secondary transition-colors">search</span>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-surface-container-lowest/50 border-none rounded-xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-secondary/20 placeholder:text-on-surface-variant/50 text-on-surface"
                        placeholder="Search assets by name, tag, or scene..."
                    />
                </div>
                <div>
                    <div className='flex items-center gap-3 flex-wrap'>

                        <div>
                            <div className="flex items-center gap-2 p-1 bg-surface-container-low rounded-xl">
                                <button
                                    onClick={() => setActiveTab(null)}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === null ? 'bg-surface-container-highest text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
                                >
                                    All Images
                                </button>

                                <button
                                    onClick={() => setActiveTab(AssetType.Show)}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === AssetType.Show ? 'bg-surface-container-highest text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
                                >
                                    Series
                                </button>
                                <button
                                    onClick={() => setActiveTab(AssetType.Episode)}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === AssetType.Episode ? 'bg-surface-container-highest text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
                                >
                                    Episodes
                                </button>
                                <button
                                    onClick={() => setActiveTab(AssetType.Character)}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === AssetType.Character ? 'bg-surface-container-highest text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
                                >
                                    Characters
                                </button>
                                <button
                                    onClick={() => setActiveTab(AssetType.Environment)}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === AssetType.Environment ? 'bg-surface-container-highest text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
                                >
                                    Environments
                                </button>
                                <button
                                    onClick={() => setActiveTab(AssetType.Unlinked)}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === AssetType.Unlinked ? 'bg-surface-container-highest text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
                                >
                                    Unlinked
                                    <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]"></span>
                                </button>
                            </div>
                        </div>


                    </div>

                </div>
            </div>



            <div className="">

                <div className="py-6">
                    <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-8">
                        {isLoading ? (
                            <LoadingScreen message="Retrieving Media Assets..." accentColor="purple" />
                        ) : error ? (
                            <ErrorScreen title="Neural Uplink Failed" message="Unable to retrieve image assets from the core engine." />
                        ) : (
                            response?.data?.items?.map(asset => (
                                <ImageCard
                                    key={asset.id}
                                    image={asset}
                                    handleDownload={(src) => handleDownload(src)}
                                    handleDelete={(id) => {
                                        setSelectedId(id);
                                        setIsDeleteDialogOpen(true);
                                    }}
                                />
                            ))


                        )}




                    </div>
                </div>

            </div >
            <div>
                <Pagination
                    page={page}
                    totalPages={response?.data?.totalPages || 0}
                    pageSize={pageSize}
                    totalCount={response?.data?.totalCount || 0}
                    onPageChange={(newPage) => setPage(newPage)}
                    pageSizeOption={{
                        values: [6, 12, 24],
                        onChange: (newPageSize: number) => {
                            setPageSize(newPageSize);
                            setPage(1);
                        }
                    }}
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

