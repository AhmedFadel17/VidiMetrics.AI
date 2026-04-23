import { mainApi } from '../mainApi';
import { ApiResponse, PaginationResponse, PaginationFilter } from '@/types/api';
import { Video } from '@/types/models/core';

export interface CreateVideoRequest {
  title: string;
  description?: string;
  duration: string;
  thumbnailUrl?: string;
  channelId: string;
}

export interface UpdateVideoRequest extends CreateVideoRequest {}

export const videosApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getVideos: builder.query<ApiResponse<PaginationResponse<Video>>, PaginationFilter>({
      query: ({ pageNumber, pageSize }) =>
        `/api/videos?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      providesTags: (result) =>
        result?.data?.items
          ? [
              ...result.data.items.map(({ id }) => ({ type: 'Video' as const, id })),
              { type: 'Video', id: 'LIST' },
            ]
          : [{ type: 'Video', id: 'LIST' }],
    }),
    getVideoById: builder.query<ApiResponse<Video>, string>({
      query: (id) => `/api/videos/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'Video', id }],
    }),
    createVideo: builder.mutation<ApiResponse<Video>, CreateVideoRequest>({
      query: (body) => ({ url: '/api/videos', method: 'POST', body }),
      invalidatesTags: [{ type: 'Video', id: 'LIST' }],
    }),
    updateVideo: builder.mutation<ApiResponse<Video>, { id: string; body: UpdateVideoRequest }>({
      query: ({ id, body }) => ({ url: `/api/videos/${id}`, method: 'PUT', body }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: 'Video', id },
        { type: 'Video', id: 'LIST' },
      ],
    }),
    deleteVideo: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/api/videos/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, _err, id) => [
        { type: 'Video', id },
        { type: 'Video', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetVideosQuery,
  useGetVideoByIdQuery,
  useCreateVideoMutation,
  useUpdateVideoMutation,
  useDeleteVideoMutation,
} = videosApi;
