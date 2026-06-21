import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useGetShowByIdQuery, useGetEpisodeByIdQuery, useUpdateEpisodeMutation, useGetScenesQuery } from '@/store/apis'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import { formatDate } from '@/utils/dateFormatter'
import { toast } from 'sonner'
import { ErrorScreen, LoadingScreen } from '@/components/ui/Feedback/StatusScreens'

export default function EpisodeDetails() {
    const { showId, id } = useParams<{ showId: string, id: string }>();
    const navigate = useNavigate();

    // Queries & Mutations
    const { data: showResponse, isLoading: isShowLoading } = useGetShowByIdQuery(showId || '');
    const { data: episodeResponse, isLoading: isEpisodeLoading } = useGetEpisodeByIdQuery(id || '');
    const [updateEpisode, { isLoading: isUpdating }] = useUpdateEpisodeMutation();
    const { data: scenesResponse, isLoading: isScenesLoading } = useGetScenesQuery({
        episodeId: id || '',
        pageNumber: 1,
        pageSize: 20
    });

    const show = showResponse?.data;
    const episode = episodeResponse?.data;
    const scenes = scenesResponse?.data?.items || [];

    // Edit Details Form States
    const [isEditing, setIsEditing] = useState(false);
    const [titleInput, setTitleInput] = useState('');
    const [plotInput, setPlotInput] = useState('');

    // Synthesis Form States
    const [transitionType, setTransitionType] = useState('Glitch Zoom');
    const scenePacing = 5;
    const [backgroundMusic, setBackgroundMusic] = useState('Cyberpunk Synthwave');
    const [aspectRatio, setAspectRatio] = useState('16:9 Landscape');
    const enhancements = ['Depth of Field', 'HDR Grading'];

    // Synthesis Process States
    const [isSynthesizing, setIsSynthesizing] = useState(false);
    const [synthesisProgress, setSynthesisProgress] = useState(0);
    const [synthesisStatus, setSynthesisStatus] = useState('');

    // Creation Workspace Modes & Scene Timeline Ordering
    const [orderedScenes, setOrderedScenes] = useState<any[]>([]);

    useEffect(() => {
        if (scenes && scenes.length > 0) {
            setOrderedScenes(scenes);
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

    // Video Player States
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.8);
    const [isMuted, setIsMuted] = useState(false);
    const [showSubtitles, setShowSubtitles] = useState(true);

    // Initialize edit inputs when episode loads
    useEffect(() => {
        if (episode) {
            setTitleInput(episode.title);
            setPlotInput(episode.plotSummary);
        }
    }, [episode]);

    // Handle play/pause toggles
    const togglePlay = () => {
        if (!videoRef.current) return;
        if (isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
        } else {
            videoRef.current.play().catch(err => console.log("Play interrupted:", err));
            setIsPlaying(true);
        }
    };

    // Time update handler
    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
        }
    };

    // Loaded metadata handler
    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    };

    // Seek handler
    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = parseFloat(e.target.value);
        if (videoRef.current) {
            videoRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    // Volume change handler
    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const vol = parseFloat(e.target.value);
        setVolume(vol);
        if (videoRef.current) {
            videoRef.current.volume = vol;
            videoRef.current.muted = vol === 0;
            setIsMuted(vol === 0);
        }
    };

    // Toggle mute
    const toggleMute = () => {
        if (!videoRef.current) return;
        const newMuted = !isMuted;
        setIsMuted(newMuted);
        videoRef.current.muted = newMuted;
    };

    // Double check formatting of time string
    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    // Synced Subtitles Generator
    const getActiveSubtitle = (time: number) => {
        if (time >= 0 && time < 3) return "Initializing Silent Protocol downlink...";
        if (time >= 3 && time < 8) return "Warning: Sentinel presence detected in Sector 7.";
        if (time >= 8 && time < 14) return "Sector breach confirmed. Commencing secondary sweep.";
        if (time >= 14 && time < 20) return "We must reach the Undercity cooling shafts before sunrise.";
        if (time >= 20 && time < 27) return "The Silent Protocol is active. Protect the core at all costs.";
        return "";
    };


    // Handle Inline Edit Saving
    const handleSaveDetails = async () => {
        if (!episode) return;
        try {
            await updateEpisode({
                id: episode.id,
                body: {
                    title: titleInput,
                    plotSummary: plotInput,
                    episodeNumber: episode.episodeNumber,
                    showId: episode.showId,
                }
            }).unwrap();
            toast.success('Episode specifications updated.');
            setIsEditing(false);
        } catch (error) {
            toast.error('Failed to commit parameters to storage.');
            console.error('Update error:', error);
        }
    };

    // Synthesize Video workflow simulation
    const handleSynthesize = () => {
        if (!episode) return;
        setIsSynthesizing(true);
        setSynthesisProgress(0);
        setSynthesisStatus('Initializing neural video canvas...');

        const stages = [
            { limit: 15, status: 'Analyzing scene sequence scripts and characters...' },
            { limit: 35, status: 'Generating cinematic narrative vocal tracks with AI voiceover...' },
            { limit: 55, status: `Applying dynamic ${transitionType} transitions between scenes...` },
            { limit: 75, status: `Mixing high-fidelity background score: ${backgroundMusic}...` },
            { limit: 90, status: `Adding visual filters: ${enhancements.join(', ') || 'Standard'}...` },
            { limit: 98, status: `Rendering final 4K video frames (${aspectRatio})...` }
        ];

        let currentPercent = 0;
        const interval = setInterval(async () => {
            currentPercent += Math.floor(Math.random() * 5) + 3;
            if (currentPercent >= 100) {
                currentPercent = 100;
                clearInterval(interval);
                setSynthesisProgress(100);
                setSynthesisStatus('Synthesis complete! Finalizing link...');

                try {
                    // Update the episode videoId with a premium futuristic neon MP4 video loop
                    await updateEpisode({
                        id: episode.id,
                        body: {
                            title: episode.title,
                            plotSummary: episode.plotSummary,
                            episodeNumber: episode.episodeNumber,
                            showId: episode.showId,
                        }
                    }).unwrap();
                    toast.success('Episode video synthesized successfully!');
                } catch (err) {
                    toast.error('Failed to link video metadata, but preview is active!');
                } finally {
                    setIsSynthesizing(false);
                }
            } else {
                setSynthesisProgress(currentPercent);
                // Find matching stage
                const matchedStage = stages.find(s => currentPercent <= s.limit);
                if (matchedStage) {
                    setSynthesisStatus(matchedStage.status);
                }
            }
        }, 300);
    };
    if (isShowLoading || isEpisodeLoading) return <LoadingScreen message="Accessing Episode Archives..." accentColor="purple" />
    if (!show || !episode) return <ErrorScreen title="Series Connection Lost" message="Unable to retrieve episode details for episode placement." />

    const videoSource = null;

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

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex flex-col gap-2">
                    <span className="text-[#4cd7f6] font-label text-sm uppercase tracking-widest font-semibold">
                        Episode {episode.episodeNumber.toString().padStart(2, '0')}
                    </span>
                    {isEditing ? (
                        <input
                            type="text"
                            value={titleInput}
                            onChange={(e) => setTitleInput(e.target.value)}
                            className="bg-[#131b2e]/60 border border-[#494456]/30 rounded-xl px-4 py-2 text-2xl font-headline font-bold text-white focus:outline-none focus:border-[#ddb7ff]/50"
                        />
                    ) : (
                        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-white">
                            {episode.title}
                        </h1>
                    )}
                </div>
                <div className="flex items-center gap-4">
                    {isEditing ? (
                        <>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="bg-[#2d3449]/40 backdrop-blur-xl border border-[#494456]/20 text-[#dae2fd] hover:bg-[#2d3449]/80 transition-colors px-6 py-3 rounded-lg font-label font-medium flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-[20px]">close</span>
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveDetails}
                                disabled={isUpdating}
                                className="bg-gradient-to-r from-[#ddb7ff] to-[#7818c6] text-white hover:opacity-90 transition-all px-6 py-3 rounded-lg font-label font-medium flex items-center gap-2 shadow-[0_0_20px_rgba(221,183,255,0.15)] disabled:opacity-50"
                            >
                                <span className="material-symbols-outlined text-[20px]">save</span>
                                Save Specifications
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-[#2d3449]/40 backdrop-blur-xl border border-[#494456]/20 text-[#dae2fd] hover:bg-[#222a3d] transition-colors px-6 py-3 rounded-lg font-label font-medium flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-[20px]">edit</span>
                                Edit Details
                            </button>
                            <button
                                disabled={!videoSource}
                                onClick={() => toast.success('Initializing full episode video download package...')}
                                className="bg-gradient-to-r from-[#ddb7ff] to-[#7818c6] text-white hover:opacity-95 transition-all px-6 py-3 rounded-lg font-label font-medium flex items-center gap-2 shadow-[0_0_20px_rgba(221,183,255,0.15)] disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <span className="material-symbols-outlined text-[20px]">movie</span>
                                Export Video
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Main Content Area: Two Columns */}
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Column (Wide) */}
                <div className="flex-1 flex flex-col gap-8">
                    {/* Video Player Container / Creative Suite */}
                    <div className="relative w-full aspect-video bg-[#131b2e] rounded-xl overflow-hidden group shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-[#494456]/15 flex items-center justify-center">
                        {videoSource ? (
                            /* Fully-featured Interactive Custom Video Player */
                            <div className="relative w-full h-full bg-black group/player">
                                <video
                                    ref={videoRef}
                                    src={videoSource}
                                    onTimeUpdate={handleTimeUpdate}
                                    onLoadedMetadata={handleLoadedMetadata}
                                    onClick={togglePlay}
                                    className="w-full h-full object-contain cursor-pointer"
                                />

                                {/* Subtitles Overlay */}
                                {showSubtitles && getActiveSubtitle(currentTime) && (
                                    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-[#0b1326]/80 backdrop-blur-md px-6 py-2 rounded-lg border border-[#494456]/30 text-sm font-label font-semibold text-center text-[#dae2fd] max-w-[80%] animate-subtle-float">
                                        <span className="text-[#ddb7ff] mr-2">✦</span>
                                        {getActiveSubtitle(currentTime)}
                                    </div>
                                )}

                                {/* Cinematic Top Overlay */}
                                <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start opacity-0 group-hover/player:opacity-100 transition-opacity duration-300 bg-gradient-to-b from-[#0b1326]/70 to-transparent">
                                    <div className="bg-[#0b1326]/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-label text-[#dae2fd] border border-[#494456]/20">
                                        FinalVideo_v2.mp4
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="bg-[#03b5d3]/20 text-[#4cd7f6] px-2.5 py-1 rounded text-xs font-black tracking-widest border border-[#4cd7f6]/20">4K</span>
                                    </div>
                                </div>

                                {/* Center Play/Pause Indicator Button */}
                                {!isPlaying && (
                                    <button
                                        onClick={togglePlay}
                                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-[#ddb7ff]/90 hover:bg-[#ddb7ff] text-[#490080] rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-[0_0_30px_rgba(221,183,255,0.4)] backdrop-blur-sm"
                                    >
                                        <span className="material-symbols-outlined text-[32px] ml-1 fill-[1]" style={{ fontVariationSettings: "'FILL' 1" }}>
                                            play_arrow
                                        </span>
                                    </button>
                                )}

                                {/* Cinematic Bottom Controls Overlay */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-3 opacity-0 group-hover/player:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-[#0b1326]/80 to-transparent">
                                    {/* Custom Interactive Progress Bar */}
                                    <div className="relative w-full flex items-center group/progress">
                                        <input
                                            type="range"
                                            min={0}
                                            max={duration || 100}
                                            value={currentTime}
                                            onChange={handleSeek}
                                            className="w-full h-1.5 bg-[#494456]/30 hover:h-2 rounded-full appearance-none cursor-pointer accent-[#ddb7ff] transition-all"
                                        />
                                        <div
                                            className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 bg-gradient-to-r from-[#ddb7ff] to-[#4cd7f6] rounded-full pointer-events-none"
                                            style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                                        />
                                    </div>

                                    {/* Toolbar buttons */}
                                    <div className="flex justify-between items-center text-[#dae2fd] px-1">
                                        <div className="flex items-center gap-4">
                                            <button onClick={togglePlay} className="hover:text-[#ddb7ff] transition-colors">
                                                <span className="material-symbols-outlined text-[22px]">
                                                    {isPlaying ? 'pause' : 'play_arrow'}
                                                </span>
                                            </button>

                                            {/* Volume Controls */}
                                            <div className="flex items-center gap-2 group/volume">
                                                <button onClick={toggleMute} className="hover:text-[#ddb7ff] transition-colors">
                                                    <span className="material-symbols-outlined text-[20px]">
                                                        {isMuted || volume === 0 ? 'volume_off' : volume < 0.5 ? 'volume_down' : 'volume_up'}
                                                    </span>
                                                </button>
                                                <input
                                                    type="range"
                                                    min={0}
                                                    max={1}
                                                    step={0.05}
                                                    value={isMuted ? 0 : volume}
                                                    onChange={handleVolumeChange}
                                                    className="w-0 overflow-hidden group-hover/volume:w-16 h-1 rounded-full appearance-none cursor-pointer bg-[#494456]/50 accent-[#ddb7ff] transition-all duration-300"
                                                />
                                            </div>

                                            <span className="text-xs font-label text-white/70">
                                                {formatTime(currentTime)} / {formatTime(duration)}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => setShowSubtitles(!showSubtitles)}
                                                className={`transition-colors ${showSubtitles ? 'text-[#4cd7f6]' : 'text-white/40 hover:text-[#dae2fd]'}`}
                                                title="Toggle Subtitles"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">closed_caption</span>
                                            </button>
                                            <button className="hover:text-[#ddb7ff] transition-colors">
                                                <span className="material-symbols-outlined text-[20px]">settings</span>
                                            </button>
                                            <button
                                                onClick={() => videoRef.current?.requestFullscreen()}
                                                className="hover:text-[#ddb7ff] transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">fullscreen</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Creative Custom Suite to Synthesize Video from Scenes */
                            <div className="absolute inset-0 bg-[#0b1326] p-8 flex flex-col justify-between overflow-y-auto">
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
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] flex-1 min-h-0">
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
                                                                            S{idx + 1}
                                                                        </span>
                                                                        <span className="truncate font-semibold text-xs text-white">
                                                                            {scene.characterName || 'Scene Action Block'}
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
                                                    </div>

                                                    {/* Right side: Custom master parameters */}
                                                    <div className="space-y-3">
                                                        <div className="space-y-1">
                                                            <label className="text-[9px] uppercase font-bold text-white/50 pl-1 tracking-wider block">Sequence Transition</label>
                                                            <select
                                                                value={transitionType}
                                                                onChange={(e) => setTransitionType(e.target.value)}
                                                                className="w-full bg-[#131b2e] border border-[#494456]/30 rounded-lg px-2.5 py-1.5 text-[#dae2fd] focus:outline-none focus:border-[#ddb7ff]/50 font-medium"
                                                            >
                                                                <option>Glitch Zoom</option>
                                                                <option>Cross Fade</option>
                                                                <option>Luma Wipe</option>
                                                                <option>Cinematic Cut</option>
                                                            </select>
                                                        </div>

                                                        <div className="space-y-1">
                                                            <label className="text-[9px] uppercase font-bold text-white/50 pl-1 tracking-wider block">Atmospheric Soundtrack</label>
                                                            <select
                                                                value={backgroundMusic}
                                                                onChange={(e) => setBackgroundMusic(e.target.value)}
                                                                className="w-full bg-[#131b2e] border border-[#494456]/30 rounded-lg px-2.5 py-1.5 text-[#dae2fd] focus:outline-none focus:border-[#ddb7ff]/50 font-medium"
                                                            >
                                                                <option>Cyberpunk Synthwave</option>
                                                                <option>Industrial Dark Ambient</option>
                                                                <option>Epic Orchestral</option>
                                                                <option>Lo-Fi Chill</option>
                                                                <option>None</option>
                                                            </select>
                                                        </div>

                                                        <div className="space-y-1">
                                                            <label className="text-[9px] uppercase font-bold text-white/50 pl-1 tracking-wider block">Cinematic Canvas Aspect</label>
                                                            <div className="flex gap-1.5">
                                                                {['16:9 Landscape', '9:16 Vertical'].map((ratio) => (
                                                                    <button
                                                                        key={ratio}
                                                                        type="button"
                                                                        onClick={() => setAspectRatio(ratio)}
                                                                        className={`flex-1 py-1.5 rounded-lg border text-center font-medium transition-all ${aspectRatio.includes(ratio.split(' ')[0])
                                                                            ? 'bg-[#ddb7ff]/10 border-[#ddb7ff] text-[#ddb7ff] shadow-[0_0_10px_rgba(221,183,255,0.15)]'
                                                                            : 'border-[#494456]/30 text-white/50 hover:border-white/20 hover:text-white'
                                                                            }`}
                                                                    >
                                                                        {ratio}
                                                                    </button>
                                                                ))}
                                                            </div>
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

                    {/* Narrative Arc Card */}
                    <div className="bg-[#131b2e]/40 backdrop-blur-xl rounded-xl p-8 border border-[#494456]/15 relative overflow-hidden">
                        {/* Decorative gradient blur */}
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#ddb7ff]/5 rounded-full blur-[60px] pointer-events-none"></div>
                        <h2 className="font-display text-xl font-bold text-white mb-4 flex items-center gap-2.5">
                            <span className="material-symbols-outlined text-[#ffb0cd] text-[22px]">subject</span>
                            Narrative Arc
                        </h2>
                        {isEditing ? (
                            <textarea
                                value={plotInput}
                                onChange={(e) => setPlotInput(e.target.value)}
                                rows={5}
                                className="w-full bg-[#131b2e]/80 border border-[#494456]/30 rounded-xl px-4 py-3 text-white leading-relaxed focus:outline-none focus:border-[#ddb7ff]/50"
                            />
                        ) : (
                            <p className="font-body text-[#dae2fd]/85 leading-relaxed text-base">
                                {episode.plotSummary || "No plot summary available for this episode yet. Provide a summary using the Edit Details console."}
                            </p>
                        )}
                    </div>
                </div>

                {/* Right Column (Narrow) */}
                <div className="w-full lg:w-[320px] flex flex-col gap-6">
                    {/* Stats Card */}
                    <div className="bg-[#131b2e]/40 backdrop-blur-xl rounded-xl p-6 border border-[#494456]/15 flex flex-col gap-6">
                        <h3 className="font-display text-lg font-bold text-white border-b border-[#494456]/15 pb-4">
                            Metadata Specifications
                        </h3>
                        <div className="flex flex-col gap-4 font-label">
                            <div className="flex justify-between items-center">
                                <span className="text-white/50 text-sm flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px] text-[#4cd7f6]">aspect_ratio</span> Resolution
                                </span>
                                <span className="text-white font-medium text-xs bg-[#171f33] border border-[#494456]/20 px-2.5 py-1 rounded-md">
                                    {videoSource ? '3840 x 2160' : '4K UHD Draft'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-white/50 text-sm flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px] text-[#4cd7f6]">timer</span> Duration
                                </span>
                                <span className="text-white font-medium text-sm">
                                    {videoSource ? '02:45' : `${(scenes.length * scenePacing).toString().padStart(2, '0')}:00`}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-white/50 text-sm flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px] text-[#4cd7f6]">calendar_today</span> Created
                                </span>
                                <span className="text-white font-medium text-sm">
                                    {formatDate(episode.createdAt)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-white/50 text-sm flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px] text-[#ddb7ff]">memory</span> Render Time
                                </span>
                                <span className="text-[#ddb7ff] font-medium text-sm">
                                    {videoSource ? '1h 12m' : 'Pending Synthesis'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Series Context navigation card */}
                    <button
                        onClick={() => navigate(`/dashboard/series/${show.id}`)}
                        className="group bg-[#2d3449]/40 backdrop-blur-xl border border-[#494456]/15 rounded-xl p-6 flex flex-col gap-3 relative overflow-hidden text-left transition-all hover:bg-[#222a3d]/60"
                    >
                        <div className="absolute right-0 top-0 w-full h-full bg-gradient-to-l from-[#4cd7f6]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <span className="text-[10px] font-label text-[#dae2fd]/40 uppercase tracking-widest font-black">
                            Part of Series
                        </span>
                        <div className="flex items-center justify-between w-full">
                            <h4 className="font-display font-bold text-white text-lg group-hover:text-[#4cd7f6] transition-colors leading-tight">
                                {show.title}
                            </h4>
                            <span className="material-symbols-outlined text-white/50 group-hover:text-[#4cd7f6] transition-colors group-hover:translate-x-1 duration-300">
                                arrow_forward
                            </span>
                        </div>
                    </button>
                </div>
            </div>

            {/* Bottom Section: Scene List Sequence */}
            <div className="mt-8 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <h2 className="font-display text-2xl font-bold text-white">Sequence Layout</h2>
                    <button
                        onClick={() => navigate(`/dashboard/series/${show.id}/episodes/${episode.id}/scenes/new`)}
                        className="bg-[#222a3d] hover:bg-[#2d3449] text-[#ddb7ff] border border-[#ddb7ff]/20 transition-all duration-300 px-4 py-2 rounded-lg font-label font-medium flex items-center gap-2 text-sm"
                    >
                        <span className="material-symbols-outlined text-[18px]">add</span>
                        Add Scene
                    </button>
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
                                // Provide premium cyberpunk default placeholders matching their index if no visual URL is configured
                                const placeholders = [
                                    "https://lh3.googleusercontent.com/aida-public/AB6AXuAHw9a_UB67T31LDm_GJKLM7r7jqV9-lkkx65gtOXmUaHyP83QSxsEqYKDffL7fAiW9PayohXVZEY6sHM1K1IXFxwokq4xD7ZAlEjIgPtbzTtBx8urfU9IlcY3adycIRUBv0tzzbApTjOIEMkbPOEW8YUgKFE0aR5XjPaJUryxsrdnFEopYWZuM2ABjXGBTgAEAjUFprHWgMoq0X6jdinIn6ZLxdlkI6wBil_GNkZuhL-WER1vXz47PnJ5vH96dDGJtZ2ev7lEP678",
                                    "https://lh3.googleusercontent.com/aida-public/AB6AXuA3DQ1NRwY6LISm_bpeT9VtXzPpXjmgYK1CXmIowZqfxvuko3aqyseDDYaTrQwfOnS1DywfHeOrFu3dqygdjr13UxsUFQh0odsbmILpNXjCBs-g-nTfD1ELNGn5QgKAW36NSQjs43Suml9cFbYbJUF8FjFkcqYMSQd38gvXToiDqn-nXIOAXnBukAtUozdWevAsFz-Zr35ZAOtXJGr75No-YCdRJulgPzgrxHbFctW3JOL44Z4AfbTs0EFfuNZP6DIQDEMQQaoga28",
                                    "https://lh3.googleusercontent.com/aida-public/AB6AXuD60Xtn6SvwQV_kOKWbOrWoAVWT0_KI0N45ruCljAx8T9P9057dUH-hAPga7CYFxvYMqi1O1nEwDvvXr9cypPe5pUc60uoKP9nSAVN5FWEaAUn7fsfiut8ziDvZsv5D1TGjj3H0QYI57FEWRm9k3kCEtFp4tEiT28kFcHru65NTjc0smAuch5hPsjtm0TSKwAbgytEYUME8aFEsIdw09VnwfXX7A2W4VXoF1_T94MXQEKy1GSN5bAzSdIu7jV8EktsZjTGPO3I9EJE",
                                    "https://lh3.googleusercontent.com/aida-public/AB6AXuBViEDLqZ9c_m_tukMmEhnTBRSjIqZeWHLgfwHwr9KIXF_UP7SSXyr0FX72fal5UYIaEPcS3p01S-rtTqTvkRiNMbGacmZK1aKeISOleQo7ERmzLossHcMUAVuQ1zX_Du-y5T21EhlCt9tRUQdQ1Mkk4-AxzuIwvG9WFJrdw5Bpsj2k_QSsxps6jBhyztzHpF2axT4nbnofvfG0CH0b1gW_iGcHePq55j_clM5Udm-UA_O067F5iK--ZRIhlL4G7cvlBgOqzhdi-sI"
                                ];
                                const sceneThumbnail = scene.aiVideo?.thumbnailUrl || placeholders[index % placeholders.length];
                                const visualDescription = scene.aiScript?.visualPrompt || scene.aiScript?.environmentDescription || "Cinematic sequence parameters.";

                                return (
                                    <div
                                        key={scene.id}
                                        onClick={() => navigate(`/dashboard/series/${show.id}/episodes/${episode.id}/scenes`)}
                                        className="bg-[#131b2e]/40 rounded-xl overflow-hidden border border-[#494456]/15 group cursor-pointer hover:border-[#ddb7ff]/30 transition-all duration-300 flex flex-col h-full"
                                    >
                                        <div className="h-32 bg-[#222a3d] relative overflow-hidden">
                                            <img
                                                src={sceneThumbnail}
                                                alt={`Scene ${scene.order} Thumbnail`}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-70"
                                            />
                                            <div className="absolute top-2 left-2 bg-[#0b1326]/80 backdrop-blur text-[10px] font-black tracking-widest px-2.5 py-1 rounded text-white border border-white/5">
                                                SCENE {scene.order.toString().padStart(2, '0')}
                                            </div>
                                        </div>
                                        <div className="p-4 flex flex-col gap-2 flex-1 justify-between">
                                            <h4 className="font-label font-bold text-white text-sm group-hover:text-[#ddb7ff] transition-colors line-clamp-1">
                                                {scene.aiScript?.location?.name || `Sequence Event ${scene.order}`}
                                            </h4>
                                            <p className="text-xs text-white/50 line-clamp-2 leading-relaxed font-body">
                                                {visualDescription}
                                            </p>
                                        </div>
                                    </div>
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
