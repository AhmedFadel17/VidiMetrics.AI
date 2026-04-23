import { mainApi } from '../mainApi';
import { ApiResponse } from '@/types/api';
import { StoryEnvironment } from '@/types/models/storyEngine';

export interface CreateStoryEnvironmentRequest {
  name: string;
  visualDescription: string;
  atmosphere: string;
  referenceImageUrl?: string;
  showId: string;
}

export interface UpdateStoryEnvironmentRequest extends CreateStoryEnvironmentRequest {}

export const storyEnvironmentsApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getEnvironmentsByShow: builder.query<ApiResponse<StoryEnvironment[]>, string>({
      query: (showId) => `/api/storyenvironments?showId=${showId}`,
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'StoryEnvironment' as const, id })),
              { type: 'StoryEnvironment', id: 'LIST' },
            ]
          : [{ type: 'StoryEnvironment', id: 'LIST' }],
    }),

    getEnvironmentById: builder.query<ApiResponse<StoryEnvironment>, string>({
      query: (id) => `/api/storyenvironments/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'StoryEnvironment', id }],
    }),

    createEnvironment: builder.mutation<ApiResponse<StoryEnvironment>, CreateStoryEnvironmentRequest>({
      query: (body) => ({ url: '/api/storyenvironments', method: 'POST', body }),
      invalidatesTags: [{ type: 'StoryEnvironment', id: 'LIST' }],
    }),

    updateEnvironment: builder.mutation<ApiResponse<StoryEnvironment>, { id: string; body: UpdateStoryEnvironmentRequest }>({
      query: ({ id, body }) => ({ url: `/api/storyenvironments/${id}`, method: 'PUT', body }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: 'StoryEnvironment', id },
        { type: 'StoryEnvironment', id: 'LIST' },
      ],
    }),

    deleteEnvironment: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/api/storyenvironments/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, _err, id) => [
        { type: 'StoryEnvironment', id },
        { type: 'StoryEnvironment', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetEnvironmentsByShowQuery,
  useGetEnvironmentByIdQuery,
  useCreateEnvironmentMutation,
  useUpdateEnvironmentMutation,
  useDeleteEnvironmentMutation,
} = storyEnvironmentsApi;
