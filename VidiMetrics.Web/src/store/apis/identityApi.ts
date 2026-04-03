import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const identityApi = createApi({
  reducerPath: 'identityApi',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_IDENTITY_SERVER_URL }),
  endpoints: (builder) => ({
    register: builder.mutation<any, any>({
      query: (userData) => ({
        url: '/connect/register',
        method: 'POST',
        body: userData,
      }),
    }),
  }),
});

export const { useRegisterMutation } = identityApi;
