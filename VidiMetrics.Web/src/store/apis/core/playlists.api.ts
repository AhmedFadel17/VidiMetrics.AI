import { mainApi } from '../mainApi';
import { ApiResponse } from '@/types/api';
import { Playlist } from '@/types/models/core';

export interface CreatePlaylistRequest {
  title: string;
  description?: string;
  youtubePlaylistId?: string;
  channelId: string;
}

export interface UpdatePlaylistRequest extends CreatePlaylistRequest {}

export const playlistsApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getPlaylists: builder.query<ApiResponse<Playlist[]>, void>({
      query: () => '/api/playlists',
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'Playlist' as const, id })),
              { type: 'Playlist', id: 'LIST' },
            ]
          : [{ type: 'Playlist', id: 'LIST' }],
    }),
    getPlaylistById: builder.query<ApiResponse<Playlist>, string>({
      query: (id) => `/api/playlists/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'Playlist', id }],
    }),
    createPlaylist: builder.mutation<ApiResponse<Playlist>, CreatePlaylistRequest>({
      query: (body) => ({ url: '/api/playlists', method: 'POST', body }),
      invalidatesTags: [{ type: 'Playlist', id: 'LIST' }],
    }),
    updatePlaylist: builder.mutation<ApiResponse<Playlist>, { id: string; body: UpdatePlaylistRequest }>({
      query: ({ id, body }) => ({ url: `/api/playlists/${id}`, method: 'PUT', body }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: 'Playlist', id },
        { type: 'Playlist', id: 'LIST' },
      ],
    }),
    deletePlaylist: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/api/playlists/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, _err, id) => [
        { type: 'Playlist', id },
        { type: 'Playlist', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetPlaylistsQuery,
  useGetPlaylistByIdQuery,
  useCreatePlaylistMutation,
  useUpdatePlaylistMutation,
  useDeletePlaylistMutation,
} = playlistsApi;
