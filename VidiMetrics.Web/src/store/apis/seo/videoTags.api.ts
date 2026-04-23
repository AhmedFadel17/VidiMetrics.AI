import { mainApi } from '../mainApi';
import { ApiResponse } from '@/types/api';
import { VideoTag } from '@/types/models/seo';

export interface CreateVideoTagRequest {
  name: string;
}

export interface UpdateVideoTagRequest extends CreateVideoTagRequest {}

export const videoTagsApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getVideoTags: builder.query<ApiResponse<VideoTag[]>, void>({
      query: () => '/api/videotags',
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'VideoTag' as const, id })),
              { type: 'VideoTag', id: 'LIST' },
            ]
          : [{ type: 'VideoTag', id: 'LIST' }],
    }),
    getVideoTagById: builder.query<ApiResponse<VideoTag>, string>({
      query: (id) => `/api/videotags/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'VideoTag', id }],
    }),
    createVideoTag: builder.mutation<ApiResponse<VideoTag>, CreateVideoTagRequest>({
      query: (body) => ({ url: '/api/videotags', method: 'POST', body }),
      invalidatesTags: [{ type: 'VideoTag', id: 'LIST' }],
    }),
    updateVideoTag: builder.mutation<ApiResponse<VideoTag>, { id: string; body: UpdateVideoTagRequest }>({
      query: ({ id, body }) => ({ url: `/api/videotags/${id}`, method: 'PUT', body }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: 'VideoTag', id },
        { type: 'VideoTag', id: 'LIST' },
      ],
    }),
    deleteVideoTag: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/api/videotags/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, _err, id) => [
        { type: 'VideoTag', id },
        { type: 'VideoTag', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetVideoTagsQuery,
  useGetVideoTagByIdQuery,
  useCreateVideoTagMutation,
  useUpdateVideoTagMutation,
  useDeleteVideoTagMutation,
} = videoTagsApi;
