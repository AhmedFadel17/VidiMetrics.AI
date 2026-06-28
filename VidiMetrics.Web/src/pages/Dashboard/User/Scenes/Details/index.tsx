import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
    useGetSceneByIdQuery,
    useUpdateSceneMutation,
    useGetShowByIdQuery,
    useGetEpisodeByIdQuery,
    useCreateSceneVideoMutation
} from '@/store/apis'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import { LoadingScreen, ErrorScreen } from '@/components/ui/Feedback/StatusScreens'
import { toast } from 'sonner'
import { formatDate } from '@/utils/dateFormatter'
import { ScriptLineType } from '@/types'
import { PageHeader } from '@/components/ui/PageHeader'
import VideoPlayer from '@/components/ui/VideoPlayer'

export default function SceneDetails() {
    const { showId, episodeId, id } = useParams<{ showId: string; episodeId: string; id: string }>();
    const navigate = useNavigate();

    // Queries & Mutations
    const { data: sceneResponse, isLoading: isSceneLoading } = useGetSceneByIdQuery(id || '');
    const { data: showResponse } = useGetShowByIdQuery(showId || '');
    const { data: episodeResponse } = useGetEpisodeByIdQuery(episodeId || '');
    const [updateScene] = useUpdateSceneMutation();
    const [createSceneVideo] = useCreateSceneVideoMutation();

    const scene = sceneResponse?.data;
    const show = showResponse?.data;
    const episode = episodeResponse?.data;

    // Generation States
    const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
    const [generationProgress, setGenerationProgress] = useState(0);
    const [generationStatus, setGenerationStatus] = useState('');

    // Handle Scene Video Generation
    const handleGenerateVideo = async () => {
        if (!scene || !scene.aiScriptId) {
            toast.error('No AI Script linked to this scene to generate video.');
            return;
        }

        setIsGeneratingVideo(true);
        setGenerationProgress(0);
        setGenerationStatus('Preparing AI Script & Location Telemetry...');

        // Simulated stages for generating visual elements
        const stages = [
            { limit: 20, status: 'Parsing character presence and actions...' },
            { limit: 50, status: 'Synthesizing scene frames with video diffusion model...' },
            { limit: 80, status: 'Enhancing resolution and lighting maps...' },
            { limit: 95, status: 'Uploading render clip to cloud storage...' }
        ];

        let currentPercent = 0;
        const interval = setInterval(() => {
            currentPercent += Math.floor(Math.random() * 5) + 2;
            if (currentPercent > 95) currentPercent = 95;
            setGenerationProgress(currentPercent);
            const matchedStage = stages.find(s => currentPercent <= s.limit);
            if (matchedStage) setGenerationStatus(matchedStage.status);
        }, 500);

        try {
            // 1. Generate video using scriptId
            const videoResult = await createSceneVideo({ scriptId: scene.aiScriptId }).unwrap();
            const generatedVideoId = videoResult.data?.id;

            if (!generatedVideoId) {
                throw new Error('Video generated but ID was missing.');
            }

            // 2. Link video to the Scene
            await updateScene({
                id: scene.id,
                body: {
                    aiVideoId: generatedVideoId
                }
            }).unwrap();

            clearInterval(interval);
            setGenerationProgress(100);
            setGenerationStatus('Video generated and linked successfully!');
            toast.success('Scene video generated successfully!');
        } catch (error: any) {
            clearInterval(interval);
            toast.error(error?.data?.message || 'Failed to generate scene video.');
            console.error('Scene Video Generation Error:', error);
        } finally {
            setIsGeneratingVideo(false);
        }
    };

    if (isSceneLoading) {
        return <LoadingScreen message="Retrieving Scene specifications..." />;
    }

    if (!scene || !show || !episode) {
        return <ErrorScreen title="Scene Disconnected" message="Unable to load this scene placement specifications." />;
    }

    const script = scene.aiScript;
    const videoSource = scene.aiVideo?.videoUrl || null;
    const characters = scene.characters || [];

    return (
        <div className="space-y-10 pb-20 antialiased text-[#dae2fd]">
            {/* Breadcrumbs */}
            <Breadcrumbs
                items={[
                    { label: 'Home', path: '/' },
                    { label: 'Series Library', path: '/dashboard/series' },
                    { label: show.title, path: `/dashboard/series/${show.id}` },
                    { label: 'Episodes', path: `/dashboard/series/${show.id}?tab=Episodes` },
                    { label: `E${episode.episodeNumber}. ${episode.title}`, path: `/dashboard/series/${show.id}/episodes/${episode.id}` },
                    { label: `Scene ${scene.order.toString().padStart(2, '0')}. ${scene.name}` }
                ]}
            />

            <div>
                <PageHeader
                    chipText={`Episode ${episode.episodeNumber}`}
                    titlePrefix={`Scene ${scene.order.toString().padStart(2, '0')} • `}
                    gradientText={`${scene.name}`}
                    description="Preview and download the generated video clip or generate a new one"
                />
            </div>



            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Left Column - Video and Screenplay */}
                <div className="col-span-1 lg:col-span-3 flex flex-col gap-8">
                    {/* Cinematic Screen Canvas */}
                    <div className="relative w-full aspect-video bg-surface-container-low rounded-xl overflow-hidden group shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-[#494456]/15 flex items-center justify-center">
                        {videoSource ? (
                            <VideoPlayer videoSource={videoSource} />

                        ) : (
                            <div className="absolute inset-0 bg-[#0b1326] p-8 flex flex-col justify-between overflow-y-auto">
                                {isGeneratingVideo ? (
                                    <div className="flex-1 flex flex-col items-center justify-center space-y-8 p-12">
                                        <div className="relative w-28 h-28 flex items-center justify-center">
                                            <div className="absolute inset-0 border-4 border-accent-cyan/10 border-t-accent-cyan border-r-accent-cyan-300 rounded-full animate-spin"></div>
                                            <div className="w-16 h-16 bg-gradient-to-r from-accent-cyan/20 to-accent-cyan-200/20 rounded-full animate-pulse flex items-center justify-center border border-accent-cyan/20">
                                                <span className="material-symbols-outlined text-accent-cyan text-2xl animate-bounce">auto_awesome</span>
                                            </div>
                                        </div>
                                        <div className="text-center space-y-3 max-w-md">
                                            <h3 className="font-headline text-lg font-bold text-white tracking-wide">
                                                Synthesizing Visual Layout
                                            </h3>
                                            <div className="w-full h-1.5 bg-[#2d3449] rounded-full overflow-hidden border border-[#494456]/20 relative">
                                                <div
                                                    className="h-full bg-gradient-to-r from-accent-cyan to-accent-cyan-200 transition-all duration-300 ease-out"
                                                    style={{ width: `${generationProgress}%` }}
                                                />
                                            </div>
                                            <div className="flex justify-between items-center text-[10px] font-label font-semibold text-white/40 tracking-wider">
                                                <span>{generationProgress}% RENDERED</span>
                                                <span className="text-accent-cyan animate-pulse">GENERATING CLIP</span>
                                            </div>
                                            <p className="text-sm font-label text-[#dae2fd]/70 italic mt-2 animate-pulse">
                                                &ldquo;{generationStatus}&rdquo;
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 max-w-lg mx-auto">
                                        <div className="w-16 h-16 rounded-2xl bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center text-accent-cyan shadow-[0_0_15px_rgba(251,191,36,0.1)]">
                                            <span className="material-symbols-outlined text-3xl">movie_filter</span>
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="font-headline text-xl font-bold text-white">No Rendered Clip Found</h3>
                                            <p className="text-sm text-white/50 leading-relaxed font-body">
                                                This scene contains a script and scene directions but has not been compiled into an AI-generated video canvas.
                                            </p>
                                        </div>
                                        {script ? (
                                            <button
                                                onClick={handleGenerateVideo}
                                                className="bg-gradient-to-r from-accent-cyan to-accent-cyan hover:opacity-95 transition-all text-black font-headline font-bold text-xs tracking-widest py-3 px-8 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(251,191,36,0.2)] hover:scale-[1.01]"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                                                NEURAL RENDER VIDEO
                                            </button>
                                        ) : (
                                            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-300 text-xs rounded-xl font-label">
                                                Please set up an AI Script for this scene first to allow visual generation.
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* AI Screenplay Script Beat */}
                    <div className="bg-surface-container-low/40 backdrop-blur-xl rounded-xl p-8 border border-[#494456]/15 relative overflow-hidden">
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-accent-cyan/5 rounded-full blur-[60px] pointer-events-none"></div>
                        <h2 className="font-display text-xl font-bold text-white mb-6 flex items-center gap-2.5">
                            <span className="material-symbols-outlined text-accent-cyan text-[22px]">subject</span>
                            AI Visual Script Beat
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">Visual Prompts & Scene Settings</h4>
                                <div className="p-4 bg-[#0a1122]/60 rounded-xl border border-[#494456]/15">
                                    <p className="text-sm text-white/80 leading-relaxed font-body italic">
                                        &ldquo;{script?.visualPrompt || 'No visual prompt defined.'}&rdquo;
                                    </p>
                                </div>
                            </div>

                            {script?.scriptLines && script.scriptLines.length > 0 && (
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-4">Dialogue & Action Layout</h4>
                                    <div className="space-y-4">
                                        {script.scriptLines
                                            .slice()
                                            .sort((a, b) => a.sequence - b.sequence)
                                            .map((line) => {
                                                const isDialogue = line.type === ScriptLineType.Character;
                                                const speaker = characters.find(c => c.id === line.characterId);
                                                return (
                                                    <div
                                                        key={line.id}
                                                        className={`p-3.5 rounded-xl border transition-all ${isDialogue
                                                            ? 'bg-[#182136]/30 border-[#494456]/20 pl-6'
                                                            : 'bg-[#0f172a]/20 border-dashed border-[#494456]/10'
                                                            }`}
                                                    >
                                                        <div className="flex items-center justify-between mb-1.5">
                                                            <span className={`text-[10px] font-black uppercase tracking-wider ${isDialogue ? 'text-accent-cyan' : 'text-white/40'}`}>
                                                                {isDialogue ? (speaker?.name || 'CHARACTER') : 'ACTION BEAT'}
                                                            </span>
                                                            {line.characterStatus && (
                                                                <span className="text-[9px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-white/50">
                                                                    {line.characterStatus}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-[#dae2fd]/85 leading-relaxed font-body">
                                                            {line.content}
                                                        </p>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column - Telemetry and Cast */}
                <div className="flex flex-col gap-6">
                    {/* Scene Telemetry */}
                    <div className="bg-surface-container-low/40 backdrop-blur-xl rounded-xl p-6 border border-[#494456]/15 flex flex-col gap-6">
                        <h3 className="font-display text-lg font-bold text-white border-b border-[#494456]/15 pb-4">
                            Scene Telemetry
                        </h3>
                        <div className="flex flex-col gap-4 font-label text-sm">
                            <div className="flex justify-between items-center">
                                <span className="text-white/50 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm text-accent-cyan">location_on</span> Location
                                </span>
                                <span className="text-white font-medium truncate max-w-[120px]" title={script?.location?.name || 'Staging Location'}>
                                    {script?.location?.name || 'Staging'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-white/50 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm text-accent-cyan">partly_cloudy_day</span> Weather
                                </span>
                                <span className="text-white font-medium capitalize">
                                    {script?.weather || 'Atmospheric'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-white/50 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm text-accent-cyan">timer</span> Clip Length
                                </span>
                                <span className="text-white font-medium">
                                    {scene.aiVideo?.duration ? `${scene.aiVideo.duration}s` : '5s Draft'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-white/50 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm text-accent-cyan">science</span> Seed ID
                                </span>
                                <span className="text-white font-medium">
                                    {scene.aiVideo?.seed || 'Unseeded'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-white/50 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm text-accent-cyan">calendar_today</span> Created
                                </span>
                                <span className="text-white font-medium">
                                    {formatDate(scene.createdAt)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Scene Cast list */}
                    <div className="bg-surface-container-low/40 backdrop-blur-xl rounded-xl p-6 border border-[#494456]/15 flex flex-col gap-4">
                        <h3 className="font-display text-lg font-bold text-white border-b border-[#494456]/15 pb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-accent-cyan text-lg">groups</span>
                            Cast Involved
                        </h3>

                        {characters.length === 0 ? (
                            <p className="text-xs text-white/40 italic font-body">No characters assigned to this scene layout.</p>
                        ) : (
                            <div className="space-y-3">
                                {characters.map((character) => (
                                    <div
                                        key={character.id}
                                        onClick={() => navigate(`/dashboard/series/${show.id}/characters/${character.id}`)}
                                        className="flex items-center gap-3 p-2 rounded-lg border border-[#494456]/10 hover:border-accent-cyan/30 bg-[#0c1221]/40 cursor-pointer hover:bg-surface-container-low/60 transition-all"
                                    >
                                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                                            {character.referenceImageUrl ? (
                                                <img src={character.referenceImageUrl} alt={character.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="material-symbols-outlined text-white/30 text-xl">person</span>
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h4 className="text-xs font-bold text-white truncate">{character.name}</h4>
                                            <p className="text-[10px] text-white/50 truncate capitalize leading-tight">{character.role}</p>
                                        </div>
                                        <span className="material-symbols-outlined text-white/20 text-[14px]">arrow_forward</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
