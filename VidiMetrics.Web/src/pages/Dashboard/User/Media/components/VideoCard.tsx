import { AiVideo } from "@/types/models/ai";
import { formatDate } from "@/utils/dateFormatter";
import LinkStatusBox from "./LinkStatusBox";

interface VideoCardProps {
    video: AiVideo;
    // setSelectedAsset: (asset: AiImage) => void;
    selected?: boolean;
    handleDelete: (id: string) => void;
    handleDownload: (src: string) => void;
}
export default function VideoCard({ video, selected = false, handleDelete, handleDownload }: VideoCardProps) {
    const { id, videoUrl, assetType, thumbnailUrl, duration, seed, size, createdAt, isLinked } = video;
    const createdAtRelative = formatDate(createdAt);
    const sizeInMb = (size / 1024 / 1024).toFixed(2);
    const formattedDuration = duration;
    return (
        <div
            key={id}
            // onClick={() => setSelectedAsset(image)}
            className={`group relative flex flex-col bg-surface-container-low rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer border ${selected ? 'border-primary/50' : 'border-transparent'} hover:shadow-primary/5`}
        >
            <div className="aspect-video relative overflow-hidden">
                <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    src={thumbnailUrl}
                    alt={id}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white transform scale-90 group-hover:scale-100 transition-transform">
                        <span className="material-symbols-outlined scale-150">play_arrow

                        </span>

                    </div>
                </div>
                <span className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md text-[10px] font-bold px-2 py-1 rounded text-white">{formattedDuration}</span>

                <div className="absolute top-3 left-3 flex gap-2">
                    {isLinked ? (
                        <LinkStatusBox assetType={assetType} />
                    ) : (
                        <span className={`flex flex-items items-center bg-amber-500/10 backdrop-blur-md border border-amber-500/20 text-amber-400 px-2 py-1 rounded gap-1`}>
                            <span className="material-symbols-outlined text-xs">warning</span>
                            <span className="text-xs">Unlinked / Floating Asset</span>

                        </span>
                    )}
                </div>
            </div>

            <div className="p-5 flex flex-col gap-1">
                <h3 className="font-semibold text-on-surface truncate">{id}</h3>
                <div className="flex items-center gap-3 text-on-surface-variant text-xs font-medium">
                    <span>{seed}SD</span>
                    <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
                    <span>{sizeInMb} MB</span>
                    <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
                    <span>{createdAtRelative}</span>
                </div>

                {/* Card Action Footers */}
                <div className="mt-6 flex items-center gap-2">
                    {isLinked ? (
                        <button
                            // onClick={(e) => handleOpenLinkModal(e, asset)}
                            className="flex-1 bg-surface-container-highest/60 hover:bg-primary/20 hover:text-primary py-3 rounded-lg text-xs font-bold transition-all border border-outline-variant/10 text-on-surface"
                        >
                            🔗 Change Link
                        </button>
                    ) : (
                        <button
                            // onClick={(e) => handleOpenLinkModal(e, asset)}
                            className="flex-1 bg-primary/10 text-primary hover:bg-primary/20 py-3 rounded-lg text-xs font-bold transition-all border border-primary/20"
                        >
                            🔗 Link
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={() => handleDownload(videoUrl)}
                        className="px-3 py-2 bg-surface-container-highest/60 hover:bg-surface-variant rounded-lg transition-all border border-outline-variant/10 text-on-surface-variant hover:text-on-surface">
                        <span className="material-symbols-outlined text-sm">download</span>
                    </button>
                    {!isLinked &&
                        <button
                            type="button"
                            onClick={() => handleDelete(id)}
                            className="px-3 py-2 bg-surface-container-highest/60 hover:bg-error/10 hover:text-error rounded-lg transition-all border border-outline-variant/10 text-on-surface-variant">
                            <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                    }

                </div>
            </div>
        </div>

    )
}

