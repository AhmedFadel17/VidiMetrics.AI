import { mainApi } from '../mainApi';
import { ApiResponse, PaginationFilter } from '@/types/api';
import { AiImage } from '@/types/models/ai';

export interface AiImageFilterDto extends PaginationFilter {

}

export interface CreateEnvironmentImageDto {
  name: string;
  visualDescription: string;
  atmosphere: string;
}

export interface CreateCharacterImageDto {
  name: string;
  physicalDescription: string;
  clothingStyle: string;
  personalityTraits: string;
  role: string;
}

export interface UpdateAiImageDto {
  imageUrl?: string;
  prompt?: string;
  seed?: number;
  isLinked?: boolean;
}

export const aiImagesApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getAiImages: builder.query<ApiResponse<AiImage[]>, AiImageFilterDto | void>({
      query: (params) => ({
        url: '/api/ai/images',
        params: params || undefined,
      }),
      providesTags: (result) =>
        result?.data
          ? [
            ...result.data.map(({ id }) => ({ type: 'AiImage' as const, id })),
            { type: 'AiImage', id: 'LIST' },
          ]
          : [{ type: 'AiImage', id: 'LIST' }],
    }),
    getAiImageById: builder.query<ApiResponse<AiImage>, string>({
      query: (id) => `/api/ai/images/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'AiImage', id }],
    }),
    createEnvironmentImage: builder.mutation<ApiResponse<AiImage>, CreateEnvironmentImageDto>({
      query: (body) => ({ url: '/api/ai/images/environment', method: 'POST', body }),
      invalidatesTags: [{ type: 'AiImage', id: 'LIST' }],
    }),
    createCharacterImage: builder.mutation<ApiResponse<AiImage>, CreateCharacterImageDto>({
      query: (body) => ({ url: '/api/ai/images/character', method: 'POST', body }),
      invalidatesTags: [{ type: 'AiImage', id: 'LIST' }],
    }),
    updateAiImage: builder.mutation<ApiResponse<AiImage>, { id: string; body: UpdateAiImageDto }>({
      query: ({ id, body }) => ({ url: `/api/ai/images/${id}`, method: 'PUT', body }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: 'AiImage', id },
        { type: 'AiImage', id: 'LIST' },
      ],
    }),
    deleteAiImage: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/api/ai/images/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, _err, id) => [
        { type: 'AiImage', id },
        { type: 'AiImage', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetAiImagesQuery,
  useGetAiImageByIdQuery,
  useCreateEnvironmentImageMutation,
  useCreateCharacterImageMutation,
  useUpdateAiImageMutation,
  useDeleteAiImageMutation,
} = aiImagesApi;
