import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { PageHeader } from '@/components/ui/PageHeader';
import React, { useState, useMemo } from 'react';

// ============================================================================
// TYPES & DATA CONTRACTS
// ============================================================================
export interface MediaAsset {
    id: string;
    title: string;
    url?: string;
    thumbnailUrl: string;
    duration: string;
    resolution: string;
    fileSize: string;
    createdAtRelative: string;
    isLinked: boolean;
    linkedLocation?: {
        seriesName: string;
        episodeNumber: number;
        sceneName?: string;
    };
    originalPrompt?: string;
    seedNumber?: string;
    modelVersion?: string;
    historyLog?: Array<{
        id: string;
        event: string;
        timestamp: string;
        type: 'success' | 'warning' | 'neutral';
    }>;
}

export type MediaFilterTab = 'all' | 'unlinked' | 'series' | 'renders';
export type MediaTypeFilter = 'all' | 'videos' | 'scenes' | 'audio';
// ============================================================================
// STABLE MOCK PLAYLOAD GENERATORS
// ============================================================================
const mockAssets: MediaAsset[] = [
    {
        id: 'as-1',
        title: 'Neon Alley Ambush_v2_remake.mp4',
        thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFS77lT4AkDo3Ln6MihpfKhViZB9mZMMJ-50d9r3VuB4CsL-dy0rGNagfRotpNph0wM3StXyN0txAbkhHf8qlFFu25xjV3GoSHm9BzoEKcj2XkDEbOwUoxEBMgTUY31ZE9wqbuVzoSTrMEk6OpEp9RN4qAcPf9uxclsAdKvveD1cgnLvuCKdS3MjTXlvjcNHhgvj72gkissUmFy3OEqVHdsOUqRY3tY3OIEgaLtoR5R_4u20h_VZuwRPNt87Eokf7rCi67VQKxw_I',
        duration: '00:14',
        resolution: '4K',
        fileSize: '120MB',
        createdAtRelative: '2h ago',
        isLinked: true,
        linkedLocation: {
            seriesName: 'Cyberpunk Arc',
            episodeNumber: 2,
            sceneName: 'Scene 12: Alley Interaction'
        },
        originalPrompt: 'A cinematic wide shot of a rainy neon-lit alleyway in a cyberpunk metropolis, 8k resolution, photorealistic, anamorphic lens flares, heavy atmospheric fog, puddles reflecting street lights, mysterious figure in the distance.',
        seedNumber: '8274950112',
        modelVersion: 'Vidi_v4.2-Cinematic',
        historyLog: [
            { id: 'h1', event: 'Asset Generated', timestamp: '2 hours ago • AI Render Engine', type: 'success' },
            { id: 'h2', event: 'Linked to "Cyberpunk Arc"', timestamp: '1 hour ago • Editor User_92', type: 'warning' },
            { id: 'h3', event: 'Metadata Updated', timestamp: '45 mins ago • System', type: 'neutral' }
        ]
    },
    {
        id: 'as-2',
        title: 'Stellar_Drift_Interlude_v1.mp4',
        thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZUTCZXYcb7SwZ8sLxzXvAtw0jdxjUqzHNJH5gfAndAlQ4aFP_mopADCtlisNKNzmYlaAmNC_2aAqwyvzGh3QUwBEP5jeTcZyrmzc_IwBJLcNetp6Q6s8lrdGI5EG0_3VOMxAIEwO5OCCB_Fu_lli-7K_Ov9_FPeMvoYFIgriWGPRh5ZkJ-b9natd_cl6KQ4pksgYtjfnrE0it2U0AsaZD87Dlf5ZuXqytb643dThOjNJpS-4u5anxyCPcBp_2Q0xG-s3B1-bajNU',
        duration: '00:08',
        resolution: '4K',
        fileSize: '85MB',
        createdAtRelative: '5h ago',
        isLinked: false,
        originalPrompt: 'A macro cinematic shot of swirling colorful nebulae in deep space, featuring intense purples, deep blues, and glowing pink dust clouds. Cosmic aesthetic.',
        seedNumber: '9102485521',
        modelVersion: 'CosmoRender_v1.0',
        historyLog: [
            { id: 'h4', event: 'Asset Generated', timestamp: '5 hours ago • SpaceWorker Engine', type: 'success' },
            { id: 'h5', event: 'Orphaned due to Generation Re-roll', timestamp: '4 hours ago • User', type: 'warning' }
        ]
    },
    {
        id: 'as-3',
        title: 'Server_Room_Sequence_Main.mp4',
        thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCC0yoBOakYhpVWhPRtDXK0ze_fdS9BGYCQHLJGBmCk208N_oeiqoYJJw4WAou3WTUMMNzW6mxJXNnj4IjssxAe0esMyhOum6Z3U3BYqbYbLFHzCq5PH5YDIHDpquH4TTW2GA-vFALTW35xvB8_aZiTn0jPbk9_Rb4PhSkkvBIS9CtPbDaJ8xyyv524rKOC5i8B555CZkiBJkE93zO3J6TDR_BNO4T72yhfEe4JeSIR6fkVHSMhb6_HSdURD726qWTLuBLKc9JPlcc',
        duration: '00:22',
        resolution: '4K',
        fileSize: '245MB',
        createdAtRelative: '12h ago',
        isLinked: true,
        linkedLocation: {
            seriesName: 'Data Heist',
            episodeNumber: 4
        },
        originalPrompt: 'A retro-futuristic data center with glowing racks of servers emitting soft purple and blue light. Reflection pattern layers.',
        seedNumber: '4452109852',
        modelVersion: 'Vidi_v4.2-Cinematic',
        historyLog: [
            { id: 'h6', event: 'Asset Generated', timestamp: '12 hours ago', type: 'success' },
            { id: 'h7', event: 'Linked to Data Heist', timestamp: '11 hours ago', type: 'success' }
        ]
    }
];
// ============================================================================
// REACT COMPONENT DEFINITION
// ============================================================================
export default function MediaLibrary() {
    // --- State Architecture ---
    const [activeTab, setActiveTab] = useState<MediaFilterTab>('all');
    const [mediaType, setMediaType] = useState<MediaTypeFilter>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(mockAssets[0]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [assetToLink, setAssetToLink] = useState<MediaAsset | null>(null);

    // --- Quick Link Form State ---
    const [selectedSeries, setSelectedSeries] = useState<string>('Cyberpunk Arc');
    const [selectedEpisode, setSelectedEpisode] = useState<number>(2);
    const [selectedScene, setSelectedScene] = useState<string>('Scene 12: Alley Interaction');

    // --- Computed / Filtered Assets Engine ---
    const filteredAssets = useMemo(() => {
        return mockAssets.filter((asset) => {
            // 1. Filter by Tab Selector
            if (activeTab === 'unlinked' && asset.isLinked) return false;
            if (activeTab === 'series' && !asset.isLinked) return false;
            // ('renders' falls back to all generated material for this view state context)

            // 2. Filter by Extension Drops
            if (mediaType === 'videos' && !asset.title.endsWith('.mp4')) return false;
            if (mediaType === 'audio' && !asset.title.endsWith('.mp3')) return false;

            // 3. Filter by Character/String Search Match
            if (searchQuery.trim() !== '') {
                const matchesTitle = asset.title.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesPrompt = asset.originalPrompt?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false;
                return matchesTitle || matchesPrompt;
            }

            return true;
        });
    }, [activeTab, mediaType, searchQuery]);

    // --- Handlers ---
    const handleOpenLinkModal = (e: React.MouseEvent, asset: MediaAsset) => {
        e.stopPropagation();
        setAssetToLink(asset);
        setIsModalOpen(true);
    };

    const handleConfirmLink = () => {
        if (!assetToLink) return;

        // In production, execute backend dispatch here: POST /api/media/link
        // API Payload: { assetId: assetToLink.id, series: selectedSeries, episode: selectedEpisode, scene: selectedScene }

        assetToLink.isLinked = true;
        assetToLink.linkedLocation = {
            seriesName: selectedSeries,
            episodeNumber: selectedEpisode,
            sceneName: selectedScene
        };

        setIsModalOpen(false);
        setAssetToLink(null);
    };

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <Breadcrumbs items={[
                { label: 'Home', path: '/dashboard' },
                { label: 'Media Library' },
            ]} />

            {/* ── Page Header ── */}
            <div className="pt-2 pb-5 flex flex-col md:flex-row md:items-end justify-between gap-6 shrink-0">
                <PageHeader
                    chipText="Media Library"
                    titlePrefix="Media "
                    gradientText="Assets"
                    description="Manage, download, or link your AI video generations, B-rolls, and scenes."
                />
                <div>
                    <div className='flex items-center gap-3 flex-wrap mb-3'>

                        {/* ── Tab Navigation ── */}
                        <div>
                            <div className="flex items-center gap-2 p-1 bg-surface-container-low rounded-xl">
                                <button
                                    onClick={() => setActiveTab('all')}
                                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${activeTab === 'all' ? 'bg-surface-container-highest text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
                                >
                                    All Media
                                </button>
                                <button
                                    onClick={() => setActiveTab('unlinked')}
                                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'unlinked' ? 'bg-surface-container-highest text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
                                >
                                    Unlinked
                                    <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]"></span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('series')}
                                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${activeTab === 'series' ? 'bg-surface-container-highest text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
                                >
                                    By Series
                                </button>
                                <button
                                    onClick={() => setActiveTab('renders')}
                                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${activeTab === 'renders' ? 'bg-surface-container-highest text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
                                >
                                    Renders
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <select
                                value={mediaType}
                                onChange={(e) => setMediaType(e.target.value as MediaTypeFilter)}
                                className="bg-surface-container-low border-none rounded-xl text-sm py-3 px-4 focus:ring-0 text-on-surface cursor-pointer focus:outline-none"
                            >
                                <option value="all">All Types</option>
                                <option value="videos">Complete Videos</option>
                                <option value="scenes">Scene Clips</option>
                                <option value="audio">Audio Tracks</option>
                            </select>

                        </div>

                    </div>
                    <div className="flex items-center justify-between gap-6">


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
                        {/* ── Upload Button ── */}
                        <div>
                            <button className="bg-surface-container-high text-on-surface font-semibold px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-surface-variant transition-colors border border-outline-variant/20">
                                <span className="material-symbols-outlined">upload_file</span>
                                Upload Custom Media
                            </button>
                        </div>

                    </div>
                </div>
            </div>


            {/* ========================================== */}
            {/* 2. FLEXIBLE WORKSPACE (GRID + SIDE PANEL)   */}
            {/* ========================================== */}
            <div className="flex-1 flex overflow-hidden">

                {/* Dynamic Asset Grid Area */}
                <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
                    <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-8">
                        {filteredAssets.map(asset => (
                            <div
                                key={asset.id}
                                onClick={() => setSelectedAsset(asset)}
                                className={`group relative flex flex-col bg-surface-container-low rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer border ${selectedAsset?.id === asset.id ? 'border-primary/50' : 'border-transparent'} hover:shadow-primary/5`}
                            >
                                <div className="aspect-video relative overflow-hidden">
                                    <img
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        src={asset.thumbnailUrl}
                                        alt={asset.title}
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white transform scale-90 group-hover:scale-100 transition-transform">
                                            <span className="material-symbols-outlined scale-150">play_arrow

                                            </span>

                                        </div>
                                    </div>

                                    <span className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md text-[10px] font-bold px-2 py-1 rounded text-white">{asset.duration}</span>

                                    <div className="absolute top-3 left-3 flex gap-2">
                                        {asset.isLinked ? (
                                            <span className="bg-green-500/10 backdrop-blur-md border border-green-500/20 text-green-400 text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
                                                <span className="material-symbols-outlined text-xs">link</span>
                                                Linked: {asset.linkedLocation?.seriesName} &gt; Ep. {asset.linkedLocation?.episodeNumber}
                                            </span>
                                        ) : (
                                            <span className="bg-amber-500/10 backdrop-blur-md border border-amber-500/20 text-amber-400 text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
                                                <span className="material-symbols-outlined text-xs">warning</span>
                                                ⚠️ Unlinked / Floating Asset
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="p-5 flex flex-col gap-1">
                                    <h3 className="font-semibold text-on-surface truncate">{asset.title}</h3>
                                    <div className="flex items-center gap-3 text-on-surface-variant text-xs font-medium">
                                        <span>{asset.resolution}</span>
                                        <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
                                        <span>{asset.fileSize}</span>
                                        <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
                                        <span>{asset.createdAtRelative}</span>
                                    </div>

                                    {/* Card Action Footers */}
                                    <div className="mt-6 flex items-center gap-2">
                                        {asset.isLinked ? (
                                            <button
                                                onClick={(e) => handleOpenLinkModal(e, asset)}
                                                className="flex-1 bg-surface-container-highest/60 hover:bg-primary/20 hover:text-primary py-2.5 rounded-lg text-xs font-bold transition-all border border-outline-variant/10 text-on-surface"
                                            >
                                                🔗 Change Link
                                            </button>
                                        ) : (
                                            <button
                                                onClick={(e) => handleOpenLinkModal(e, asset)}
                                                className="flex-1 bg-primary/10 text-primary hover:bg-primary/20 py-2.5 rounded-lg text-xs font-bold transition-all border border-primary/20"
                                            >
                                                🔗 Link to Episode/Scene
                                            </button>
                                        )}
                                        <button className="p-2.5 bg-surface-container-highest/60 hover:bg-surface-variant rounded-lg transition-all border border-outline-variant/10 text-on-surface-variant hover:text-on-surface">
                                            <span className="material-symbols-outlined text-sm">download</span>
                                        </button>
                                        <button className="p-2.5 bg-surface-container-highest/60 hover:bg-error/10 hover:text-error rounded-lg transition-all border border-outline-variant/10 text-on-surface-variant">
                                            <span className="material-symbols-outlined text-sm">delete</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                        ))}

                        {/* Grayed Placeholder Card for Density */}
                        <div className="group relative flex flex-col bg-surface-container-low rounded-xl overflow-hidden hover:shadow-2xl transition-all opacity-60 grayscale hover:grayscale-0 hover:opacity-100">
                            <div className="aspect-video relative overflow-hidden bg-surface-container-highest flex items-center justify-center">
                                <span className="material-symbols-outlined text-4xl text-on-surface-variant/20">movie</span>
                            </div>
                            <div className="p-5">
                                <div className="h-4 bg-surface-container-high rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-surface-container-high rounded w-1/2"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ========================================== */}
                {/* 3. RIGHT SIDEBAR DETAILS EXPLORER          */}
                {/* ========================================== */}
                {selectedAsset && (
                    <aside className="w-96 bg-surface-container-low border-l border-outline-variant/10 flex flex-col">
                        <div className="p-6 border-b border-outline-variant/10 flex items-center justify-between">
                            <h4 className="font-display font-bold text-on-surface">Media Details</h4>
                            <button
                                onClick={() => setSelectedAsset(null)}
                                className="text-on-surface-variant hover:text-on-surface transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto no-scrollbar">
                            <div className="p-6 space-y-8">
                                {/* Expanded Player Frame */}
                                <div className="aspect-video w-full rounded-xl overflow-hidden bg-black relative group cursor-pointer">
                                    <img className="w-full h-full object-cover opacity-60" src={selectedAsset.thumbnailUrl} alt="Preview Expanded" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-5xl text-white opacity-80">play_circle</span>
                                    </div>
                                </div>

                                {/* Prompt Metadata Card */}
                                {selectedAsset.originalPrompt && (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                                            <span className="material-symbols-outlined text-sm">auto_awesome</span>
                                            Original AI Prompt
                                        </div>
                                        <div className="p-4 bg-surface-container-highest/40 rounded-xl text-sm leading-relaxed text-on-surface-variant italic">
                                            "{selectedAsset.originalPrompt}"
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-3 bg-surface-container/50 rounded-lg">
                                                <p className="text-[10px] text-on-surface-variant/60 uppercase font-bold mb-1">Seed Number</p>
                                                <p className="text-sm font-mono text-secondary truncate">{selectedAsset.seedNumber ?? 'N/A'}</p>
                                            </div>
                                            <div className="p-3 bg-surface-container/50 rounded-lg">
                                                <p className="text-[10px] text-on-surface-variant/60 uppercase font-bold mb-1">Model Version</p>
                                                <p className="text-sm font-mono text-tertiary truncate">{selectedAsset.modelVersion ?? 'Standard_Render'}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Operational History Log Pipeline */}
                                {selectedAsset.historyLog && (
                                    <div className="space-y-4">
                                        <h5 className="text-xs font-bold text-on-surface-variant/80 uppercase tracking-widest">History Log</h5>
                                        <div className="space-y-4 relative">
                                            <div className="absolute left-3 top-2 bottom-2 w-[1px] bg-gradient-to-b from-primary via-secondary to-transparent"></div>

                                            {selectedAsset.historyLog.map((log) => (
                                                <div key={log.id} className="flex gap-4 relative pl-8">
                                                    <div className={`absolute left-[9px] top-1.5 w-1.5 h-1.5 rounded-full ${log.type === 'success' ? 'bg-primary shadow-[0_0_8px_rgba(221,183,255,0.8)]' :
                                                        log.type === 'warning' ? 'bg-secondary shadow-[0_0_8px_rgba(76,215,246,0.8)]' : 'bg-on-surface-variant/30'
                                                        }`} />
                                                    <div className="flex-1">
                                                        <p className={`text-xs font-bold ${log.type === 'neutral' ? 'text-on-surface-variant' : 'text-on-surface'}`}>{log.event}</p>
                                                        <p className="text-[10px] text-on-surface-variant">{log.timestamp}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-6 bg-surface-container-high/50">
                            <button className="w-full bg-primary text-on-primary py-3 rounded-lg font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/10">
                                <span className="material-symbols-outlined text-sm">open_in_new</span>
                                Open in Storyboarder
                            </button>
                        </div>
                    </aside>
                )
                }
            </div >

            {/* ========================================== */}
            {/* 4. MODAL POPUP DIALOG: QUICK LINK SYSTEM   */}
            {/* ========================================== */}
            {
                isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-surface-container-lowest/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
                        <div className="relative w-full max-w-md bg-surface-container-high rounded-xl overflow-hidden shadow-2xl border border-outline-variant/20 animate-in fade-in zoom-in duration-300">
                            <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center">
                                <h3 className="font-display font-bold text-xl text-primary">Quick Link Asset</h3>
                                <button className="text-on-surface-variant hover:text-on-surface" onClick={() => setIsModalOpen(false)}>
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Select Series</label>
                                    <select
                                        value={selectedSeries}
                                        onChange={(e) => setSelectedSeries(e.target.value)}
                                        className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg py-3 px-4 text-sm focus:ring-1 focus:ring-primary text-on-surface bg-transparent focus:outline-none"
                                    >
                                        <option className="bg-surface-container-high">Cyberpunk Arc</option>
                                        <option className="bg-surface-container-high">Data Heist</option>
                                        <option className="bg-surface-container-high">Neon Nights</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Episode</label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {[1, 2, 3, 4].map((epNum) => (
                                            <button
                                                key={epNum}
                                                type="button"
                                                onClick={() => setSelectedEpisode(epNum)}
                                                className={`py-2 rounded-lg text-sm font-bold border transition-all ${selectedEpisode === epNum
                                                    ? 'bg-primary-container/40 text-primary border-primary/40'
                                                    : 'bg-surface-container-highest text-on-surface hover:bg-primary/20 hover:text-primary border-outline-variant/10'
                                                    }`}
                                            >
                                                Ep {epNum}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Target Scene</label>
                                    <select
                                        value={selectedScene}
                                        onChange={(e) => setSelectedScene(e.target.value)}
                                        className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg py-3 px-4 text-sm focus:ring-1 focus:ring-primary text-on-surface bg-transparent focus:outline-none"
                                    >
                                        <option className="bg-surface-container-high">Scene 12: Alley Interaction</option>
                                        <option className="bg-surface-container-high">Scene 13: The Escape</option>
                                        <option className="bg-surface-container-high">Scene 14: Aftermath</option>
                                    </select>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleConfirmLink}
                                    className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary py-4 rounded-xl font-bold flex items-center justify-center gap-2 mt-4 active:scale-[0.98] transition-all"
                                >
                                    Confirm Link Attachment
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

