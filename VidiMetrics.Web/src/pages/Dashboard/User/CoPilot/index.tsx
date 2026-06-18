import { useEffect, useRef, useState } from 'react'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import { PageHeader } from '@/components/ui/PageHeader'
import { toast } from 'sonner'
import {
    useCreateCopilotChatMutation,
    useGetCopilotChatMessagesQuery,
    useGetCopilotChatsQuery,
    useReviewCopilotDraftMutation,
    useSendCopilotMessageMutation,
} from '@/store/apis/ai/copilot.api'
import {
    CopilotDraftPreviewDto,
    CopilotMessageDto,
} from '@/types/models/copilot'
import {
    CopilotDraftStatus,
    CopilotMessageRole,
    CopilotResponseMode,
} from '@/types/enums/copilot'
import CopilotInput from './components/CopilotInput'
import CopilotDraftPreview from './components/CopilotDraftPreview'
import CopilotChatsSidebar from './components/CopilotChatsSidebar'
import CopilotMessageBubble from './components/CopilotMessageBubble'

type LocalUiMessage = {
    id: string
    role: CopilotMessageRole
    content: string
    createdAt: string
    draft?: CopilotDraftPreviewDto | null
    isLocalLoading?: boolean
}

export default function CoPilotPage() {
    const [currentChatId, setCurrentChatId] = useState<string>('')
    const [localMessages, setLocalMessages] = useState<LocalUiMessage[]>([])
    const scrollRef = useRef<HTMLDivElement>(null)

    const { data: chatsResponse, isLoading: isLoadingChats } = useGetCopilotChatsQuery()
    const { data: messagesResponse, isLoading: isLoadingMessages } = useGetCopilotChatMessagesQuery(currentChatId, {
        skip: !currentChatId,
    })

    const [createChat, { isLoading: isCreatingChat }] = useCreateCopilotChatMutation()
    const [sendMessage, { isLoading: isSendingMessage }] = useSendCopilotMessageMutation()
    const [reviewDraft, { isLoading: isReviewingDraft }] = useReviewCopilotDraftMutation()

    // Hydrate local messages from the backend (including draft state)
    useEffect(() => {
        if (!currentChatId) {
            setLocalMessages([
                {
                    id: 'welcome',
                    role: CopilotMessageRole.Assistant,
                    content: 'Welcome! I can help you create, update, get, delete, and review your story engine entities through draft-first AI actions.',
                    createdAt: new Date().toISOString(),
                    draft: null,
                },
            ])
            return
        }

        if (!messagesResponse?.data) return

        const mappedMessages: LocalUiMessage[] = (messagesResponse.data as CopilotMessageDto[]).map((msg) => ({
            id: msg.id,
            role: msg.role,
            content: msg.content,
            createdAt: msg.createdAt,
            // Draft comes pre-hydrated from the backend with full status info
            draft: msg.draft ?? null,
        }))

        setLocalMessages(mappedMessages)
    }, [currentChatId, messagesResponse])

    // Auto-scroll to bottom whenever messages change
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [localMessages])

    const handleCreateNewChat = async () => {
        try {
            const response = await createChat({ title: 'New Copilot Chat' }).unwrap()
            setCurrentChatId(response.data.id)
            toast.success('New copilot chat created.')
        } catch {
            toast.error('Failed to create chat.')
        }
    }

    const handleSelectChat = (chatId: string) => {
        setCurrentChatId(chatId)
    }

    const handleSendMessage = async (message: string) => {
        let activeChatId = currentChatId

        try {
            // Auto-create a chat if none is selected
            if (!activeChatId) {
                const createResponse = await createChat({
                    title: message.length > 30 ? `${message.slice(0, 30)}...` : message,
                }).unwrap()
                activeChatId = createResponse.data.id
                setCurrentChatId(activeChatId)
            }

            // Optimistic UI: show user message + loading indicator
            const optimisticUserId = `user-${Date.now()}`
            const optimisticLoadingId = `assistant-loading-${Date.now()}`

            setLocalMessages((prev) => [
                ...prev,
                {
                    id: optimisticUserId,
                    role: CopilotMessageRole.User,
                    content: message,
                    createdAt: new Date().toISOString(),
                },
                {
                    id: optimisticLoadingId,
                    role: CopilotMessageRole.Assistant,
                    content: 'Thinking...',
                    createdAt: new Date().toISOString(),
                    isLocalLoading: true,
                },
            ])

            const response = await sendMessage({ chatId: activeChatId, message }).unwrap()
            const result = response.data

            // Replace loading bubble with the real assistant message + draft if present
            setLocalMessages((prev) => {
                const withoutLoading = prev.filter((x) => !x.isLocalLoading)
                return [
                    ...withoutLoading,
                    {
                        id: result.messageId,
                        role: CopilotMessageRole.Assistant,
                        content: result.message,
                        createdAt: new Date().toISOString(),
                        draft: result.type === CopilotResponseMode.Draft
                            ? { ...(result.draft!), status: CopilotDraftStatus.Pending }
                            : null,
                    },
                ]
            })
        } catch {
            setLocalMessages((prev) => prev.filter((x) => !x.isLocalLoading))
            toast.error('Failed to send copilot message.')
        }
    }

    const handleAcceptDraft = async (draftId: string) => {
        try {
            const response = await reviewDraft({ draftId, accept: true }).unwrap()
            const result = response.data

            toast.success(result.message)

            // Update the draft in-place: set status to Executed and attach execution result
            setLocalMessages((prev) =>
                prev.map((msg) =>
                    msg.draft?.draftId === draftId
                        ? {
                            ...msg,
                            draft: {
                                ...msg.draft!,
                                status: result.status,
                                executionResultJson:
                                    result.result != null
                                        ? JSON.stringify(result.result)
                                        : msg.draft!.executionResultJson,
                            },
                        }
                        : msg
                )
            )
        } catch {
            toast.error('Failed to execute draft.')
        }
    }

    const handleRejectDraft = async (draftId: string) => {
        try {
            const response = await reviewDraft({ draftId, accept: false }).unwrap()

            toast.success(response.data.message)

            // Update the draft in-place: set status to Rejected
            setLocalMessages((prev) =>
                prev.map((msg) =>
                    msg.draft?.draftId === draftId
                        ? {
                            ...msg,
                            draft: {
                                ...msg.draft!,
                                status: CopilotDraftStatus.Rejected,
                            },
                        }
                        : msg
                )
            )
        } catch {
            toast.error('Failed to reject draft.')
        }
    }

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
            <Breadcrumbs
                items={[
                    { label: 'Home', path: '/dashboard' },
                    { label: 'CoPilot' },
                ]}
            />

            <div className="flex-1 grid grid-cols-4 gap-6 overflow-hidden pb-4">
                {/* Sidebar */}
                <div className="col-span-1 h-full overflow-hidden flex flex-col">
                    <div className="py-4 shrink-0">
                        <PageHeader
                            chipText="Copilot"
                            titlePrefix="AI "
                            gradientText="Agent"
                            description="Manage your story engine dashboard through draft-first AI actions."
                        />
                    </div>
                    {!isLoadingChats && (
                        <CopilotChatsSidebar
                            chats={chatsResponse?.data ?? []}
                            currentChatId={currentChatId}
                            onSelectChat={handleSelectChat}
                            onCreateChat={handleCreateNewChat}
                            isCreating={isCreatingChat}
                        />
                    )}
                </div>

                {/* Chat Area */}
                <div className="col-span-3 h-full rounded-2xl bg-gradient-to-b from-white/[0.02] to-transparent border border-white/5 shadow-2xl overflow-hidden flex flex-col p-4 relative backdrop-blur-sm">
                    {currentChatId && isLoadingMessages ? (
                        <div className="flex-1 flex items-center justify-center text-xs font-mono text-white/40 tracking-widest uppercase animate-pulse">
                            Loading chat messages...
                        </div>
                    ) : (
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto space-y-6 pr-2 mb-4 scrollbar-thin"
                        >
                            {localMessages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex flex-col ${msg.role === CopilotMessageRole.User ? 'items-end' : 'items-start'}`}
                                >
                                    <CopilotMessageBubble
                                        role={msg.role}
                                        content={msg.content}
                                        isLoading={msg.isLocalLoading}
                                    />

                                    {/* Draft card: shows for assistant messages that have a linked draft */}
                                    {msg.role === CopilotMessageRole.Assistant && msg.draft && (
                                        <div className="mt-3 w-full max-w-3xl">
                                            <CopilotDraftPreview
                                                draft={msg.draft}
                                                onAccept={() => handleAcceptDraft(msg.draft!.draftId)}
                                                onReject={() => handleRejectDraft(msg.draft!.draftId)}
                                                isLoading={isReviewingDraft}
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="w-full shrink-0 pt-2 border-t border-white/5 bg-[#0b0c10]/40">
                        <CopilotInput
                            onSend={handleSendMessage}
                            isLoading={isSendingMessage || isCreatingChat}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}