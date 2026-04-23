import { mainApi } from '../mainApi';
import { ApiResponse } from '@/types/api';
import { UserProfile } from '@/types/models/infra';

export const userProfilesApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<ApiResponse<UserProfile>, void>({
      query: () => '/api/profile',
      providesTags: ['User'],
    }),
  }),
});

export const { useGetProfileQuery } = userProfilesApi;
