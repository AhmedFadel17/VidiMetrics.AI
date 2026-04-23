import { mainApi } from '../mainApi';
import { ApiResponse } from '@/types/api';
import { Transcript } from '@/types/models/ai';

export interface CreateTranscriptRequest {
  videoId: string;
  rawText: string;
  languageCode: string;
}

export interface UpdateTranscriptRequest extends CreateTranscriptRequest {}

export const transcriptsApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getTranscriptsByVideo: builder.query<ApiResponse<Transcript[]>, string>({
      query: (videoId) => `/api/transcripts?videoId=${videoId}`,
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'Transcript' as const, id })),
              { type: 'Transcript', id: 'LIST' },
            ]
          : [{ type: 'Transcript', id: 'LIST' }],
    }),
    getTranscriptById: builder.query<ApiResponse<Transcript>, string>({
      query: (id) => `/api/transcripts/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'Transcript', id }],
    }),
    createTranscript: builder.mutation<ApiResponse<Transcript>, CreateTranscriptRequest>({
      query: (body) => ({ url: '/api/transcripts', method: 'POST', body }),
      invalidatesTags: [{ type: 'Transcript', id: 'LIST' }],
    }),
    updateTranscript: builder.mutation<ApiResponse<Transcript>, { id: string; body: UpdateTranscriptRequest }>({
      query: ({ id, body }) => ({ url: `/api/transcripts/${id}`, method: 'PUT', body }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: 'Transcript', id },
        { type: 'Transcript', id: 'LIST' },
      ],
    }),
    deleteTranscript: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/api/transcripts/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, _err, id) => [
        { type: 'Transcript', id },
        { type: 'Transcript', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetTranscriptsByVideoQuery,
  useGetTranscriptByIdQuery,
  useCreateTranscriptMutation,
  useUpdateTranscriptMutation,
  useDeleteTranscriptMutation,
} = transcriptsApi;
