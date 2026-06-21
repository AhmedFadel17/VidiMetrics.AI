import { mainApi } from '../mainApi';
import { ApiResponse, PaginationFilter, PaginationResponse } from '@/types/api';
import { AiScript } from '@/types/models/ai';

export interface AiScriptFilterDto extends PaginationFilter {
  isLinked?: boolean | null;
}
export interface CreateAiScriptDto {
  weather: string;
  environmentDescription: string;
  locationId: string;
  characterIds: string[];
  scriptLines: CreateScriptLine[];
}

export interface CreateScriptLine {
  sequence: number;
  type: number;
  characterId: string;
  characterStatus: string;
  content: string;
}

export interface UpdateAiScriptDto {
  weather: string;
  environmentDescription: string;
  visualPrompt: string;
  locationId: string;
}

export const aiScriptsApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getAiScripts: builder.query<ApiResponse<PaginationResponse<AiScript>>, AiScriptFilterDto>({
      query: (filter) => {
        const params = new URLSearchParams();

        Object.entries(filter).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, value.toString());
          }
        });

        return {
          url: '/api/ai/scripts',
          params: params,
        };
      },
      providesTags: (result) =>
        result?.data
          ? [
            ...result.data.items.map(({ id }) => ({ type: 'AiScript' as const, id })),
            { type: 'AiScript', id: 'LIST' },
          ]
          : [{ type: 'AiScript', id: 'LIST' }],
    }),
    getAiScriptById: builder.query<ApiResponse<AiScript>, string>({
      query: (id) => `/api/ai/scripts/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'AiScript', id }],
    }),
    createAiScript: builder.mutation<ApiResponse<AiScript>, CreateAiScriptDto>({
      query: (body) => ({ url: '/api/ai/scripts', method: 'POST', body }),
      invalidatesTags: [{ type: 'AiScript', id: 'LIST' }],
    }),
    updateAiScript: builder.mutation<ApiResponse<AiScript>, { id: string; body: UpdateAiScriptDto }>({
      query: ({ id, body }) => ({ url: `/api/ai/scripts/${id}`, method: 'PUT', body }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: 'AiScript', id },
        { type: 'AiScript', id: 'LIST' },
      ],
    }),
    deleteAiScript: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/api/ai/scripts/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, _err, id) => [
        { type: 'AiScript', id },
        { type: 'AiScript', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetAiScriptsQuery,
  useGetAiScriptByIdQuery,
  useCreateAiScriptMutation,
  useUpdateAiScriptMutation,
  useDeleteAiScriptMutation,
} = aiScriptsApi;
