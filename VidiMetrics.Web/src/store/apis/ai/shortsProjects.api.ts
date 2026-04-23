import { mainApi } from '../mainApi';
import { ApiResponse } from '@/types/api';
import { ShortsProject } from '@/types/models/ai';

export interface CreateShortsProjectRequest {
  title: string;
  sourceVideoId: string;
  settingsJson: string;
}

export interface UpdateShortsProjectRequest extends CreateShortsProjectRequest {}

export const shortsProjectsApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getShortsProjects: builder.query<ApiResponse<ShortsProject[]>, void>({
      query: () => '/api/shortsprojects',
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'ShortsProject' as const, id })),
              { type: 'ShortsProject', id: 'LIST' },
            ]
          : [{ type: 'ShortsProject', id: 'LIST' }],
    }),
    getShortsProjectById: builder.query<ApiResponse<ShortsProject>, string>({
      query: (id) => `/api/shortsprojects/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'ShortsProject', id }],
    }),
    createShortsProject: builder.mutation<ApiResponse<ShortsProject>, CreateShortsProjectRequest>({
      query: (body) => ({ url: '/api/shortsprojects', method: 'POST', body }),
      invalidatesTags: [{ type: 'ShortsProject', id: 'LIST' }],
    }),
    updateShortsProject: builder.mutation<ApiResponse<ShortsProject>, { id: string; body: UpdateShortsProjectRequest }>({
      query: ({ id, body }) => ({ url: `/api/shortsprojects/${id}`, method: 'PUT', body }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: 'ShortsProject', id },
        { type: 'ShortsProject', id: 'LIST' },
      ],
    }),
    deleteShortsProject: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/api/shortsprojects/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, _err, id) => [
        { type: 'ShortsProject', id },
        { type: 'ShortsProject', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetShortsProjectsQuery,
  useGetShortsProjectByIdQuery,
  useCreateShortsProjectMutation,
  useUpdateShortsProjectMutation,
  useDeleteShortsProjectMutation,
} = shortsProjectsApi;
