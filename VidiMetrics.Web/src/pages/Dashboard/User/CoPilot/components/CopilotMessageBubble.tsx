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
            {isLoading ? (
                <div className="flex items-center gap-1.5 py-1 px-0.5">
                    <div className="w-2 h-2 rounded-full bg-white/40 animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 rounded-full bg-white/60 animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 rounded-full bg-white/80 animate-bounce"></div>
                </div>
            ) : (
                <div className="whitespace-pre-wrap">{content}</div>
            )}
        </div>
    )
}