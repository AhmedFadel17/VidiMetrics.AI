import { mainApi } from '../mainApi';
import { ApiResponse } from '@/types/api';
import { AiPromptTemplate } from '@/types/models/ai';

export interface CreateAiPromptTemplateRequest {
  name: string;
  templateText: string;
  category: string;
  isSystem: boolean;
}

export interface UpdateAiPromptTemplateRequest extends CreateAiPromptTemplateRequest {}

export const aiPromptTemplatesApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getAiPromptTemplates: builder.query<ApiResponse<AiPromptTemplate[]>, void>({
      query: () => '/api/aiprompttemplates',
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'AiPromptTemplate' as const, id })),
              { type: 'AiPromptTemplate', id: 'LIST' },
            ]
          : [{ type: 'AiPromptTemplate', id: 'LIST' }],
    }),
    getAiPromptTemplateById: builder.query<ApiResponse<AiPromptTemplate>, string>({
      query: (id) => `/api/aiprompttemplates/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'AiPromptTemplate', id }],
    }),
    createAiPromptTemplate: builder.mutation<ApiResponse<AiPromptTemplate>, CreateAiPromptTemplateRequest>({
      query: (body) => ({ url: '/api/aiprompttemplates', method: 'POST', body }),
      invalidatesTags: [{ type: 'AiPromptTemplate', id: 'LIST' }],
    }),
    updateAiPromptTemplate: builder.mutation<ApiResponse<AiPromptTemplate>, { id: string; body: UpdateAiPromptTemplateRequest }>({
      query: ({ id, body }) => ({ url: `/api/aiprompttemplates/${id}`, method: 'PUT', body }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: 'AiPromptTemplate', id },
        { type: 'AiPromptTemplate', id: 'LIST' },
      ],
    }),
    deleteAiPromptTemplate: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/api/aiprompttemplates/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, _err, id) => [
        { type: 'AiPromptTemplate', id },
        { type: 'AiPromptTemplate', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetAiPromptTemplatesQuery,
  useGetAiPromptTemplateByIdQuery,
  useCreateAiPromptTemplateMutation,
  useUpdateAiPromptTemplateMutation,
  useDeleteAiPromptTemplateMutation,
} = aiPromptTemplatesApi;
