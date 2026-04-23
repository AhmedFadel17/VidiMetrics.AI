import { mainApi } from '../mainApi';
import { ApiResponse } from '@/types/api';
import { PlaylistItem } from '@/types/models/core';

export interface CreatePlaylistItemRequest {
  position: number;
  note?: string;
  playlistId: string;
  videoId: string;
}

export interface UpdatePlaylistItemRequest extends CreatePlaylistItemRequest {}

export const playlistItemsApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getPlaylistItemsByPlaylist: builder.query<ApiResponse<PlaylistItem[]>, string>({
      query: (playlistId) => `/api/playlistitems?playlistId=${playlistId}`,
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'PlaylistItem' as const, id })),
              { type: 'PlaylistItem', id: 'LIST' },
            ]
          : [{ type: 'PlaylistItem', id: 'LIST' }],
    }),
    getPlaylistItemById: builder.query<ApiResponse<PlaylistItem>, string>({
      query: (id) => `/api/playlistitems/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'PlaylistItem', id }],
    }),
    createPlaylistItem: builder.mutation<ApiResponse<PlaylistItem>, CreatePlaylistItemRequest>({
      query: (body) => ({ url: '/api/playlistitems', method: 'POST', body }),
      invalidatesTags: [{ type: 'PlaylistItem', id: 'LIST' }],
    }),
    updatePlaylistItem: builder.mutation<ApiResponse<PlaylistItem>, { id: string; body: UpdatePlaylistItemRequest }>({
      query: ({ id, body }) => ({ url: `/api/playlistitems/${id}`, method: 'PUT', body }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: 'PlaylistItem', id },
        { type: 'PlaylistItem', id: 'LIST' },
      ],
    }),
    deletePlaylistItem: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/api/playlistitems/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, _err, id) => [
        { type: 'PlaylistItem', id },
        { type: 'PlaylistItem', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetPlaylistItemsByPlaylistQuery,
  useGetPlaylistItemByIdQuery,
  useCreatePlaylistItemMutation,
  useUpdatePlaylistItemMutation,
  useDeletePlaylistItemMutation,
} = playlistItemsApi;
