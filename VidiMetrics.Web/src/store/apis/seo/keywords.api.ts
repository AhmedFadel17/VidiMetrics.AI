import { mainApi } from '../mainApi';
import { ApiResponse } from '@/types/api';
import { Keyword } from '@/types/models/seo';

export interface CreateKeywordRequest {
  term: string;
  searchVolume: number;
  difficulty: number;
}

export interface UpdateKeywordRequest extends CreateKeywordRequest {}

export const keywordsApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getKeywords: builder.query<ApiResponse<Keyword[]>, void>({
      query: () => '/api/keywords',
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'Keyword' as const, id })),
              { type: 'Keyword', id: 'LIST' },
            ]
          : [{ type: 'Keyword', id: 'LIST' }],
    }),
    getKeywordById: builder.query<ApiResponse<Keyword>, string>({
      query: (id) => `/api/keywords/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'Keyword', id }],
    }),
    createKeyword: builder.mutation<ApiResponse<Keyword>, CreateKeywordRequest>({
      query: (body) => ({ url: '/api/keywords', method: 'POST', body }),
      invalidatesTags: [{ type: 'Keyword', id: 'LIST' }],
    }),
    updateKeyword: builder.mutation<ApiResponse<Keyword>, { id: string; body: UpdateKeywordRequest }>({
      query: ({ id, body }) => ({ url: `/api/keywords/${id}`, method: 'PUT', body }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: 'Keyword', id },
        { type: 'Keyword', id: 'LIST' },
      ],
    }),
    deleteKeyword: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/api/keywords/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, _err, id) => [
        { type: 'Keyword', id },
        { type: 'Keyword', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetKeywordsQuery,
  useGetKeywordByIdQuery,
  useCreateKeywordMutation,
  useUpdateKeywordMutation,
  useDeleteKeywordMutation,
} = keywordsApi;
