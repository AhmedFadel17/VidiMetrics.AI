import { Button } from '@/components/ui/Button'
import { CopilotDraftPreviewDto } from '@/types/models/copilot'

type Props = {
    draft: CopilotDraftPreviewDto
    onAccept: () => void
    onReject: () => void
    isLoading?: boolean
}

export default function CopilotDraftPreview({
    draft,
    onAccept,
    onReject,
    isLoading = false,
}: Props) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 shadow-lg">
            <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">
                    {draft.actionType}
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">
                    {draft.entityType}
                </span>
            </div>

            <div className="space-y-3">
                <div>
                    <h4 className="text-sm font-semibold text-white">Draft Summary</h4>
                    <p className="mt-1 text-sm text-white/75">{draft.summary || 'No summary provided.'}</p>
                </div>

                <div>
                    <h4 className="text-sm font-semibold text-white">Payload Preview</h4>
                    <pre className="mt-2 overflow-x-auto rounded-xl bg-black/30 p-3 text-xs text-white/80">
                        {JSON.stringify(draft.payload ?? {}, null, 2)}
                    </pre>
                </div>

                {draft.missingFields.length > 0 && (
                    <div>
                        <h4 className="text-sm font-semibold text-amber-300">Missing Fields</h4>
                        <ul className="mt-1 list-disc pl-5 text-sm text-amber-200/90">
                            {draft.missingFields.map((field) => (
                                <li key={field}>{field}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {draft.validationWarnings.length > 0 && (
                    <div>
                        <h4 className="text-sm font-semibold text-red-300">Warnings</h4>
                        <ul className="mt-1 list-disc pl-5 text-sm text-red-200/90">
                            {draft.validationWarnings.map((warning, index) => (
                                <li key={`${warning}-${index}`}>{warning}</li>
                            ))}
                        </ul>
                    </div>
                )}

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
            </div>
        </div>
    )
}