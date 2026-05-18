import { mainApi } from '../mainApi';
import { ApiResponse } from '@/types/api';
import { AiVideo } from '@/types/models/ai';

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
  useGetAiVideoByIdQuery,
  useCreateSceneVideoMutation,
  useUpdateAiVideoMutation,
  useDeleteAiVideoMutation,
} = aiVideosApi;
