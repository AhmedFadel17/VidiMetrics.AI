import { mainApi } from '../mainApi';
import { ApiResponse, PaginationResponse, PaginationFilter } from '@/types/api';
import { StoryEnvironment } from '@/types/models/storyEngine';

export interface CreateStoryEnvironmentRequest {
  name: string;
  visualDescription: string;
  atmosphere: string;
  referenceImageUrl?: string;
  showId: string;
}

export interface UpdateStoryEnvironmentRequest extends Partial<CreateStoryEnvironmentRequest> {}

export interface StoryEnvironmentFilter extends PaginationFilter {
  showId?: string;
  createdAfter?: string;
  createdBefore?: string;
}

export const storyEnvironmentsApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getEnvironments: builder.query<ApiResponse<PaginationResponse<StoryEnvironment>>, StoryEnvironmentFilter>({
      query: (filter) => {
        const params = new URLSearchParams();

        Object.entries(filter).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, value.toString());
          }
        });

        return {
          url: '/api/storyenvironments',
          params: params,
        };
      },
      providesTags: (result) =>
        result?.data?.items
          ? [
              ...result.data.items.map(({ id }) => ({ type: 'StoryEnvironment' as const, id })),
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
  useGetEnvironmentsQuery,
  useGetEnvironmentByIdQuery,
  useCreateEnvironmentMutation,
  useUpdateEnvironmentMutation,
  useDeleteEnvironmentMutation,
} = storyEnvironmentsApi;
