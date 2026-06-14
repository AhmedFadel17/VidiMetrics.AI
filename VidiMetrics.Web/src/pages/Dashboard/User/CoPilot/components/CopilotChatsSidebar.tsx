import { Button } from '@/components/ui/Button'
import { CopilotChatDto } from '@/types/models/copilot'
import clsx from 'clsx'

type Props = {
    chats: CopilotChatDto[]
    currentChatId: string
    onSelectChat: (chatId: string) => void
    onCreateChat: () => void
    isCreating?: boolean
}

export default function CopilotChatsSidebar({
    chats,
    currentChatId,
    onSelectChat,
    onCreateChat,
    isCreating = false,
}: Props) {
    return (
        <div className="flex flex-col h-full rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden">
            <div className="p-4 border-b border-white/5">
                <Button
                    onClick={onCreateChat}
                    disabled={isCreating}
                    className="w-full rounded-xl"
                >
                    <span className='material-symbols-outlined text-sm'>add</span>
                    New Chat
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {chats.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-white/10 p-4 text-sm text-white/45">
                        No chats yet.
                    </div>
                ) : (
                    chats.map((chat) => (
                        <button
                            key={chat.id}
                            onClick={() => onSelectChat(chat.id)}
                            className={clsx(
                                'w-full rounded-xl border px-3 py-3 text-left transition',
                                currentChatId === chat.id
                                    ? 'border-accent-purple bg-accent-purple/15 text-white'
                                    : 'border-white/5 bg-white/[0.02] text-white/75 hover:bg-white/[0.05]'
                            )}
                        >
                            <div className="truncate text-sm font-medium">{chat.title}</div>
                            <div className="mt-1 text-xs text-white/40">
                                {new Date(chat.updatedAt).toLocaleString()}
                            </div>
                        </button>
                    ))
                )}
            </div>
        </div>
    )
}