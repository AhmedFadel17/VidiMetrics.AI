import { AssetType } from '@/types';
import { mainApi } from '../mainApi';
import { ApiResponse, PaginationFilter, PaginationResponse } from '@/types/api';
import { AiImage } from '@/types/models/ai';

export interface AiImageFilterDto extends PaginationFilter {
  assetType?: AssetType | null;
}

export interface CreateLocationImageDto {
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

export interface CreateSeriesImageDto {
  title: string;
  description: string;
  visualStyle: string;
  targetAudience: string;
}

export interface UpdateAiImageDto {
  imageUrl?: string;
  prompt?: string;
  seed?: number;
  isLinked?: boolean;
}

export const aiImagesApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getAiImages: builder.query<ApiResponse<PaginationResponse<AiImage>>, AiImageFilterDto>({
      query: (filter) => {
        const params = new URLSearchParams();

        Object.entries(filter).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, value.toString());
          }
        });

        return {
          url: '/api/ai/images',
          params: params,
        };
      },
      providesTags: (result) =>
        result?.data
          ? [
            ...result.data.items.map(({ id }) => ({ type: 'AiImage' as const, id })),
            { type: 'AiImage', id: 'LIST' },
          ]
          : [{ type: 'AiImage', id: 'LIST' }],
    }),
    getAiImageById: builder.query<ApiResponse<AiImage>, string>({
      query: (id) => `/api/ai/images/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'AiImage', id }],
    }),
    createLocationImage: builder.mutation<ApiResponse<AiImage>, CreateLocationImageDto>({
      query: (body) => ({ url: '/api/ai/images/location', method: 'POST', body }),
      invalidatesTags: [{ type: 'AiImage', id: 'LIST' }],
    }),
    createCharacterImage: builder.mutation<ApiResponse<AiImage>, CreateCharacterImageDto>({
      query: (body) => ({ url: '/api/ai/images/character', method: 'POST', body }),
      invalidatesTags: [{ type: 'AiImage', id: 'LIST' }],
    }),
    createSeriesImage: builder.mutation<ApiResponse<AiImage>, CreateSeriesImageDto>({
      query: (body) => ({ url: '/api/ai/images/show', method: 'POST', body }),
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
  useCreateLocationImageMutation,
  useCreateCharacterImageMutation,
  useCreateSeriesImageMutation,
  useUpdateAiImageMutation,
  useDeleteAiImageMutation,
} = aiImagesApi;
