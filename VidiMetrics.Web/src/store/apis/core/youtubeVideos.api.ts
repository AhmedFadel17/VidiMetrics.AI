import { mainApi } from '../mainApi';
import { ApiResponse } from '@/types/api';
import { YouTubeVideo } from '@/types/models/core';
import { YouTubePrivacyStatus } from '@/types/enums';

export interface CreateYouTubeVideoRequest {
  youtubeVideoId: string;
  viewCount: number;
  likeCount: number;
  publishedAt: string;
  privacyStatus?: YouTubePrivacyStatus;
}

export interface UpdateYouTubeVideoRequest extends CreateYouTubeVideoRequest {}

export const youtubeVideosApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getYouTubeVideos: builder.query<ApiResponse<YouTubeVideo[]>, void>({
      query: () => '/api/youtubevideos',
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'YouTubeVideo' as const, id })),
              { type: 'YouTubeVideo', id: 'LIST' },
            ]
          : [{ type: 'YouTubeVideo', id: 'LIST' }],
    }),
    getYouTubeVideoById: builder.query<ApiResponse<YouTubeVideo>, string>({
      query: (id) => `/api/youtubevideos/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'YouTubeVideo', id }],
    }),
    createYouTubeVideo: builder.mutation<ApiResponse<YouTubeVideo>, CreateYouTubeVideoRequest>({
      query: (body) => ({ url: '/api/youtubevideos', method: 'POST', body }),
      invalidatesTags: [{ type: 'YouTubeVideo', id: 'LIST' }],
    }),
    updateYouTubeVideo: builder.mutation<ApiResponse<YouTubeVideo>, { id: string; body: UpdateYouTubeVideoRequest }>({
      query: ({ id, body }) => ({ url: `/api/youtubevideos/${id}`, method: 'PUT', body }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: 'YouTubeVideo', id },
        { type: 'YouTubeVideo', id: 'LIST' },
      ],
    }),
    deleteYouTubeVideo: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/api/youtubevideos/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, _err, id) => [
        { type: 'YouTubeVideo', id },
        { type: 'YouTubeVideo', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetYouTubeVideosQuery,
  useGetYouTubeVideoByIdQuery,
  useCreateYouTubeVideoMutation,
  useUpdateYouTubeVideoMutation,
  useDeleteYouTubeVideoMutation,
} = youtubeVideosApi;
