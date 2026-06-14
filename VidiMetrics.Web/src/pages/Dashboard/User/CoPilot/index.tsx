import { useEffect, useMemo, useState } from 'react'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import { PageHeader } from '@/components/ui/PageHeader'
import { toast } from 'sonner'
import {
    useCreateCopilotChatMutation,
    useGetCopilotChatDraftsQuery,
    useGetCopilotChatMessagesQuery,
    useGetCopilotChatsQuery,
    useReviewCopilotDraftMutation,
    useSendCopilotMessageMutation,
} from '@/store/apis/ai/copilot.api'
import {
    CopilotDraftPreviewDto,
    CopilotMessageDto,
    SendCopilotMessageResponseDto,
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
    const [latestResponse, setLatestResponse] = useState<SendCopilotMessageResponseDto | null>(null)

    const { data: chatsResponse, isLoading: isLoadingChats } = useGetCopilotChatsQuery()
    const { data: messagesResponse, isLoading: isLoadingMessages } = useGetCopilotChatMessagesQuery(currentChatId, {
        skip: !currentChatId,
    })
    const { data: draftsResponse } = useGetCopilotChatDraftsQuery(currentChatId, {
        skip: !currentChatId,
    })

    const [createChat, { isLoading: isCreatingChat }] = useCreateCopilotChatMutation()
    const [sendMessage, { isLoading: isSendingMessage }] = useSendCopilotMessageMutation()
    const [reviewDraft, { isLoading: isReviewingDraft }] = useReviewCopilotDraftMutation()

    const backendMessages = useMemo(() => messagesResponse?.data ?? [], [messagesResponse])
    const backendDrafts = useMemo(() => draftsResponse?.data ?? [], [draftsResponse])

    useEffect(() => {
        if (!currentChatId) {
            setLocalMessages([
                {
                    id: 'welcome',
                    role: CopilotMessageRole.Assistant,
                    content: 'Welcome. I can help you create, update, get, delete, and review dashboard entities through draft-first actions.',
                    createdAt: new Date().toISOString(),
                    draft: null,
                },
            ])
            return
        }

        const mappedMessages: LocalUiMessage[] = (backendMessages as CopilotMessageDto[]).map((msg) => ({
            id: msg.id,
            role: msg.role,
            content: msg.content,
            createdAt: msg.createdAt,
            draft: null,
        }))

        setLocalMessages(mappedMessages)
    }, [currentChatId, backendMessages])

    const pendingDraftPreview = useMemo<CopilotDraftPreviewDto | null>(() => {
        if (!latestResponse?.draft || latestResponse.chatId !== currentChatId) return null
        return latestResponse.draft
    }, [latestResponse, currentChatId])

    const handleCreateNewChat = async () => {
        try {
            const response = await createChat({
                title: `New Copilot Chat`,
            }).unwrap()

            const createdChat = response.data
            setCurrentChatId(createdChat.id)
            setLatestResponse(null)
            toast.success('New copilot chat created.')
        } catch {
            toast.error('Failed to create chat.')
        }
    }

    const handleSendMessage = async (message: string) => {
        let activeChatId = currentChatId

        try {
            if (!activeChatId) {
                const createResponse = await createChat({
                    title: message.length > 30 ? `${message.slice(0, 30)}...` : message,
                }).unwrap()

                activeChatId = createResponse.data.id
                setCurrentChatId(activeChatId)
            }

            const optimisticUserMessage: LocalUiMessage = {
                id: `user-${Date.now()}`,
                role: CopilotMessageRole.User,
                content: message,
                createdAt: new Date().toISOString(),
            }

            const optimisticAssistantLoading: LocalUiMessage = {
                id: `assistant-loading-${Date.now()}`,
                role: CopilotMessageRole.Assistant,
                content: 'Thinking...',
                createdAt: new Date().toISOString(),
                isLocalLoading: true,
            }

            setLocalMessages((prev) => [...prev, optimisticUserMessage, optimisticAssistantLoading])

            const response = await sendMessage({
                chatId: activeChatId,
                message,
            }).unwrap()

            const result = response.data
            setLatestResponse(result)

            setLocalMessages((prev) => {
                const withoutLoading = prev.filter((x) => !x.isLocalLoading)

                const assistantMessage: LocalUiMessage = {
                    id: result.messageId,
                    role: CopilotMessageRole.Assistant,
                    content: result.message,
                    createdAt: new Date().toISOString(),
                    draft: result.type === CopilotResponseMode.Draft ? result.draft ?? null : null,
                }

                return [...withoutLoading, assistantMessage]
            })
        } catch {
            setLocalMessages((prev) => prev.filter((x) => !x.isLocalLoading))
            toast.error('Failed to send copilot message.')
        }
    }

    const handleAcceptDraft = async (draftId: string) => {
        try {
            const response = await reviewDraft({
                draftId,
                accept: true,
            }).unwrap()

            toast.success(response.data.message)
        } catch {
            toast.error('Failed to execute draft.')
        }
    }

    const handleRejectDraft = async (draftId: string) => {
        try {
            const response = await reviewDraft({
                draftId,
                accept: false,
            }).unwrap()

            toast.success(response.data.message)
        } catch {
            toast.error('Failed to reject draft.')
        }
    }

    const currentPendingDraft = useMemo(() => {
        const latestLocalDraft =
            [...localMessages]
                .reverse()
                .find((m) => m.role === CopilotMessageRole.Assistant && m.draft)?.draft ?? null

        return latestLocalDraft ?? pendingDraftPreview
    }, [localMessages, pendingDraftPreview])

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
            <Breadcrumbs
                items={[
                    { label: 'Home', path: '/dashboard' },
                    { label: 'CoPilot' },
                ]}
            />

            <div className="flex-1 grid grid-cols-4 gap-6 overflow-hidden pb-4">
                <div className="col-span-1 h-full overflow-hidden flex flex-col">
                    <div className="py-4 shrink-0">
                        <PageHeader
                            chipText="Copilot"
                            titlePrefix="AI "
                            gradientText="Agent"
                            description="Manage your story engine dashboard through draft-first AI actions."
                        />
                    </div>
                    {(!isLoadingChats) &&
                        <CopilotChatsSidebar
                            chats={chatsResponse?.data ?? []}
                            currentChatId={currentChatId}
                            onSelectChat={setCurrentChatId}
                            onCreateChat={handleCreateNewChat}
                            isCreating={isCreatingChat}
                        />
                    }
                </div>

                <div className="col-span-3 h-full rounded-2xl bg-gradient-to-b from-white/[0.02] to-transparent border border-white/5 shadow-2xl overflow-hidden flex flex-col p-4 relative backdrop-blur-sm">
                    {currentChatId && isLoadingMessages ? (
                        <div className="flex-1 flex items-center justify-center text-xs font-mono text-white/40 tracking-widest uppercase animate-pulse">
                            Loading chat messages...
                        </div>
                    ) : (
                        <div className="flex-1 overflow-y-auto space-y-6 pr-2 mb-4 scrollbar-thin">
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

                            {!currentPendingDraft && backendDrafts.length > 0 && (
                                <div className="space-y-4">
                                    {backendDrafts
                                        .filter((draft) => draft.status === CopilotDraftStatus.Pending)
                                        .map((draft) => {
                                            let payload: Record<string, unknown> | null = null
                                            let missingFields: string[] = []
                                            let validationWarnings: string[] = []

                                            try {
                                                payload = draft.payloadJson ? JSON.parse(draft.payloadJson) : null
                                            } catch {
                                                payload = null
                                            }

                                            try {
                                                missingFields = draft.missingFieldsJson ? JSON.parse(draft.missingFieldsJson) : []
                                            } catch {
                                                missingFields = []
                                            }

                                            try {
                                                validationWarnings = draft.validationWarningsJson ? JSON.parse(draft.validationWarningsJson) : []
                                            } catch {
                                                validationWarnings = []
                                            }

                                            return (
                                                <CopilotDraftPreview
                                                    key={draft.id}
                                                    draft={{
                                                        draftId: draft.id,
                                                        actionType: draft.actionType,
                                                        entityType: draft.entityType,
                                                        summary: draft.summary,
                                                        payload,
                                                        missingFields,
                                                        validationWarnings,
                                                        canExecute: missingFields.length === 0 && validationWarnings.length === 0,
                                                    }}
                                                    onAccept={() => handleAcceptDraft(draft.id)}
                                                    onReject={() => handleRejectDraft(draft.id)}
                                                    isLoading={isReviewingDraft}
                                                />
                                            )
                                        })}
                                </div>
                            )}
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