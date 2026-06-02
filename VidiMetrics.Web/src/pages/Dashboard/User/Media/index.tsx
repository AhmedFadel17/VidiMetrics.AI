import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { PageHeader } from '@/components/ui/PageHeader';
import { useState } from 'react';
import ImagesGrid from './components/ImagesGrid';
import VideosGrid from './components/VideosGrid';
import ScriptsGrid from './components/ScriptsGrid';


export type MediaTypeTab = 'videos' | 'images' | 'scripts';


export default function MediaLibrary() {
    const [activeTab, setActiveTab] = useState<MediaTypeTab>('videos');

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
                            <div className="flex items-center gap-2 p-1 bg-surface-container-low rounded-full">
                                <button
                                    onClick={() => setActiveTab('videos')}
                                    className={`px-10 py-2 rounded-full text-md font-medium transition-all ${activeTab === 'videos' ? 'bg-primary-container shadow-lg' : 'text-on-surface-variant hover:text-on-surface'}`}
                                >
                                    Videos
                                </button>
                                <button
                                    onClick={() => setActiveTab('images')}
                                    className={`px-10 py-2 rounded-full text-md font-medium transition-all flex items-center gap-2 ${activeTab === 'images' ? 'bg-primary-container shadow-lg' : 'text-on-surface-variant hover:text-on-surface'}`}
                                >
                                    Images
                                </button>
                                <button
                                    onClick={() => setActiveTab('scripts')}
                                    className={`px-10 py-2 rounded-full text-md font-medium transition-all ${activeTab === 'scripts' ? 'bg-primary-container shadow-lg' : 'text-on-surface-variant hover:text-on-surface'}`}
                                >
                                    Scripts
                                </button>

                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {activeTab === 'videos' && (
                    <VideosGrid />
                )}
                {activeTab === 'images' && (
                    <ImagesGrid />
                )}
                {activeTab === 'scripts' && (
                    <ScriptsGrid />
                )}


            </div >


        </div >
    );
};

