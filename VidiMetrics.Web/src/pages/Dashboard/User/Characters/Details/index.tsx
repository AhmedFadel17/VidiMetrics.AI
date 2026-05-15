import { useState } from 'react'
import CharacterHero from './components/CharacterHero'
import CharacterInfoTab from './components/CharacterInfoTab'
import OverviewTab from './components/OverviewTab'
import ScenesTab from '../../Shared/components/Tabs/ScenesTab'
import { useGetCharacterByIdQuery, useGetShowByIdQuery } from '@/store/apis'
import { useParams } from 'react-router-dom'
import Breadcrumbs from '@/components/ui/Breadcrumbs'

export default function CharacterDetails() {
    type TabType = 'Overview' | "Info" | 'Scenes'
    const [activeTab, setActiveTab] = useState<TabType>('Overview')

    const tabs: TabType[] = ['Overview', 'Info', 'Scenes']
    const { showId, id: characterId } = useParams<{ showId: string, id: string }>();
    const { data: showResponse, isLoading: isShowLoading } = useGetShowByIdQuery(showId || '');
    const { data: characterResponse, isLoading: isCharacterLoading } = useGetCharacterByIdQuery(characterId || '');

    const show = showResponse?.data;
    const character = characterResponse?.data;

    if (isShowLoading || isCharacterLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                <div className="w-16 h-16 border-4 border-accent-cyan/30 border-t-accent-cyan rounded-full animate-spin"></div>
                <p className="text-white/40 font-label text-xs uppercase tracking-widest animate-pulse">Accessing Neural Archives...</p>
            </div>
        );
    }

    if (!show || !character) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 glass-card rounded-[3rem] border border-error/20 p-12">
                <span className="material-symbols-outlined text-6xl text-error">warning</span>
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-headline font-bold text-white tracking-tight">Signal Interrupted</h2>
                    <p className="text-white/40">Unable to establish connection with character parameters. Please verify the uplink.</p>
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
                { label: 'Characters', path: `/dashboard/series/${show.id}?tab=Characters` },
                { label: character.name },
            ]} />

            {/* Hero Section */}
            <CharacterHero show={show} character={character} />

            {/* Content Tabs */}
            <div className="flex items-center gap-10 border-b border-white/5 pb-4">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`text-[10px] font-black uppercase tracking-[0.2em] pb-4 transition-all duration-300 ${activeTab === tab
                            ? 'text-accent-purple border-b-2 border-accent-purple mb-[6px]'
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
                    <OverviewTab />
                )}
                {activeTab === 'Info' && (
                    <CharacterInfoTab />
                )}
                {activeTab === 'Scenes' && (
                    <ScenesTab />
                )}
            </div>
        </div>
    )
}
