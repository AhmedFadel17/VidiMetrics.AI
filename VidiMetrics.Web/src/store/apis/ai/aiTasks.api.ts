import { mainApi } from '../mainApi';
import { ApiResponse } from '@/types/api';
import { AiTask } from '@/types/models/ai';
import { AiTaskStatus } from '@/types/enums';

export interface CreateAiTaskRequest {
  taskType: string;
  inputParameters: string;
  priority: number;
}

export interface UpdateAiTaskRequest {
  status: AiTaskStatus;
  outputData?: string;
  errorMessage?: string;
  completedAt?: string;
}

export const aiTasksApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getAiTasks: builder.query<ApiResponse<AiTask[]>, void>({
      query: () => '/api/aitasks',
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'AiTask' as const, id })),
              { type: 'AiTask', id: 'LIST' },
            ]
          : [{ type: 'AiTask', id: 'LIST' }],
    }),
    getAiTaskById: builder.query<ApiResponse<AiTask>, string>({
      query: (id) => `/api/aitasks/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'AiTask', id }],
    }),
    createAiTask: builder.mutation<ApiResponse<AiTask>, CreateAiTaskRequest>({
      query: (body) => ({ url: '/api/aitasks', method: 'POST', body }),
      invalidatesTags: [{ type: 'AiTask', id: 'LIST' }],
    }),
    updateAiTask: builder.mutation<ApiResponse<AiTask>, { id: string; body: UpdateAiTaskRequest }>({
      query: ({ id, body }) => ({ url: `/api/aitasks/${id}`, method: 'PUT', body }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: 'AiTask', id },
        { type: 'AiTask', id: 'LIST' },
      ],
    }),
    deleteAiTask: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/api/aitasks/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, _err, id) => [
        { type: 'AiTask', id },
        { type: 'AiTask', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetAiTasksQuery,
  useGetAiTaskByIdQuery,
  useCreateAiTaskMutation,
  useUpdateAiTaskMutation,
  useDeleteAiTaskMutation,
} = aiTasksApi;
