import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useGetShowByIdQuery, useGetEpisodeByIdQuery, useGetScenesQuery, useStitchEpisodeVideoMutation, useReorderScenesMutation } from '@/store/apis'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import { toast } from 'sonner'
import { ErrorScreen, LoadingScreen } from '@/components/ui/Feedback/StatusScreens'
import { PageHeader } from '@/components/ui/PageHeader'
import VideoPlayer from '@/components/ui/VideoPlayer'
import SceneCard from '@/components/ui/Cards/SceneCard'
import VideoMetadataBox from './components/VideoMetadataBox'
import { Button } from '@/components/ui/Button'

export default function EpisodeDetails() {
    const { showId, id } = useParams<{ showId: string, id: string }>();
    const navigate = useNavigate();

    // Queries & Mutations
    const { data: showResponse, isLoading: isShowLoading } = useGetShowByIdQuery(showId || '');
    const { data: episodeResponse, isLoading: isEpisodeLoading } = useGetEpisodeByIdQuery(id || '');
    const [stitchEpisodeVideo, { isLoading: isGeneratingVideo }] = useStitchEpisodeVideoMutation();
    const [reorderScenes, { isLoading: isSavingOrder }] = useReorderScenesMutation();
    const { data: scenesResponse, isLoading: isScenesLoading } = useGetScenesQuery({
        episodeId: id || '',
        pageNumber: 1,
        pageSize: 20,
        orderBy: 'Order'

    });

    const show = showResponse?.data;
    const episode = episodeResponse?.data;
    const scenes = scenesResponse?.data?.items || [];

    // Synthesis Process States
    const [isSynthesizing, setIsSynthesizing] = useState(false);
    const [synthesisProgress, setSynthesisProgress] = useState(0);
    const [synthesisStatus, setSynthesisStatus] = useState('');

    // Creation Workspace Modes & Scene Timeline Ordering
    const [orderedScenes, setOrderedScenes] = useState<any[]>([]);

    useEffect(() => {
        if (scenes && scenes.length > 0) {
            const sorted = [...scenes].sort((a, b) => a.order - b.order);
            setOrderedScenes(sorted);
        }
    }, [scenes]);

    const moveSceneUp = (index: number) => {
        if (index === 0) return;
        const newScenes = [...orderedScenes];
        const temp = newScenes[index];
        newScenes[index] = newScenes[index - 1];
        newScenes[index - 1] = temp;
        setOrderedScenes(newScenes);
    };

    const moveSceneDown = (index: number) => {
        if (index === orderedScenes.length - 1) return;
        const newScenes = [...orderedScenes];
        const temp = newScenes[index];
        newScenes[index] = newScenes[index + 1];
        newScenes[index + 1] = temp;
        setOrderedScenes(newScenes);
    };

    const isOrderChanged = JSON.stringify(orderedScenes.map(s => s.id)) !== JSON.stringify(scenes.map(s => s.id));

    const handleSaveOrder = async () => {
        try {
            await reorderScenes({
                episodeId: id || '',
                sceneIds: orderedScenes.map(s => s.id),
            }).unwrap();
            toast.success('Sequence order saved successfully.');
        } catch (error) {
            toast.error('Failed to save sequence order.');
        }
    };

    const handleResetScenes = () => {
        setOrderedScenes(scenes);
    };




    // Synthesize Video workflow simulation
    const handleSynthesize = async () => {
        if (!episode) return;
        setIsSynthesizing(true);
        setSynthesisProgress(0);
        setSynthesisStatus('Initializing neural video canvas...');



        let currentPercent = 0;
        const interval = setInterval(() => {
            currentPercent += Math.floor(Math.random() * 5) + 3;
            if (currentPercent > 95) {
                currentPercent = 95;
            }
            setSynthesisProgress(currentPercent);
            setSynthesisStatus('Rendering final video frames...');
        }, 400);

        try {
            await stitchEpisodeVideo(episode.id).unwrap();
            clearInterval(interval);
            setSynthesisProgress(100);
            setSynthesisStatus('Synthesis complete!');
            toast.success('Episode video synthesized successfully!');
        } catch (err: any) {
            clearInterval(interval);
            toast.error(err?.data?.message || 'Failed to synthesize episode video.');
            console.error('Video generation error:', err);
        } finally {
            setIsSynthesizing(false);
        }
    };
    if (isShowLoading || isEpisodeLoading) return <LoadingScreen message="Accessing Episode Archives..." accentColor="purple" />
    if (!show || !episode) return <ErrorScreen title="Series Connection Lost" message="Unable to retrieve episode details for episode placement." />

    const episodeVideo = episode?.aiVideo;
    const videoSource = episodeVideo?.videoUrl || null;

    return (
        <div className="space-y-10 pb-20 antialiased text-[#dae2fd]">
            {/* Breadcrumbs (Preserved untouched) */}
            <Breadcrumbs items={[
                { label: 'Home', path: '/' },
                { label: 'Series Library', path: '/dashboard/series' },
                { label: show.title, path: `/dashboard/series/${show.id}` },
                { label: 'Episodes', path: `/dashboard/series/${show.id}?tab=Episodes` },
                { label: `E${episode.episodeNumber}. ${episode.title}` },
            ]} />

            <div>
                <PageHeader
                    chipText={`Series • ${show.title}`}
                    titlePrefix={`Episode ${episode.episodeNumber.toString().padStart(2, '0')} • `}
                    gradientText={`${episode.title}`}
                    description="Full episode synthesis and reference video controls"
                />
            </div>



            {/* Main Content Area: Two Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column (Wide) */}
                <div className="lg:col-span-8 flex flex-col gap-8">
                    {/* Video Player Container / Creative Suite */}
                    <div className="relative w-full aspect-video bg-[#131b2e] rounded-xl overflow-hidden group shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-[#494456]/15 flex items-center justify-center">
                        {videoSource ? (
                            /* Fully-featured Interactive Custom Video Player */
                            <VideoPlayer videoSource={videoSource} />

                        ) : (
                            /* Creative Custom Suite to Synthesize Video from Scenes */
                            <div className="absolute inset-0 bg-surface-container-low/80 backdrop-blur-md border border-[#494456]/15 p-8 flex flex-col justify-between overflow-y-auto">
                                {isSynthesizing ? (
                                    /* Active Synthesis Progress Overlay */
                                    <div className="flex-1 flex flex-col items-center justify-center space-y-8 p-12">
                                        <div className="relative w-28 h-28 flex items-center justify-center">
                                            {/* Outer spinner ring */}
                                            <div className="absolute inset-0 border-4 border-[#ddb7ff]/10 border-t-[#ddb7ff] border-r-[#4cd7f6] rounded-full animate-spin"></div>
                                            {/* Inner glowing pulse */}
                                            <div className="w-16 h-16 bg-gradient-to-r from-[#ddb7ff]/20 to-[#4cd7f6]/20 rounded-full animate-pulse flex items-center justify-center border border-[#ddb7ff]/20">
                                                <span className="material-symbols-outlined text-[#ddb7ff] text-2xl animate-bounce">auto_awesome</span>
                                            </div>
                                        </div>
                                        <div className="text-center space-y-3 max-w-md">
                                            <h3 className="font-headline text-lg font-bold text-white tracking-wide">
                                                Synthesizing Episode Video
                                            </h3>
                                            {/* Animated Progress Bar */}
                                            <div className="w-full h-1.5 bg-[#2d3449] rounded-full overflow-hidden border border-[#494456]/20 relative">
                                                <div
                                                    className="h-full bg-gradient-to-r from-[#ddb7ff] to-[#4cd7f6] transition-all duration-300 ease-out"
                                                    style={{ width: `${synthesisProgress}%` }}
                                                />
                                            </div>
                                            <div className="flex justify-between items-center text-[10px] font-label font-semibold text-white/40 tracking-wider">
                                                <span>{synthesisProgress}% COMPLETE</span>
                                                <span className="text-[#4cd7f6] animate-pulse">ACTIVE RENDERING</span>
                                            </div>
                                            <p className="text-sm font-label text-[#dae2fd]/70 italic mt-2 animate-pulse">
                                                &ldquo;{synthesisStatus}&rdquo;
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    /* Creation Panel Hub (Stitch Single Shot vs Combine Scenes Timeline) */
                                    <div className="flex-1 flex flex-col justify-between gap-5 min-h-0">



                                        <div className="flex-1 flex flex-col justify-between gap-4 min-h-0">
                                            <div className="flex items-center gap-3 border-b border-[#494456]/20 pb-3">
                                                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#4cd7f6]/20 to-[#0e7490]/20 flex items-center justify-center border border-[#4cd7f6]/30 text-[#4cd7f6]">
                                                    <span className="material-symbols-outlined text-[20px]">layers</span>
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-headline font-bold text-white tracking-tight">
                                                        Combine Scenes Timeline
                                                    </h3>
                                                    <p className="text-[10px] text-white/40 font-label">
                                                        Sequence, adjust, and compile all scenes of this episode to form the complete video.
                                                    </p>
                                                </div>
                                            </div>

                                            {orderedScenes.length === 0 ? (
                                                /* No Scenes Fallback Warning with Action Trigger */
                                                <div className="flex-1 flex flex-col items-center justify-center p-6 border border-[#494456]/20 rounded-xl bg-[#060e20]/60 space-y-4">
                                                    <div className="w-12 h-12 rounded-full bg-[#ffb0cd]/10 border border-[#ffb0cd]/30 flex items-center justify-center text-[#ffb0cd]">
                                                        <span className="material-symbols-outlined text-2xl">warning</span>
                                                    </div>
                                                    <div className="text-center space-y-1">
                                                        <h4 className="text-xs font-bold text-white uppercase tracking-wider font-headline">No Scenes Found</h4>
                                                        <p className="text-[10px] text-white/40 font-label max-w-[280px]">
                                                            This episode has no configured sequences or dialogue scripts. Setup scenes to build this cut.
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => navigate(`/Dashboard/User/Shows/${showId}/Episodes/${id}/Setup`)}
                                                        className="px-4 py-1.5 bg-[#ffb0cd]/10 hover:bg-[#ffb0cd]/20 border border-[#ffb0cd]/30 text-[#ffb0cd] rounded-lg text-[10px] font-bold tracking-widest font-headline uppercase transition-all"
                                                    >
                                                        Navigate to Scene Setup
                                                    </button>
                                                </div>
                                            ) : (
                                                /* Reordering & Setup Grid */
                                                <div className="grid grid-cols-1 gap-4 text-[11px] flex-1 min-h-0">
                                                    {/* Left side: Scrollable order builder list */}
                                                    <div className="flex flex-col min-h-0 bg-[#070e20]/60 rounded-xl p-3 border border-[#494456]/15 h-[190px]">
                                                        <label className="text-[9px] uppercase font-bold text-white/50 pl-1 tracking-wider block mb-2">
                                                            Sequence Timeline ({orderedScenes.length} Scenes)
                                                        </label>
                                                        <div className="space-y-1.5 overflow-y-auto pr-1 flex-1">
                                                            {orderedScenes.map((scene, idx) => (
                                                                <div
                                                                    key={scene.id}
                                                                    className="flex items-center justify-between p-2 rounded-lg border bg-[#131b2e]/40 border-[#494456]/10 text-white/60 hover:text-white/80 transition-all"
                                                                >
                                                                    <div className="flex items-center gap-2 min-w-0">
                                                                        <span className="w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold bg-[#1c2437] text-[#4cd7f6]">
                                                                            S{scene.order}
                                                                        </span>
                                                                        <span className="truncate font-semibold text-xs text-white">
                                                                            {scene.name || 'Scene Action Block'}
                                                                        </span>
                                                                    </div>

                                                                    <div className="flex items-center gap-1 shrink-0">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => moveSceneUp(idx)}
                                                                            disabled={idx === 0}
                                                                            className="w-5 h-5 rounded bg-[#1c2437] hover:bg-[#ddb7ff]/20 text-white/60 hover:text-white flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none transition-colors"
                                                                        >
                                                                            <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => moveSceneDown(idx)}
                                                                            disabled={idx === orderedScenes.length - 1}
                                                                            className="w-5 h-5 rounded bg-[#1c2437] hover:bg-[#ddb7ff]/20 text-white/60 hover:text-white flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none transition-colors"
                                                                        >
                                                                            <span className="material-symbols-outlined text-[14px]">arrow_downward</span>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div className='flex items-center gap-4 mt-4'>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={handleResetScenes}
                                                                disabled={isSavingOrder || !isOrderChanged}
                                                            >
                                                                Reset
                                                            </Button>
                                                            <Button
                                                                variant="primary"
                                                                size="sm"
                                                                onClick={handleSaveOrder}
                                                                disabled={isSavingOrder || !isOrderChanged}
                                                            >
                                                                Save
                                                            </Button>
                                                        </div>
                                                    </div>


                                                </div>
                                            )}

                                            {orderedScenes.length > 0 && (
                                                <button
                                                    onClick={handleSynthesize}
                                                    className="w-full bg-gradient-to-r from-[#4cd7f6] to-[#0891b2] hover:opacity-95 transition-all text-[#0b1326] font-headline font-bold text-xs tracking-widest py-3 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(76,215,246,0.2)] hover:scale-[1.01]"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">layers</span>
                                                    STITCH & COMPILE EPISODE CUT
                                                </button>
                                            )}
                                        </div>

                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                </div>

                <div className="lg:col-span-4 flex flex-col gap-6">
                    {episodeVideo && (
                        <VideoMetadataBox episodeVideo={episodeVideo} />
                    )}


                    <div className="bg-surface-container-low/40 backdrop-blur-xl rounded-xl p-8 border border-[#494456]/15 relative overflow-hidden">
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#ddb7ff]/5 rounded-full blur-[60px] pointer-events-none"></div>
                        <h2 className="font-display text-xl font-bold text-white mb-4 flex items-center gap-2.5">
                            <span className="material-symbols-outlined text-[#ffb0cd] text-[22px]">subject</span>
                            Narrative Arc
                        </h2>

                        <p className="font-body text-[#dae2fd]/85 leading-relaxed text-base">
                            {episode.plotSummary || "No plot summary available for this episode yet. Provide a summary using the Edit Details console."}
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Scene List Sequence */}
            <div className="mt-8 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <h2 className="font-display text-2xl font-bold text-white">Sequence Layout</h2>

                </div>

                {/* Bento Grid for Scenes */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {isScenesLoading ? (
                        [1, 2, 3, 4].map(idx => (
                            <div key={idx} className="h-48 bg-[#131b2e]/40 rounded-xl border border-[#494456]/10 animate-pulse"></div>
                        ))
                    ) : (
                        <>
                            {scenes.map((scene, index) => {
                                return (
                                    <SceneCard key={index} scene={scene} onClick={() => navigate(`/dashboard/series/${show.id}/episodes/${episode.id}/scenes/${scene.id}`)} />
                                );
                            })}

                            {/* Add New Scene Ghost Card */}
                            <div
                                onClick={() => navigate(`/dashboard/series/${show.id}/episodes/${episode.id}/scenes/new`)}
                                className="bg-[#060e20]/25 rounded-xl border border-dashed border-[#494456]/30 group cursor-pointer hover:bg-[#131b2e]/30 hover:border-[#ddb7ff]/30 transition-all duration-300 flex flex-col h-full items-center justify-center p-6 min-h-[190px]"
                            >
                                <div className="w-12 h-12 rounded-full bg-[#131b2e] border border-[#494456]/20 flex items-center justify-center text-white/60 group-hover:text-[#ddb7ff] group-hover:border-[#ddb7ff]/30 group-hover:scale-110 transition-all mb-3 shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
                                    <span className="material-symbols-outlined text-[24px]">add_box</span>
                                </div>
                                <span className="font-label font-bold text-xs text-white/40 tracking-wider group-hover:text-white transition-colors uppercase">
                                    Generate New Scene
                                </span>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
