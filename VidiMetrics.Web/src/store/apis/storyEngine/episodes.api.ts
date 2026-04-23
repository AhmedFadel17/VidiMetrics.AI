import { mainApi } from '../mainApi';
import { ApiResponse } from '@/types/api';
import { Episode } from '@/types/models/storyEngine';

export interface CreateEpisodeRequest {
  episodeNumber: number;
  title: string;
  plotSummary: string;
  showId: string;
  videoId: string;
}

export interface UpdateEpisodeRequest extends CreateEpisodeRequest {}

export const episodesApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getEpisodesByShow: builder.query<ApiResponse<Episode[]>, string>({
      query: (showId) => `/api/episodes?showId=${showId}`,
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'Episode' as const, id })),
              { type: 'Episode', id: 'LIST' },
            ]
          : [{ type: 'Episode', id: 'LIST' }],
    }),

    getEpisodeById: builder.query<ApiResponse<Episode>, string>({
      query: (id) => `/api/episodes/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'Episode', id }],
    }),

    createEpisode: builder.mutation<ApiResponse<Episode>, CreateEpisodeRequest>({
      query: (body) => ({ url: '/api/episodes', method: 'POST', body }),
      invalidatesTags: [{ type: 'Episode', id: 'LIST' }],
    }),

    updateEpisode: builder.mutation<ApiResponse<Episode>, { id: string; body: UpdateEpisodeRequest }>({
      query: ({ id, body }) => ({ url: `/api/episodes/${id}`, method: 'PUT', body }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: 'Episode', id },
        { type: 'Episode', id: 'LIST' },
      ],
    }),

    deleteEpisode: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/api/episodes/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, _err, id) => [
        { type: 'Episode', id },
        { type: 'Episode', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetEpisodesByShowQuery,
  useGetEpisodeByIdQuery,
  useCreateEpisodeMutation,
  useUpdateEpisodeMutation,
  useDeleteEpisodeMutation,
} = episodesApi;
