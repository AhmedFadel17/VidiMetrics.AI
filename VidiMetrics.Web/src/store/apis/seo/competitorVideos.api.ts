import { mainApi } from '../mainApi';
import { ApiResponse } from '@/types/api';
import { CompetitorVideo } from '@/types/models/seo';

export interface CreateCompetitorVideoRequest {
  title: string;
  youtubeVideoId: string;
  viewCount: number;
  publishedAt: string;
}

export interface UpdateCompetitorVideoRequest extends CreateCompetitorVideoRequest {}

export const competitorVideosApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getCompetitorVideos: builder.query<ApiResponse<CompetitorVideo[]>, void>({
      query: () => '/api/competitorvideos',
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'CompetitorVideo' as const, id })),
              { type: 'CompetitorVideo', id: 'LIST' },
            ]
          : [{ type: 'CompetitorVideo', id: 'LIST' }],
    }),
    getCompetitorVideoById: builder.query<ApiResponse<CompetitorVideo>, string>({
      query: (id) => `/api/competitorvideos/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'CompetitorVideo', id }],
    }),
    createCompetitorVideo: builder.mutation<ApiResponse<CompetitorVideo>, CreateCompetitorVideoRequest>({
      query: (body) => ({ url: '/api/competitorvideos', method: 'POST', body }),
      invalidatesTags: [{ type: 'CompetitorVideo', id: 'LIST' }],
    }),
    updateCompetitorVideo: builder.mutation<ApiResponse<CompetitorVideo>, { id: string; body: UpdateCompetitorVideoRequest }>({
      query: ({ id, body }) => ({ url: `/api/competitorvideos/${id}`, method: 'PUT', body }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: 'CompetitorVideo', id },
        { type: 'CompetitorVideo', id: 'LIST' },
      ],
    }),
    deleteCompetitorVideo: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/api/competitorvideos/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, _err, id) => [
        { type: 'CompetitorVideo', id },
        { type: 'CompetitorVideo', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetCompetitorVideosQuery,
  useGetCompetitorVideoByIdQuery,
  useCreateCompetitorVideoMutation,
  useUpdateCompetitorVideoMutation,
  useDeleteCompetitorVideoMutation,
} = competitorVideosApi;
