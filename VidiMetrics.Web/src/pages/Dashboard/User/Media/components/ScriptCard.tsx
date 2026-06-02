import { AiScript } from "@/types/models/ai";
import { formatDate } from "@/utils/dateFormatter";
import LinkStatusBox from "./LinkStatusBox";

interface ScriptCardProps {
    script: AiScript;
    // setSelectedAsset: (asset: AiImage) => void;
    selected?: boolean;
    handleDelete: (id: string) => void;
    handleDownload: (src: string) => void;
}
export default function ScriptCard({ script, selected = false, handleDelete, handleDownload }: ScriptCardProps) {
    const { id, weather, storyEnvironment, scriptLines, createdAt, isLinked } = script;
    const createdAtRelative = formatDate(createdAt);


    const { referenceImageUrl } = storyEnvironment!;
    const linesCount = scriptLines?.length || 0;
    return (
        <div
            key={id}
            // onClick={() => setSelectedAsset(image)}
            className={`group relative flex flex-col bg-surface-container-low rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer border ${selected ? 'border-primary/50' : 'border-transparent'} hover:shadow-primary/5`}
        >
            <div className="aspect-video relative overflow-hidden">
                <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    src={referenceImageUrl}
                    alt={id}
                />

                <span className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md text-[10px] font-bold px-2 py-1 rounded text-white">{weather}</span>

                <div className="absolute top-3 left-3 flex gap-2">
                    {isLinked ? (
                        <span className={`flex flex-items items-center bg-primary/10 backdrop-blur-md border border-primary/20 text-primary px-2 py-1 rounded gap-1`}>
                            <span className="material-symbols-outlined text-xs">link</span>
                            <span className="text-xs">Linked</span>
                        </span>
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
                    <span>{linesCount} Lines</span>
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
                        onClick={() => handleDownload("")}
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

