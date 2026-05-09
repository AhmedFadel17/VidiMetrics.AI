import { useState } from 'react'
import EpisodeHero from './components/EpisodeHero'
import EpisodeInfoTab from './components/EpisodeInfoTab'
import OverviewTab from './components/OverviewTab'
import CharactersTab from '../../Shared/components/Tabs/CharactersTab'
import EnvironmentsTab from '../../Shared/components/Tabs/EnvironmentsTab'
import ScenesTab from '../../Shared/components/Tabs/ScenesTab'
import Breadcrumbs from '@/components/ui/Breadcrumbs'

import { useParams } from 'react-router-dom'
import { useGetShowByIdQuery, useGetEpisodeByIdQuery } from '@/store/apis'

export default function EpisodeDetails() {
    const { showId, id } = useParams<{ showId: string, id: string }>();
    const { data: showResponse, isLoading: isShowLoading } = useGetShowByIdQuery(showId || '');
    const { data: episodeResponse, isLoading: isEpisodeLoading } = useGetEpisodeByIdQuery(id || '');

    const show = showResponse?.data;
    const episode = episodeResponse?.data;

    type TabType = 'Overview' | "Info" | 'Scenes'
    const [activeTab, setActiveTab] = useState<TabType>('Overview')

    const tabs: TabType[] = ['Overview', 'Info', 'Scenes']

    if (isShowLoading || isEpisodeLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                <div className="w-16 h-16 border-4 border-accent-cyan/30 border-t-accent-cyan rounded-full animate-spin"></div>
                <p className="text-white/40 font-label text-xs uppercase tracking-widest animate-pulse">Accessing Neural Archives...</p>
            </div>
        );
    }

    if (!show || !episode) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 glass-card rounded-[3rem] border border-error/20 p-12">
                <span className="material-symbols-outlined text-6xl text-error">warning</span>
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-headline font-bold text-white tracking-tight">Signal Interrupted</h2>
                    <p className="text-white/40">Unable to establish connection with episode parameters. Please verify the uplink.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-20">
            {/* Top Navigation / Breadcrumbs */}
            <Breadcrumbs items={[
                { label: 'Home', path: '/' },
                { label: 'Series Library', path: '/dashboard/series' },
                { label: show.title, path: `/dashboard/series/${show.id}` },
                { label: 'Episodes', path: `/dashboard/series/${show.id}/episodes` },
                { label: `E${episode.episodeNumber}. ${episode.title}` },
            ]} />

            {/* Hero Section */}
            <EpisodeHero show={show} episode={episode} />

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
                    <OverviewTab episode={episode} />
                )}
                {activeTab === 'Info' && (
                    <EpisodeInfoTab episode={episode} />
                )}
                {activeTab === 'Scenes' && (
                    <ScenesTab episodeId={episode.id} />
                )}
            </div>
        </div>
    )
}
