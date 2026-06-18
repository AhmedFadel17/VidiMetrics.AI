import { mainApi } from '../mainApi';
import { ApiResponse, PaginationResponse, PaginationFilter } from '@/types/api';
import { ChannelPost } from '@/types/models/core';

export interface CreateChannelPostRequest {
  title: string;
  description?: string;
  thumbnailUrl?: string;
  videoUrl: string;
  channelId: string;
  scheduledAt?: string;
  status?: number;
}

export interface UpdateChannelPostRequest {
  title?: string;
  description?: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  channelId?: string;
  scheduledAt?: string;
  status?: number;
}

export interface ChannelPostFilterDto extends PaginationFilter {
  channelId?: string;
  status?: number;
  sourceEntityType?: number;
  sourceEntityId?: string;
  showId?: string;
}

export const channelPostsApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getChannelPosts: builder.query<ApiResponse<PaginationResponse<ChannelPost>>, ChannelPostFilterDto>({
      query: (filter) => {
        const params = new URLSearchParams();

        Object.entries(filter).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, value.toString());
          }
        });

        return {
          url: '/api/channel/posts',
          params: params,
        };
      },
      providesTags: (result) =>
        result?.data?.items
          ? [
            ...result.data.items.map(({ id }) => ({ type: 'ChannelPost' as const, id })),
            { type: 'ChannelPost', id: 'LIST' },
          ]
          : [{ type: 'ChannelPost', id: 'LIST' }],
    }),
    getChannelPostById: builder.query<ApiResponse<ChannelPost>, string>({
      query: (id) => `/api/channel/posts/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'ChannelPost', id }],
    }),
    createChannelPost: builder.mutation<ApiResponse<ChannelPost>, CreateChannelPostRequest>({
      query: (body) => ({ url: '/api/channel/posts', method: 'POST', body }),
      invalidatesTags: [{ type: 'ChannelPost', id: 'LIST' }],
    }),
    updateChannelPost: builder.mutation<ApiResponse<ChannelPost>, { id: string; body: UpdateChannelPostRequest }>({
      query: ({ id, body }) => ({ url: `/api/channel/posts/${id}`, method: 'PUT', body }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: 'ChannelPost', id },
        { type: 'ChannelPost', id: 'LIST' },
      ],
    }),
    deleteChannelPost: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/api/channel/posts/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, _err, id) => [
        { type: 'ChannelPost', id },
        { type: 'ChannelPost', id: 'LIST' },
      ],
    }),
    createDraftEpisodePost: builder.mutation<ApiResponse<ChannelPost>, { channelId: string; episodeId: string; scheduledAt?: string }>({
      query: (body) => ({ url: '/api/channel/posts/draft/episode', method: 'POST', body }),
      invalidatesTags: [{ type: 'ChannelPost', id: 'LIST' }],
    }),
    createDraftScenePost: builder.mutation<ApiResponse<ChannelPost>, { channelId: string; sceneId: string; scheduledAt?: string }>({
      query: (body) => ({ url: '/api/channel/posts/draft/scene', method: 'POST', body }),
      invalidatesTags: [{ type: 'ChannelPost', id: 'LIST' }],
    }),
    schedulePost: builder.mutation<ApiResponse<boolean>, { id: string; scheduledAt: string }>({
      query: ({ id, scheduledAt }) => ({ url: `/api/channel/posts/${id}/schedule`, method: 'POST', body: { scheduledAt } }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: 'ChannelPost', id },
        { type: 'ChannelPost', id: 'LIST' },
      ],
    }),
    publishPost: builder.mutation<ApiResponse<boolean>, string>({
      query: (id) => ({ url: `/api/channel/posts/${id}/publish`, method: 'POST' }),
      invalidatesTags: (_result, _err, id) => [
        { type: 'ChannelPost', id },
        { type: 'ChannelPost', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetChannelPostsQuery,
  useGetChannelPostByIdQuery,
  useCreateChannelPostMutation,
  useUpdateChannelPostMutation,
  useDeleteChannelPostMutation,
  useCreateDraftEpisodePostMutation,
  useCreateDraftScenePostMutation,
  useSchedulePostMutation,
  usePublishPostMutation,
} = channelPostsApi;
