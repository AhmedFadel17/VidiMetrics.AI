import { useGetLocationByIdQuery, useGetShowByIdQuery, useDeleteLocationMutation } from '@/store/apis'
import { useParams, useNavigate } from 'react-router-dom'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import { ErrorScreen, LoadingScreen } from '@/components/ui/Feedback/StatusScreens'
import { useState } from 'react'
import ConfirmationDialog from '@/components/ui/Feedback/ConfirmationDialog'
import { showToast } from '@/utils/toast'

export default function LocationDetails() {
    const { showId, id: locationId } = useParams<{ showId: string, id: string }>();
    const navigate = useNavigate();
    const { data: showResponse, isLoading: isShowLoading } = useGetShowByIdQuery(showId || '');
    const { data: locationResponse, isLoading: isLocationLoading } = useGetLocationByIdQuery(locationId || '');
    const [deleteLocation, { isLoading: isDeleting }] = useDeleteLocationMutation();

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const show = showResponse?.data;
    const location = locationResponse?.data;

    if (isShowLoading || isLocationLoading) return <LoadingScreen message="Accessing Location Archives..." accentColor="purple" />
    if (!show || !location) return <ErrorScreen title="Series Connection Lost" message="Unable to retrieve location details for location placement." />

    const formattedDate = new Date(location.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    const handleDelete = async () => {
        if (!locationId) return;
        try {
            await deleteLocation(locationId).unwrap();
            showToast.success('Location Deprioritized', `${location.name} has been removed from the active series archives.`);
            navigate(`/dashboard/series/${showId}?tab=Locations`);
        } catch (error: any) {
            showToast.error('De-initialization Failed', error.data?.message || 'A system error occurred while trying to remove the location.');
        } finally {
            setIsDeleteDialogOpen(false);
        }
    };

    return (
        <div className="space-y-10 pb-20">
            {/* Top Navigation / Breadcrumbs */}
            <Breadcrumbs items={[
                { label: 'Home', path: '/' },
                { label: 'Series Library', path: '/dashboard/series' },
                { label: show.title, path: `/dashboard/series/${show.id}` },
                { label: 'Locations', path: `/dashboard/series/${show.id}?tab=Locations` },
                { label: location.name },
            ]} />

            {/* Main Content Canvas */}
            <div className="max-w-7xl mx-auto px-4 lg:px-10">
                {/* Hero Section & Asymmetric Layout */}
                <div className="grid grid-cols-12 gap-10 items-start">
                    <div className="col-span-12 lg:col-span-5 lg:sticky lg:top-28">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent z-10 rounded-2xl"></div>
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                            <div className="relative rounded-2xl overflow-hidden aspect-[4/5] cinematic-shadow border border-outline-variant/15 bg-surface-container-low">
                                {location.referenceImageUrl ? (
                                    <img
                                        alt={`${location.name} Location Portrait`}
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                        src={location.referenceImageUrl}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-on-surface-variant/20">
                                        <span className="material-symbols-outlined text-9xl">person</span>
                                    </div>
                                )}
                            </div>
                        </div>


                    </div>

                    {/* Content Area */}
                    <div className="col-span-12 lg:col-span-7 pt-6">
                        <div className="flex flex-col h-full">
                            <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-6">
                                <div>
                                    <div className="inline-flex items-center px-3 py-1 rounded-md bg-primary/10 border border-primary/20 mb-4">
                                        <span className="w-2 h-2 rounded-full bg-primary mr-2 animate-pulse"></span>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Location</span>
                                    </div>
                                    <h2 className="text-5xl lg:text-7xl font-headline font-bold text-on-surface tracking-tighter mb-2">{location.name}</h2>
                                </div>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => showToast.info('Edit mode coming soon', 'Location modification is being recalibrated.')}
                                        className="flex items-center px-5 py-2.5 rounded-lg glass-card border border-outline-variant/20 text-on-surface hover:border-secondary hover:text-secondary transition-all active:scale-95"
                                    >
                                        <span className="material-symbols-outlined mr-2 text-xl">edit</span>
                                        <span className="font-medium text-sm">Edit</span>
                                    </button>
                                    <button
                                        onClick={() => setIsDeleteDialogOpen(true)}
                                        disabled={isDeleting}
                                        className="flex items-center px-5 py-2.5 rounded-lg bg-error-container/20 border border-error/20 text-error hover:bg-error-container/40 transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        <span className="material-symbols-outlined mr-2 text-xl">{isDeleting ? 'sync' : 'delete_outline'}</span>
                                        <span className="font-medium text-sm">{isDeleting ? 'Removing...' : 'Remove'}</span>
                                    </button>
                                </div>
                            </div>

                            {/* Info Grid (Bento Style) */}
                            <div className="grid grid-cols-2 gap-6 mb-12">
                                {/* Narrative Profile Card */}
                                <div className="col-span-2 glass-card rounded-2xl p-8 border border-outline-variant/10 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 opacity-5">
                                        <span className="material-symbols-outlined text-9xl">psychology</span>
                                    </div>
                                    <div className="relative z-10">
                                        <h3 className="font-headline text-lg font-bold text-primary mb-6 flex items-center">
                                            <span className="material-symbols-outlined mr-2">auto_awesome</span>
                                            Visual Description
                                        </h3>
                                        <div className="space-y-6">
                                            <div>
                                                <p className="text-lg text-on-surface leading-relaxed">{location.visualDescription}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>



                                {/* Clothing Style Card */}
                                <div className="col-span-2 glass-card rounded-2xl p-8 border border-outline-variant/10">
                                    <h3 className="font-headline text-lg font-bold text-tertiary mb-6 flex items-center">
                                        <span className="material-symbols-outlined mr-2">foggy</span>
                                        Atmosphere
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm text-on-surface leading-snug">{location.atmosphere || 'No atmosphere specified.'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>



                            {/* Metadata Bar */}
                            <footer className="mt-auto pt-8 border-t border-outline-variant/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex items-center space-x-8">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] uppercase tracking-widest text-on-surface-variant/40 font-bold">Created On</span>
                                        <span className="text-xs font-medium">{formattedDate}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] uppercase tracking-widest text-on-surface-variant/40 font-bold">Generated By</span>
                                        <span className="text-xs font-medium flex items-center">
                                            <span className="material-symbols-outlined text-[14px] mr-1 text-primary">bolt</span>
                                            {location.createdBy || 'VidiMetrics AI'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 text-on-surface-variant/40">
                                    <span className="material-symbols-outlined text-sm">lock_open</span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Public Asset</span>
                                </div>
                            </footer>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAB for quick AI generation */}
            <div className="fixed bottom-10 right-10 z-50">
                <button className="bg-gradient-to-r from-primary to-primary-container p-4 rounded-full shadow-[0_10px_40px_rgba(120,24,198,0.5)] hover:scale-110 active:scale-95 transition-all group overflow-hidden relative">
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="material-symbols-outlined text-on-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_fix_high</span>
                </button>
            </div>

            {/* Confirmation Dialogs */}
            <ConfirmationDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDelete}
                title="Remove Location Archetype"
                description={`Are you sure you want to remove ${location.name} from the series archives? This action will permanently de-initialize their narrative profile and visual assets.`}
                confirmText="De-initialize"
                variant="danger"
                isLoading={isDeleting}
            />
        </div>
    )
}
