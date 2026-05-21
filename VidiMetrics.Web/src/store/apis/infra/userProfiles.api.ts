import { mainApi } from '../mainApi';
import { ApiResponse } from '@/types/api';
import { UserProfile } from '@/types/models/infra';

export const userProfilesApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<ApiResponse<UserProfile>, string>({
      query: (userId) => `/api/userprofiles/${userId}`,
      providesTags: ['User'],
    }),
    updateProfile: builder.mutation<ApiResponse<UserProfile>, { userId: string; data: Partial<UserProfile> }>({
      query: ({ userId, data }) => ({
        url: `/api/userprofiles/${userId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const { useGetProfileQuery, useUpdateProfileMutation } = userProfilesApi;
