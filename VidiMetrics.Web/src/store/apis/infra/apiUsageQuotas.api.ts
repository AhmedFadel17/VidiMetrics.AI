import { mainApi } from '../mainApi';
import { ApiResponse } from '@/types/api';
import { ApiUsageQuota } from '@/types/models/infra';

export interface CreateApiUsageQuotaRequest {
  featureName: string;
  limit: number;
  period: string;
}

export interface UpdateApiUsageQuotaRequest extends CreateApiUsageQuotaRequest {
  currentUsage: number;
}

export const apiUsageQuotasApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getQuotas: builder.query<ApiResponse<ApiUsageQuota[]>, void>({
      query: () => '/api/apiusagequotas',
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'Admin' as const, id })),
              { type: 'Admin', id: 'LIST' },
            ]
          : [{ type: 'Admin', id: 'LIST' }],
    }),
    getQuotaById: builder.query<ApiResponse<ApiUsageQuota>, string>({
      query: (id) => `/api/apiusagequotas/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'Admin', id }],
    }),
    createQuota: builder.mutation<ApiResponse<ApiUsageQuota>, CreateApiUsageQuotaRequest>({
      query: (body) => ({ url: '/api/apiusagequotas', method: 'POST', body }),
      invalidatesTags: [{ type: 'Admin', id: 'LIST' }],
    }),
    updateQuota: builder.mutation<ApiResponse<ApiUsageQuota>, { id: string; body: UpdateApiUsageQuotaRequest }>({
      query: ({ id, body }) => ({ url: `/api/apiusagequotas/${id}`, method: 'PUT', body }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: 'Admin', id },
        { type: 'Admin', id: 'LIST' },
      ],
    }),
    deleteQuota: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/api/apiusagequotas/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, _err, id) => [
        { type: 'Admin', id },
        { type: 'Admin', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetQuotasQuery,
  useGetQuotaByIdQuery,
  useCreateQuotaMutation,
  useUpdateQuotaMutation,
  useDeleteQuotaMutation,
} = apiUsageQuotasApi;
