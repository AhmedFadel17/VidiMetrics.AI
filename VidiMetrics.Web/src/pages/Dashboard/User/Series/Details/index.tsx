import SeriesHero from './components/SeriesHero'
import SeriesInfoTab from './components/SeriesInfoTab'
import TimelinesTab from '../../Shared/components/Tabs/TimelinesTab'
import { useState } from 'react'
import OverviewTab from './components/OverviewTab'
import EpisodesTab from '../../Shared/components/Tabs/EpisodesTab'
import CharactersTab from '../../Shared/components/Tabs/CharactersTab'
import EnvironmentsTab from '../../Shared/components/Tabs/EnvironmentsTab'
import ScenesTab from '../../Shared/components/Tabs/ScenesTab'

export default function SeriesDetails() {
    type TabType = 'Overview' | "Info" | 'Episodes' | 'Characters' | 'Environments' | 'Scenes' | 'Timelines'
    const [activeTab, setActiveTab] = useState<TabType>('Overview')

    const tabs: TabType[] = ['Overview', 'Info', 'Episodes', 'Characters', 'Environments', 'Scenes', 'Timelines']

    return (
        <div className="space-y-10 pb-20">
            {/* Top Navigation / Breadcrumbs */}
            <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 rounded-3xl px-8 py-4">
                <div className="flex items-center gap-8">
                    <button className="text-sm font-bold text-accent-cyan border-b-2 border-accent-cyan pb-1">Workspace</button>
                    <button className="text-sm font-bold text-white/40 hover:text-white transition-colors pb-1">History</button>
                    <button className="text-sm font-bold text-white/40 hover:text-white transition-colors pb-1">Exports</button>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-4">
                        <button className="glass-card w-10 h-10 rounded-xl flex items-center justify-center border border-white/5">
                            <span className="material-symbols-outlined text-white/60 text-lg">notifications</span>
                        </button>
                        <button className="glass-card w-10 h-10 rounded-xl flex items-center justify-center border border-white/5">
                            <span className="material-symbols-outlined text-white/60 text-lg">auto_awesome</span>
                        </button>
                    </div>
                    <button className="btn-premium px-6 py-2.5 rounded-xl text-xs uppercase tracking-widest flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">add</span>
                        New Production
                    </button>
                </div>
            </div>

            {/* Hero Section */}
            <SeriesHero />

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
                    <OverviewTab />
                )}

                {activeTab === 'Info' && (
                    <SeriesInfoTab />
                )}

                {activeTab === 'Episodes' && (
                    <EpisodesTab />
                )}

                {activeTab === 'Characters' && (
                    <CharactersTab />
                )}
                {activeTab === 'Environments' && (
                    <EnvironmentsTab />
                )}
                {activeTab === 'Scenes' && (
                    <ScenesTab />
                )}
                {activeTab === 'Timelines' && (
                    <TimelinesTab />
                )}
            </div>
        </div>
    )
}
