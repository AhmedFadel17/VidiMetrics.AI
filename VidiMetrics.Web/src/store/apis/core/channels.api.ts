import { mainApi } from '../mainApi';
import { ApiResponse } from '@/types/api';
import { Channel } from '@/types/models/core';

export interface CreateChannelRequest {
  name: string;
  youtubeChannelId?: string;
  description?: string;
  customUrl?: string;
}

export interface UpdateChannelRequest extends CreateChannelRequest {}

export const channelsApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getChannels: builder.query<ApiResponse<Channel[]>, void>({
      query: () => '/api/channels',
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'Channel' as const, id })),
              { type: 'Channel', id: 'LIST' },
            ]
          : [{ type: 'Channel', id: 'LIST' }],
    }),
    getChannelById: builder.query<ApiResponse<Channel>, string>({
      query: (id) => `/api/channels/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'Channel', id }],
    }),
    createChannel: builder.mutation<ApiResponse<Channel>, CreateChannelRequest>({
      query: (body) => ({ url: '/api/channels', method: 'POST', body }),
      invalidatesTags: [{ type: 'Channel', id: 'LIST' }],
    }),
    updateChannel: builder.mutation<ApiResponse<Channel>, { id: string; body: UpdateChannelRequest }>({
      query: ({ id, body }) => ({ url: `/api/channels/${id}`, method: 'PUT', body }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: 'Channel', id },
        { type: 'Channel', id: 'LIST' },
      ],
    }),
    deleteChannel: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/api/channels/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, _err, id) => [
        { type: 'Channel', id },
        { type: 'Channel', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetChannelsQuery,
  useGetChannelByIdQuery,
  useCreateChannelMutation,
  useUpdateChannelMutation,
  useDeleteChannelMutation,
} = channelsApi;
