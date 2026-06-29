import { mainApi } from '../mainApi';
import { ApiResponse, PaginationResponse, PaginationFilter } from '@/types/api';
import { Episode } from '@/types/models/storyEngine';

export interface CreateEpisodeRequest {
  episodeNumber: number;
  title: string;
  plotSummary: string;
  showId: string;
}

export interface UpdateEpisodeRequest extends Partial<CreateEpisodeRequest> { }

export interface EpisodeFilter extends PaginationFilter {
  showId?: string;
  searchTerm?: string;
  createdAfter?: string;
  createdBefore?: string;
}

export const episodesApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getEpisodes: builder.query<ApiResponse<PaginationResponse<Episode>>, EpisodeFilter>({
      query: (filter) => {
        const params = new URLSearchParams();

        Object.entries(filter).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, value.toString());
          }
        });

        return {
          url: '/api/episodes',
          params: params,
        };
      },
      providesTags: (result) =>
        result?.data?.items
          ? [
            ...result.data.items.map(({ id }) => ({ type: 'Episode' as const, id })),
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

    stitchEpisodeVideo: builder.mutation<ApiResponse<Episode>, string>({
      query: (id) => ({ url: `/api/episodes/${id}/stitch`, method: 'POST' }),
      invalidatesTags: (_result, _err, id) => [
        { type: 'Episode', id },
        { type: 'Episode', id: 'LIST' },
      ],
    }),

    reorderScenes: builder.mutation<ApiResponse<boolean>, { episodeId: string; sceneIds: string[] }>({
      query: ({ episodeId, sceneIds }) => ({
        url: `/api/episodes/${episodeId}/scenes/reorder`,
        method: 'PUT',
        body: { sceneIds },
      }),
      invalidatesTags: (_result, _err, { episodeId }) => [
        { type: 'Scene', id: 'LIST' },
        { type: 'Episode', id: episodeId },
      ],
    }),
  }),
});

export const {
  useGetEpisodesQuery,
  useGetEpisodeByIdQuery,
  useCreateEpisodeMutation,
  useUpdateEpisodeMutation,
  useDeleteEpisodeMutation,
  useStitchEpisodeVideoMutation,
  useReorderScenesMutation,
} = episodesApi;
