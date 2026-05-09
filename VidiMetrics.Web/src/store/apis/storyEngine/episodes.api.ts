import { mainApi } from '../mainApi';
import { ApiResponse, PaginationResponse, PaginationFilter } from '@/types/api';
import { Episode } from '@/types/models/storyEngine';

export interface CreateEpisodeRequest {
  episodeNumber: number;
  title: string;
  plotSummary: string;
  showId: string;
  thumbnailUrl?: string;
  finalVideoId?: string;
}

export interface UpdateEpisodeRequest extends Partial<CreateEpisodeRequest> {}

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
  }),
});

export const {
  useGetEpisodesQuery,
  useGetEpisodeByIdQuery,
  useCreateEpisodeMutation,
  useUpdateEpisodeMutation,
  useDeleteEpisodeMutation,
} = episodesApi;
