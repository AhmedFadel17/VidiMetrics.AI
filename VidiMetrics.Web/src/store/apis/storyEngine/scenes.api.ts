import { mainApi } from '../mainApi';
import { ApiResponse, PaginationResponse, PaginationFilter } from '@/types/api';
import { Scene } from '@/types/models/storyEngine';

export interface CreateSceneRequest {
  order: number;
  episodeId: string;
  characterIds?: string[];
  aiScriptId?: string;
  aiVideoId?: string;
}

export interface UpdateSceneRequest extends Partial<CreateSceneRequest> { }

export interface SceneFilter extends PaginationFilter {
  episodeId?: string;
  showId?: string;
  storyEnvironmentId?: string;
  createdAfter?: string;
  createdBefore?: string;
}

export const scenesApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getScenes: builder.query<ApiResponse<PaginationResponse<Scene>>, SceneFilter>({
      query: (filter) => {
        const params = new URLSearchParams();

        Object.entries(filter).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, value.toString());
          }
        });

        return {
          url: '/api/scenes',
          params: params,
        };
      },
      providesTags: (result) =>
        result?.data?.items
          ? [
            ...result.data.items.map(({ id }) => ({ type: 'Scene' as const, id })),
            { type: 'Scene', id: 'LIST' },
          ]
          : [{ type: 'Scene', id: 'LIST' }],
    }),

    getSceneById: builder.query<ApiResponse<Scene>, string>({
      query: (id) => `/api/scenes/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'Scene', id }],
    }),

    createScene: builder.mutation<ApiResponse<Scene>, CreateSceneRequest>({
      query: (body) => ({ url: '/api/scenes', method: 'POST', body }),
      invalidatesTags: [{ type: 'Scene', id: 'LIST' }],
    }),

    updateScene: builder.mutation<ApiResponse<Scene>, { id: string; body: UpdateSceneRequest }>({
      query: ({ id, body }) => ({ url: `/api/scenes/${id}`, method: 'PUT', body }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: 'Scene', id },
        { type: 'Scene', id: 'LIST' },
      ],
    }),

    deleteScene: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/api/scenes/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, _err, id) => [
        { type: 'Scene', id },
        { type: 'Scene', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetScenesQuery,
  useGetSceneByIdQuery,
  useCreateSceneMutation,
  useUpdateSceneMutation,
  useDeleteSceneMutation,
} = scenesApi;
