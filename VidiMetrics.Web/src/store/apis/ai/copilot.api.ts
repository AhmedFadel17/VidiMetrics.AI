import { ApiResponse } from '@/types/api';
import { mainApi } from '../mainApi';
import {
    CopilotChatDto,
    CopilotDraftDto,
    CopilotMessageDto,
    CreateCopilotChatRequestDto,
    ReviewCopilotDraftRequestDto,
    ReviewCopilotDraftResponseDto,
    SendCopilotMessageRequestDto,
    SendCopilotMessageResponseDto,
} from '@/types/models/copilot';

export const copilotApi = mainApi.injectEndpoints({
    endpoints: (builder) => ({
        createCopilotChat: builder.mutation<
            ApiResponse<CopilotChatDto>,
            CreateCopilotChatRequestDto
        >({
            query: (body) => ({
                url: '/api/copilot/chats',
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'CopilotChat', id: 'LIST' }],
        }),
        sendCopilotMessage: builder.mutation<
            ApiResponse<SendCopilotMessageResponseDto>,
            SendCopilotMessageRequestDto
        >({
            query: (body) => ({
                url: '/api/copilot/message',
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'CopilotMessage', id: 'LIST' }, { type: 'CopilotDraft', id: 'LIST' }],
        }),

        reviewCopilotDraft: builder.mutation<
            ApiResponse<ReviewCopilotDraftResponseDto>,
            ReviewCopilotDraftRequestDto
        >({
            query: (body) => ({
                url: '/api/copilot/drafts/review',
                method: 'POST',
                body,
            }),
            invalidatesTags: [
                { type: 'CopilotDraft', id: 'LIST' },
                { type: 'CopilotMessage', id: 'LIST' },
            ],
        }),

        getCopilotChats: builder.query<ApiResponse<CopilotChatDto[]>, void>({
            query: () => '/api/copilot/chats',
            providesTags: (result) =>
                result?.data
                    ? [
                        ...result.data.map(({ id }) => ({ type: 'CopilotChat' as const, id })),
                        { type: 'CopilotChat', id: 'LIST' },
                    ]
                    : [{ type: 'CopilotChat', id: 'LIST' }],
        }),

        getCopilotChat: builder.query<ApiResponse<CopilotChatDto>, string>({
            query: (chatId) => `/api/copilot/chats/${chatId}`,
            providesTags: (_result, _error, id) => [{ type: 'CopilotChat', id }],
        }),

        getCopilotChatMessages: builder.query<ApiResponse<CopilotMessageDto[]>, string>({
            query: (chatId) => `/api/copilot/chats/${chatId}/messages`,
            providesTags: (result, _error, chatId) =>
                result?.data
                    ? [
                        ...result.data.map(({ id }) => ({ type: 'CopilotMessage' as const, id })),
                        { type: 'CopilotMessage' as const, id: `LIST-${chatId}` },
                        { type: 'CopilotMessage' as const, id: 'LIST' },
                    ]
                    : [
                        { type: 'CopilotMessage' as const, id: `LIST-${chatId}` },
                        { type: 'CopilotMessage' as const, id: 'LIST' },
                    ],
        }),

        getCopilotChatDrafts: builder.query<ApiResponse<CopilotDraftDto[]>, string>({
            query: (chatId) => `/api/copilot/chats/${chatId}/drafts`,
            providesTags: (result, _error, chatId) =>
                result?.data
                    ? [
                        ...result.data.map(({ id }) => ({ type: 'CopilotDraft' as const, id })),
                        { type: 'CopilotDraft', id: `LIST-${chatId}` },
                    ]
                    : [{ type: 'CopilotDraft', id: `LIST-${chatId}` }],
        }),
    }),
});

export const {
    useCreateCopilotChatMutation,
    useSendCopilotMessageMutation,
    useReviewCopilotDraftMutation,
    useGetCopilotChatsQuery,
    useGetCopilotChatQuery,
    useGetCopilotChatMessagesQuery,
    useGetCopilotChatDraftsQuery,
} = copilotApi;