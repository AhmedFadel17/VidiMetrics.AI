import { Button } from '@/components/ui/Button'
import { CopilotDraftPreviewDto } from '@/types/models/copilot'
import { CopilotDraftStatus, CopilotEntityType } from '@/types/enums/copilot'
import SeriesCard from '@/components/ui/Cards/SeriesCard'
import CharacterCard from '@/components/ui/Cards/CharacterCard'
import LocationCard from '@/components/ui/Cards/LocationCard'
import EpisodeCard from '@/components/ui/Cards/EposideCard'
import SceneCard from '@/components/ui/Cards/SceneCard'

type Props = {
    draft: CopilotDraftPreviewDto
    onAccept: () => void
    onReject: () => void
    isLoading?: boolean
}

function keysToCamel(obj: any): any {
    if (Array.isArray(obj)) {
        return obj.map(v => keysToCamel(v));
    } else if (obj !== null && obj !== undefined && obj.constructor === Object) {
        return Object.keys(obj).reduce((result, key) => {
            const camelKey = key.charAt(0).toLowerCase() + key.slice(1);
            result[camelKey] = keysToCamel(obj[key]);
            return result;
        }, {} as any);
    }
    return obj;
}

export default function CopilotDraftPreview({
    draft,
    onAccept,
    onReject,
    isLoading = false,
}: Props) {
    const isPending = draft.status === CopilotDraftStatus.Pending;
    const isExecuted = draft.status === CopilotDraftStatus.Executed;
    const isRejected = draft.status === CopilotDraftStatus.Rejected;
    const isFailed = draft.status === CopilotDraftStatus.Failed;

    let resultData: any = null;
    if (isExecuted && draft.executionResultJson) {
        try {
            const parsedData = JSON.parse(draft.executionResultJson);
            resultData = keysToCamel(parsedData);
        } catch (e) {
            console.error("Failed to parse executionResultJson", e);
        }
    }

    const renderExecutionCard = () => {
        if (!isExecuted || !resultData) return null;

        switch (draft.entityType) {
            case CopilotEntityType.Show:
                return (
                    <div className="mt-4 border-t border-white/5 pt-4">
                        <p className="text-xs font-bold text-accent-cyan uppercase tracking-widest mb-3">Created Show</p>
                        <div className="max-w-sm">
                            <SeriesCard show={resultData} />
                        </div>
                    </div>
                );
            case CopilotEntityType.Character:
                return (
                    <div className="mt-4 border-t border-white/5 pt-4">
                        <p className="text-xs font-bold text-accent-purple uppercase tracking-widest mb-3">Created Character</p>
                        <div className="max-w-md">
                            <CharacterCard character={resultData} />
                        </div>
                    </div>
                );
            case CopilotEntityType.Location:
                return (
                    <div className="mt-4 border-t border-white/5 pt-4">
                        <p className="text-xs font-bold text-accent-cyan uppercase tracking-widest mb-3">Created Location</p>
                        <div className="max-w-md">
                            <LocationCard location={resultData} />
                        </div>
                    </div>
                );
            case CopilotEntityType.Episode:
                return (
                    <div className="mt-4 border-t border-white/5 pt-4">
                        <p className="text-xs font-bold text-accent-cyan uppercase tracking-widest mb-3">Created Episode</p>
                        <div className="max-w-sm">
                            <EpisodeCard episode={resultData} />
                        </div>
                    </div>
                );
            case CopilotEntityType.Scene:
                const sceneData = {
                    ...resultData,
                    visualPrompt: resultData.visualPrompt || resultData.name || "Scene",
                    script: resultData.script || (resultData.aiScript?.scriptLines?.[0]?.content || "Scene Sequence")
                };
                return (
                    <div className="mt-4 border-t border-white/5 pt-4">
                        <p className="text-xs font-bold text-accent-cyan uppercase tracking-widest mb-3">Created Scene</p>
                        <div className="max-w-md">
                            <SceneCard scene={sceneData} />
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 shadow-lg">
            <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">
                    {CopilotEntityType[draft.entityType]}
                </span>
            </div>

            <div className="space-y-3">
                <div>
                    <h4 className="text-sm font-semibold text-white">Draft Summary</h4>
                    <p className="mt-1 text-sm text-white/75">{draft.summary || 'No summary provided.'}</p>
                </div>

                {draft.payload && (
                    <div>
                        <h4 className="text-sm font-semibold text-white">Payload Preview</h4>
                        <pre className="mt-2 overflow-x-auto rounded-xl bg-black/30 p-3 text-xs text-white/80">
                            {JSON.stringify(draft.payload ?? {}, null, 2)}
                        </pre>
                    </div>
                )}

                {draft.missingFields && draft.missingFields.length > 0 && (
                    <div>
                        <h4 className="text-sm font-semibold text-amber-300">Missing Fields</h4>
                        <ul className="mt-1 list-disc pl-5 text-sm text-amber-200/90">
                            {draft.missingFields.map((field) => (
                                <li key={field}>{field}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {draft.validationWarnings && draft.validationWarnings.length > 0 && (
                    <div>
                        <h4 className="text-sm font-semibold text-red-300">Warnings</h4>
                        <ul className="mt-1 list-disc pl-5 text-sm text-red-200/90">
                            {draft.validationWarnings.map((warning, index) => (
                                <li key={`${warning}-${index}`}>{warning}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {isPending && (
                    <div className="flex items-center gap-3 pt-2">
                        <Button
                            onClick={onAccept}
                            disabled={isLoading}
                            className="rounded-xl"
                        >
                            Accept
                        </Button>

                        <Button
                            variant="outline"
                            onClick={onReject}
                            disabled={isLoading}
                            className="rounded-xl border-white/15 bg-transparent text-white hover:bg-white/5"
                        >
                            Reject
                        </Button>
                    </div>
                )}

                {isExecuted && (
                    <div className="flex items-center gap-2 rounded-xl border border-emerald-500/10 bg-emerald-500/5 px-3 py-2 text-xs font-bold text-emerald-400 w-fit">
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                        Draft Executed Successfully
                    </div>
                )}

                {isRejected && (
                    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-white/60 w-fit">
                        <span className="material-symbols-outlined text-sm">cancel</span>
                        Draft Rejected
                    </div>
                )}

                {isFailed && (
                    <div className="flex flex-col gap-1 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-400">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">error</span>
                            Execution Failed
                        </div>
                        {draft.errorMessage && (
                            <p className="font-mono text-[10px] text-red-300/80 mt-1">{draft.errorMessage}</p>
                        )}
                    </div>
                )}

                {renderExecutionCard()}
            </div>
        </div>
    )
}