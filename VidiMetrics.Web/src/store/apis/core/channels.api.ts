import { mainApi } from '../mainApi';
import { ApiResponse } from '@/types/api';
import { Channel } from '@/types/models/core';

export interface CreateChannelRequest {
  name: string;
  avatarUrl?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: string;
  isActive?: boolean;
  isConnected?: boolean;
  syncAnalytics?: boolean;
  autoPost?: boolean;
  platform?: number;
  platformChannelId?: string;
}

export interface UpdateChannelRequest {
  name?: string;
  avatarUrl?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: string;
  isActive?: boolean;
  isConnected?: boolean;
  syncAnalytics?: boolean;
  autoPost?: boolean;
  platform?: number;
  platformChannelId?: string;
}

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
    getMyChannels: builder.query<ApiResponse<Channel[]>, void>({
      query: () => `/api/channels/me`,
      providesTags: (result) =>
        result?.data
          ? [
            ...result.data.map(({ id }) => ({ type: 'Channel' as const, id })),
            { type: 'Channel', id: 'MY_LIST' },
          ]
          : [{ type: 'Channel', id: 'MY_LIST' }],
    }),
    createChannel: builder.mutation<ApiResponse<Channel>, CreateChannelRequest>({
      query: (body) => ({ url: '/api/channels', method: 'POST', body }),
      invalidatesTags: [{ type: 'Channel', id: 'LIST' }, { type: 'Channel', id: 'MY_LIST' }],
    }),
    updateChannel: builder.mutation<ApiResponse<Channel>, { id: string; body: UpdateChannelRequest }>({
      query: ({ id, body }) => ({ url: `/api/channels/${id}`, method: 'PUT', body }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: 'Channel', id },
        { type: 'Channel', id: 'LIST' },
        { type: 'Channel', id: 'MY_LIST' },
      ],
    }),
    deleteChannel: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/api/channels/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, _err, id) => [
        { type: 'Channel', id },
        { type: 'Channel', id: 'LIST' },
        { type: 'Channel', id: 'MY_LIST' },
      ],
    }),
  }),
});

export const {
  useGetChannelsQuery,
  useGetChannelByIdQuery,
  useGetMyChannelsQuery,
  useCreateChannelMutation,
  useUpdateChannelMutation,
  useDeleteChannelMutation,
} = channelsApi;
