import { CopilotMessageRole } from '@/types/enums/copilot'

type Props = {
    role: CopilotMessageRole
    content: string
    isLoading?: boolean
}

export default function CopilotMessageBubble({ role, content, isLoading = false }: Props) {
    const isUser = role === CopilotMessageRole.User

    return (
        <div
            className={`max-w-xl rounded-2xl px-4 py-3 text-sm font-medium leading-relaxed shadow-md ${isUser
                ? 'bg-accent-purple text-white rounded-tr-none'
                : 'bg-white/5 border border-white/5 text-white/90 rounded-tl-none'
                }`}
        >
            <div className="flex items-center gap-2">
                {isLoading &&
                    <span className="material-symbols-outlined text-sm text-white">loader</span>}
                <span>{content}</span>
            </div>
        </div>
    )
}