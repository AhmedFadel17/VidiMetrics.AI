import { mainApi } from '../mainApi';
import { ApiResponse, PaginationResponse, PaginationFilter } from '@/types/api';
import { Show } from '@/types/models/storyEngine';

// ─── Request bodies ───────────────────────────────────────────────────────────
export interface CreateShowRequest {
  title: string;
  description: string;
  visualStyle: string;
  targetAudience: string;
}

export interface UpdateShowRequest extends CreateShowRequest { }
export interface ShowFilter extends PaginationFilter {
  status?: number;
  createdAfter?: string;
  createdBefore?: string;
}

// ─── Injected endpoints ───────────────────────────────────────────────────────
export const showsApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getShows: builder.query<ApiResponse<PaginationResponse<Show>>, ShowFilter>({
      query: (filter) => {
        const params = new URLSearchParams();

        Object.entries(filter).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, value.toString());
          }
        });

        return {
          url: '/api/shows',
          params: params,
        };
      },
      providesTags: (result) =>
        result?.data?.items
          ? [
            ...result.data.items.map(({ id }) => ({ type: 'Show' as const, id })),
            { type: 'Show', id: 'LIST' },
          ]
          : [{ type: 'Show', id: 'LIST' }],
    }),

    getShowById: builder.query<ApiResponse<Show>, string>({
      query: (id) => `/api/shows/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'Show', id }],
    }),

    createShow: builder.mutation<ApiResponse<Show>, CreateShowRequest>({
      query: (body) => ({ url: '/api/shows', method: 'POST', body }),
      invalidatesTags: [{ type: 'Show', id: 'LIST' }],
    }),

    updateShow: builder.mutation<ApiResponse<Show>, { id: string; body: UpdateShowRequest }>({
      query: ({ id, body }) => ({ url: `/api/shows/${id}`, method: 'PUT', body }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: 'Show', id },
        { type: 'Show', id: 'LIST' },
      ],
    }),

    deleteShow: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/api/shows/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, _err, id) => [
        { type: 'Show', id },
        { type: 'Show', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetShowsQuery,
  useGetShowByIdQuery,
  useCreateShowMutation,
  useUpdateShowMutation,
  useDeleteShowMutation,
} = showsApi;
