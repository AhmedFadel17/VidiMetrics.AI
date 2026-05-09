import SeriesHero from './components/SeriesHero'
import SeriesInfoTab from './components/SeriesInfoTab'
import TimelinesTab from '../../Shared/components/Tabs/TimelinesTab'
import OverviewTab from './components/OverviewTab'
import EpisodesTab from '../../Shared/components/Tabs/EpisodesTab'
import CharactersTab from '../../Shared/components/Tabs/CharactersTab'
import EnvironmentsTab from '../../Shared/components/Tabs/EnvironmentsTab'
import ScenesTab from '../../Shared/components/Tabs/ScenesTab'
import { useParams, useSearchParams } from 'react-router-dom'
import { useGetShowByIdQuery } from '@/store/apis'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import { useState } from 'react'

export default function SeriesDetails() {
    const { id } = useParams<{ id: string }>();
    const [searchParams, setSearchParams] = useSearchParams();
    const { data: response, isLoading, error } = useGetShowByIdQuery(id || '');
    const show = response?.data;

    type TabType = 'Overview' | "Info" | 'Episodes' | 'Characters' | 'Environments' | 'Timelines'
    
    const tabs: TabType[] = ['Overview', 'Info', 'Episodes', 'Characters', 'Environments', 'Timelines']
    
    // Get active tab from URL or default to 'Overview'
    const tabParam = searchParams.get('tab') as TabType
    const activeTab = tabs.includes(tabParam) ? tabParam : 'Overview'

    const setActiveTab = (tab: TabType) => {
        setSearchParams({ tab });
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                <div className="w-16 h-16 border-4 border-accent-purple/30 border-t-accent-purple rounded-full animate-spin"></div>
                <p className="text-white/40 font-label text-xs uppercase tracking-widest animate-pulse">Syncing with Neural Engine...</p>
            </div>
        );
    }

    if (error || !show) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 glass-card rounded-[3rem] border border-error/20 p-12">
                <span className="material-symbols-outlined text-6xl text-error">warning</span>
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-headline font-bold text-white tracking-tight">Signal Lost</h2>
                    <p className="text-white/40">Unable to retrieve series parameters from the core. Please verify project ID.</p>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-all uppercase text-[10px] font-black tracking-widest"
                >
                    Reconnect Uplink
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-20">
            {/* Page Header */}
            <Breadcrumbs items={[
                { label: 'Home', path: '/' },
                { label: 'Series Library', path: '/dashboard/series' },
                { label: show.title }
            ]} />



            {/* Hero Section */}
            <SeriesHero show={show} />

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
                {activeTab === 'Environments' && (
                    <EnvironmentsTab showId={show.id} />
                )}

                {activeTab === 'Timelines' && (
                    <TimelinesTab showId={show.id} />
                )}
            </div>
        </div>
    )
}
