import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '@/store';

export const mainApi = createApi({
  reducerPath: 'mainApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User', 'Admin'],
  endpoints: (builder) => ({
    getProfile: builder.query<any, void>({
      query: () => '/api/profile',
    }),
    // Placeholder for other endpoints
  }),
});

export const { useGetProfileQuery } = mainApi;
