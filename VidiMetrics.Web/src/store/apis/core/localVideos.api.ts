import { mainApi } from '../mainApi';
import { ApiResponse } from '@/types/api';
import { LocalVideo } from '@/types/models/core';

export interface CreateLocalVideoRequest {
  storageUrl: string;
  fileExtension: string;
  fileSizeInBytes: number;
}

export interface UpdateLocalVideoRequest extends CreateLocalVideoRequest {
  isProcessedByAi: boolean;
  processingError?: string;
}

export const localVideosApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getLocalVideos: builder.query<ApiResponse<LocalVideo[]>, void>({
      query: () => '/api/localvideos',
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'LocalVideo' as const, id })),
              { type: 'LocalVideo', id: 'LIST' },
            ]
          : [{ type: 'LocalVideo', id: 'LIST' }],
    }),
    getLocalVideoById: builder.query<ApiResponse<LocalVideo>, string>({
      query: (id) => `/api/localvideos/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'LocalVideo', id }],
    }),
    createLocalVideo: builder.mutation<ApiResponse<LocalVideo>, CreateLocalVideoRequest>({
      query: (body) => ({ url: '/api/localvideos', method: 'POST', body }),
      invalidatesTags: [{ type: 'LocalVideo', id: 'LIST' }],
    }),
    updateLocalVideo: builder.mutation<ApiResponse<LocalVideo>, { id: string; body: UpdateLocalVideoRequest }>({
      query: ({ id, body }) => ({ url: `/api/localvideos/${id}`, method: 'PUT', body }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: 'LocalVideo', id },
        { type: 'LocalVideo', id: 'LIST' },
      ],
    }),
    deleteLocalVideo: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/api/localvideos/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, _err, id) => [
        { type: 'LocalVideo', id },
        { type: 'LocalVideo', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetLocalVideosQuery,
  useGetLocalVideoByIdQuery,
  useCreateLocalVideoMutation,
  useUpdateLocalVideoMutation,
  useDeleteLocalVideoMutation,
} = localVideosApi;
