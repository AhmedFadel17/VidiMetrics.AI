import { mainApi } from '../mainApi';
import { ApiResponse } from '@/types/api';
import { KeywordRanking } from '@/types/models/seo';

export interface CreateKeywordRankingRequest {
  rank: number;
  checkedAt: string;
  keywordId: string;
}

export interface UpdateKeywordRankingRequest extends CreateKeywordRankingRequest {}

export const keywordRankingsApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getRankingsByKeyword: builder.query<ApiResponse<KeywordRanking[]>, string>({
      query: (keywordId) => `/api/keywordrankings?keywordId=${keywordId}`,
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'KeywordRanking' as const, id })),
              { type: 'KeywordRanking', id: 'LIST' },
            ]
          : [{ type: 'KeywordRanking', id: 'LIST' }],
    }),
    getKeywordRankingById: builder.query<ApiResponse<KeywordRanking>, string>({
      query: (id) => `/api/keywordrankings/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'KeywordRanking', id }],
    }),
    createKeywordRanking: builder.mutation<ApiResponse<KeywordRanking>, CreateKeywordRankingRequest>({
      query: (body) => ({ url: '/api/keywordrankings', method: 'POST', body }),
      invalidatesTags: [{ type: 'KeywordRanking', id: 'LIST' }],
    }),
    updateKeywordRanking: builder.mutation<ApiResponse<KeywordRanking>, { id: string; body: UpdateKeywordRankingRequest }>({
      query: ({ id, body }) => ({ url: `/api/keywordrankings/${id}`, method: 'PUT', body }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: 'KeywordRanking', id },
        { type: 'KeywordRanking', id: 'LIST' },
      ],
    }),
    deleteKeywordRanking: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/api/keywordrankings/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, _err, id) => [
        { type: 'KeywordRanking', id },
        { type: 'KeywordRanking', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetRankingsByKeywordQuery,
  useGetKeywordRankingByIdQuery,
  useCreateKeywordRankingMutation,
  useUpdateKeywordRankingMutation,
  useDeleteKeywordRankingMutation,
} = keywordRankingsApi;
