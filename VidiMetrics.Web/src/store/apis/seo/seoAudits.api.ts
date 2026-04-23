import { mainApi } from '../mainApi';
import { ApiResponse } from '@/types/api';
import { SeoAudit } from '@/types/models/seo';

export interface CreateSeoAuditRequest {
  score: number;
  auditData: string;
  recommendations: string;
  videoId: string;
}

export interface UpdateSeoAuditRequest extends CreateSeoAuditRequest {}

export const seoAuditsApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getAuditsByVideo: builder.query<ApiResponse<SeoAudit[]>, string>({
      query: (videoId) => `/api/seoaudits?videoId=${videoId}`,
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'SeoAudit' as const, id })),
              { type: 'SeoAudit', id: 'LIST' },
            ]
          : [{ type: 'SeoAudit', id: 'LIST' }],
    }),
    getSeoAuditById: builder.query<ApiResponse<SeoAudit>, string>({
      query: (id) => `/api/seoaudits/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'SeoAudit', id }],
    }),
    createSeoAudit: builder.mutation<ApiResponse<SeoAudit>, CreateSeoAuditRequest>({
      query: (body) => ({ url: '/api/seoaudits', method: 'POST', body }),
      invalidatesTags: [{ type: 'SeoAudit', id: 'LIST' }],
    }),
    updateSeoAudit: builder.mutation<ApiResponse<SeoAudit>, { id: string; body: UpdateSeoAuditRequest }>({
      query: ({ id, body }) => ({ url: `/api/seoaudits/${id}`, method: 'PUT', body }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: 'SeoAudit', id },
        { type: 'SeoAudit', id: 'LIST' },
      ],
    }),
    deleteSeoAudit: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/api/seoaudits/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, _err, id) => [
        { type: 'SeoAudit', id },
        { type: 'SeoAudit', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetAuditsByVideoQuery,
  useGetSeoAuditByIdQuery,
  useCreateSeoAuditMutation,
  useUpdateSeoAuditMutation,
  useDeleteSeoAuditMutation,
} = seoAuditsApi;
