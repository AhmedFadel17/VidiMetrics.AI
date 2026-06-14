import SeriesHero from './components/SeriesHero'
import SeriesInfoTab from './components/SeriesInfoTab'
import TimelinesTab from '../../Shared/components/Tabs/TimelinesTab'
import OverviewTab from './components/OverviewTab'
import EpisodesTab from '../../Shared/components/Tabs/EpisodesTab'
import CharactersTab from '../../Shared/components/Tabs/CharactersTab'
import LocationsTab from '../../Shared/components/Tabs/LocationsTab'
import { useParams, useSearchParams } from 'react-router-dom'
import { useDeleteShowMutation, useGetShowByIdQuery } from '@/store/apis'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import { useState } from 'react'
import ConfirmationDialog from '@/components/ui/Feedback/ConfirmationDialog'
import { useNavigate } from 'react-router-dom'
import { showToast } from '@/utils/toast'
import { ErrorScreen, LoadingScreen } from '@/components/ui/Feedback/StatusScreens'

export default function SeriesDetails() {
    const navigate = useNavigate()
    const { id } = useParams<{ id: string }>();
    const [searchParams, setSearchParams] = useSearchParams();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deleteShow, { isLoading: isDeleting }] = useDeleteShowMutation();
    const { data: response, isLoading, error } = useGetShowByIdQuery(id || '');
    const show = response?.data;

    type TabType = 'Overview' | "Info" | 'Episodes' | 'Characters' | 'Locations' | 'Timelines'

    const tabs: TabType[] = ['Overview', 'Info', 'Episodes', 'Characters', 'Locations', 'Timelines']

    const tabParam = searchParams.get('tab') as TabType
    const activeTab = tabs.includes(tabParam) ? tabParam : 'Overview'

    const setActiveTab = (tab: TabType) => {
        setSearchParams({ tab });
    }

    const handleDelete = async () => {
        if (!id) {
            showToast.error('Series Not Found', 'Series not found');
            return;
        }
        try {
            await deleteShow(id).unwrap();
            showToast.success('Series Removed', `${show?.title} has been removed from the active series archives.`);
            navigate(`/dashboard/series`);
        } catch (error: any) {
            showToast.error('Removal Failed', error.data?.message || 'A system error occurred while trying to remove the series.');
        } finally {
            setIsDeleteDialogOpen(false);
        }
    };

    if (isLoading) return <LoadingScreen message="Accessing Series Archives..." accentColor="purple" />
    if (error || !show) return <ErrorScreen title="Series Not Found" message="Series not found" />

    return (
        <div className="space-y-10 pb-20">
            {/* Page Header */}
            <Breadcrumbs items={[
                { label: 'Home', path: '/' },
                { label: 'Series Library', path: '/dashboard/series' },
                { label: show.title }
            ]} />



            {/* Hero Section */}
            <SeriesHero show={show} onDelete={() => setIsDeleteDialogOpen(true)} />

            {/* Content Tabs */}
            <div className="flex items-center gap-10 border-b border-white/5 pb-4">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`text-[10px] font-black uppercase tracking-[0.2em] pb-4 transition-all duration-300 ${activeTab === tab
                            ? 'text-accent-cyan border-b-2 border-accent-cyan mb-[6px]'
                            : 'text-white/40 hover:text-white'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Main Components Grid */}
            <div className="mt-8">

                {activeTab === 'Overview' && (
                    <OverviewTab show={show} />
                )}

                {activeTab === 'Info' && (
                    <SeriesInfoTab show={show} />
                )}

                {activeTab === 'Episodes' && (
                    <EpisodesTab showId={show.id} />
                )}

                {activeTab === 'Characters' && (
                    <CharactersTab showId={show.id} />
                )}
                {activeTab === 'Locations' && (
                    <LocationsTab showId={show.id} />
                )}

                {activeTab === 'Timelines' && (
                    <TimelinesTab showId={show.id} />
                )}
            </div>

            <ConfirmationDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDelete}
                title="Remove Series"
                description={`Are you sure you want to remove ${show.title} from the series archives? This action will permanently de-initialize their narrative profile and visual assets.`}
                confirmText="Delete"
                variant="danger"
                isLoading={isDeleting}
            />
        </div>
    )
}
