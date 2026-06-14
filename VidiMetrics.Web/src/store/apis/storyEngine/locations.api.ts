import { mainApi } from '../mainApi';
import { ApiResponse, PaginationResponse, PaginationFilter, Lookup } from '@/types/api';
import { Location } from '@/types/models/storyEngine';

export interface CreateLocationRequest {
  name: string;
  visualDescription: string;
  atmosphere: string;
  referenceImageUrl?: string;
  showId: string;
}

export interface UpdateLocationRequest extends Partial<CreateLocationRequest> { }

export interface LocationFilter extends PaginationFilter {
  showId?: string;
  createdAfter?: string;
  createdBefore?: string;
}

export const locationsApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getLocations: builder.query<ApiResponse<PaginationResponse<Location>>, LocationFilter>({
      query: (filter) => {
        const params = new URLSearchParams();

        Object.entries(filter).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, value.toString());
          }
        });

        return {
          url: '/api/locations',
          params: params,
        };
      },
      providesTags: (result) =>
        result?.data?.items
          ? [
            ...result.data.items.map(({ id }) => ({ type: 'Location' as const, id })),
            { type: 'Location', id: 'LIST' },
          ]
          : [{ type: 'Location', id: 'LIST' }],
    }),

    getLocationById: builder.query<ApiResponse<Location>, string>({
      query: (id) => `/api/locations/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'Location', id }],
    }),

    createLocation: builder.mutation<ApiResponse<Location>, CreateLocationRequest>({
      query: (body) => ({ url: '/api/locations', method: 'POST', body }),
      invalidatesTags: [{ type: 'Location', id: 'LIST' }],
    }),

    updateLocation: builder.mutation<ApiResponse<Location>, { id: string; body: UpdateLocationRequest }>({
      query: ({ id, body }) => ({ url: `/api/locations/${id}`, method: 'PUT', body }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: 'Location', id },
        { type: 'Location', id: 'LIST' },
      ],
    }),

    deleteLocation: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/api/locations/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, _err, id) => [
        { type: 'Location', id },
        { type: 'Location', id: 'LIST' },
      ],
    }),

    getLocationsLookup: builder.query<ApiResponse<Lookup[]>, string | undefined>({
      query: (showId) => ({
        url: '/api/locations/lookup',
        params: showId ? { showId } : undefined,
      }),
      providesTags: (result) =>
        result?.data
          ? [
            ...result.data.map(({ id }) => ({ type: 'Location' as const, id })),
            { type: 'Location', id: 'LOOKUP' },
          ]
          : [{ type: 'Location', id: 'LOOKUP' }],
    }),
  }),
});

export const {
  useGetLocationsQuery,
  useGetLocationByIdQuery,
  useGetLocationsLookupQuery,
  useCreateLocationMutation,
  useUpdateLocationMutation,
  useDeleteLocationMutation,
} = locationsApi;
