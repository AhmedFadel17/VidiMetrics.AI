import { Episode } from "@/types/models/storyEngine";

interface OverviewTabProps {
    episode: Episode;
}

export default function OverviewTab({ episode }: OverviewTabProps) {
    const videoSource = episode.videoId;

    const isYouTube = (url: string) => {
        return url.includes('youtube.com') || url.includes('youtu.be');
    };

    const getYouTubeEmbedUrl = (url: string) => {
        let videoId = '';
        if (url.includes('v=')) {
            videoId = url.split('v=')[1].split('&')[0];
        } else if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1];
        } else {
            videoId = url; // Assume it's already an ID
        }
        return `https://www.youtube.com/embed/${videoId}`;
    };

    const isExternalLink = (url: string) => {
        return url.startsWith('http') || isYouTube(url);
    };

    return (
        <div className="space-y-8">
            {/* Video Player Section */}
            <div className="glass-card rounded-[3rem] overflow-hidden border border-white/5 relative group bg-black/20">
                <div className="aspect-video w-full flex items-center justify-center relative">
                    {videoSource ? (
                        isExternalLink(videoSource) ? (
                            <iframe
                                src={isYouTube(videoSource) ? getYouTubeEmbedUrl(videoSource) : videoSource}
                                className="w-full h-full border-0"
                                allowFullScreen
                                title={episode.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            />
                        ) : (
                            <video
                                src={videoSource}
                                controls
                                className="w-full h-full object-contain"
                                poster={episode.thumbnailUrl}
                            />
                        )
                    ) : (
                        <div className="flex flex-col items-center gap-4 text-white/20">
                            <span className="material-symbols-outlined text-6xl">videocam_off</span>
                            <p className="font-label text-xs uppercase tracking-widest">No video signal detected</p>
                        </div>
                    )}
                </div>
            </div>


        </div>
    );
}
