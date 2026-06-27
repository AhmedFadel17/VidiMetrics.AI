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
            <div className="py-5 flex justify-between gap-6">
                <PageHeader
                    chipText="Media Library"
                    titlePrefix="Media "
                    gradientText="Assets"
                    description="Manage, download, or link your AI generations, B-rolls, and scenes."
                />
                <div>
                    <div className='flex items-center gap-3 flex-wrap mb-3'>
                        {/* ── Tab Navigation ── */}
                        <div>
                            <div className="flex items-center gap-2 p-1 bg-surface-container-low rounded-2xl">
                                <button
                                    onClick={() => setActiveTab('videos')}
                                    className={`px-10 py-2 rounded-2xl text-md font-medium transition-all ${activeTab === 'videos' ? 'bg-primary-container shadow-lg' : 'text-on-surface-variant hover:text-on-surface'}`}
                                >
                                    Videos
                                </button>
                                <button
                                    onClick={() => setActiveTab('images')}
                                    className={`px-10 py-2 rounded-2xl text-md font-medium transition-all flex items-center gap-2 ${activeTab === 'images' ? 'bg-primary-container shadow-lg' : 'text-on-surface-variant hover:text-on-surface'}`}
                                >
                                    Images
                                </button>
                                <button
                                    onClick={() => setActiveTab('scripts')}
                                    className={`px-10 py-2 rounded-2xl text-md font-medium transition-all ${activeTab === 'scripts' ? 'bg-primary-container shadow-lg' : 'text-on-surface-variant hover:text-on-surface'}`}
                                >
                                    Scripts
                                </button>

                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <div className="">
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

