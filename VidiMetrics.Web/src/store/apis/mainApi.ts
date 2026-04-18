import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Series } from '@/types/series';
import { ApiResponse } from '@/types/api';

export const mainApi = createApi({
  reducerPath: 'mainApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth?.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User', 'Admin', 'Series'],
  endpoints: (builder) => ({
    getProfile: builder.query<any, void>({
      query: () => '/api/profile',
    }),
    getShows: builder.query<ApiResponse<Series[]>, void>({
      query: () => '/api/shows',
      providesTags: ['Series'],
    }),
    createSeries: builder.mutation<ApiResponse<Series>, { title: string; description: string; visualStyle: string; targetAudience: string }>({
      query: (body) => ({
        url: '/api/shows',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Series'],
    }),
  }),
});

export const { useGetProfileQuery, useGetShowsQuery, useCreateSeriesMutation } = mainApi;
