import { mainApi } from '../mainApi';
import { ApiResponse, PaginationFilter } from '@/types/api';
import { Channel } from '@/types/models/core';

export interface CreateChannelPostRequest {
  name: string;
  youtubeChannelId?: string;
  description?: string;
  customUrl?: string;
}
export interface ChannelPostFilterDto extends PaginationFilter {
  channelId?: string;
}
export interface UpdateChannelPostRequest extends CreateChannelPostRequest { }

export const channelPostsApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getChannelPosts: builder.query<ApiResponse<Channel[]>, ChannelPostFilterDto>({
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
        result?.data
          ? [
            ...result.data.map(({ id }) => ({ type: 'ChannelPost' as const, id })),
            { type: 'ChannelPost', id: 'LIST' },
          ]
          : [{ type: 'ChannelPost', id: 'LIST' }],
    }),
    getChannelPostById: builder.query<ApiResponse<Channel>, string>({
      query: (id) => `/api/channel/posts/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'ChannelPost', id }],
    }),
    createChannelPost: builder.mutation<ApiResponse<Channel>, CreateChannelPostRequest>({
      query: (body) => ({ url: '/api/channel/posts', method: 'POST', body }),
      invalidatesTags: [{ type: 'ChannelPost', id: 'LIST' }],
    }),
    updateChannelPost: builder.mutation<ApiResponse<Channel>, { id: string; body: UpdateChannelPostRequest }>({
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
  }),
});

export const {
  useGetChannelPostsQuery,
  useGetChannelPostByIdQuery,
  useCreateChannelPostMutation,
  useUpdateChannelPostMutation,
  useDeleteChannelPostMutation,
} = channelPostsApi;
