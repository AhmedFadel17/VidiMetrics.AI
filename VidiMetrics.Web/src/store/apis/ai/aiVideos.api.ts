import { AssetType } from '@/types';
import { mainApi } from '../mainApi';
import { ApiResponse, PaginationFilter, PaginationResponse } from '@/types/api';
import { AiVideo } from '@/types/models/ai';

export interface AiVideoFilterDto extends PaginationFilter {
  assetType?: AssetType | null;
}

export interface CreateSceneVideoDto {
  scenePrompt: string;
  weather: string;
  environmentName: string;
  mood: string;
}

export interface UpdateAiVideoDto {
  videoUrl?: string;
  prompt?: string;
  isLinked: boolean;
}

export const aiVideosApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getAiVideos: builder.query<ApiResponse<PaginationResponse<AiVideo>>, AiVideoFilterDto>({
      query: (filter) => {
        const params = new URLSearchParams();

        Object.entries(filter).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, value.toString());
          }
        });

        return {
          url: '/api/ai/videos',
          params: params,
        };
      },
      providesTags: (result) =>
        result?.data
          ? [
            ...result.data.items.map(({ id }) => ({ type: 'AiVideo' as const, id })),
            { type: 'AiVideo', id: 'LIST' },
          ]
          : [{ type: 'AiVideo', id: 'LIST' }],
    }),
    getAiVideoById: builder.query<ApiResponse<AiVideo>, string>({
      query: (id) => `/api/ai/videos/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'AiVideo', id }],
    }),
    createSceneVideo: builder.mutation<ApiResponse<AiVideo>, CreateSceneVideoDto>({
      query: (body) => ({ url: '/api/ai/videos/scene', method: 'POST', body }),
      invalidatesTags: [{ type: 'AiVideo', id: 'LIST' }],
    }),
    updateAiVideo: builder.mutation<ApiResponse<AiVideo>, { id: string; body: UpdateAiVideoDto }>({
      query: ({ id, body }) => ({ url: `/api/ai/videos/${id}`, method: 'PUT', body }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: 'AiVideo', id },
        { type: 'AiVideo', id: 'LIST' },
      ],
    }),
    deleteAiVideo: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/api/ai/videos/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, _err, id) => [
        { type: 'AiVideo', id },
        { type: 'AiVideo', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetAiVideosQuery,
  useGetAiVideoByIdQuery,
  useCreateSceneVideoMutation,
  useUpdateAiVideoMutation,
  useDeleteAiVideoMutation,
} = aiVideosApi;
