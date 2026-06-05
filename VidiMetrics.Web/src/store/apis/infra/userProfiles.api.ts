import { mainApi } from '../mainApi';
import { ApiResponse } from '@/types/api';
import { UserProfile } from '@/types/models/infra';

export const userProfilesApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query<ApiResponse<UserProfile>, void>({
      query: () => `/api/user/profiles/me`,
      providesTags: ['User'],
    }),
    updateUserProfile: builder.mutation<ApiResponse<UserProfile>, Partial<UserProfile>>({
      query: (data) => ({
        url: `/api/user/profiles/me`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    updateUserProfilePicture: builder.mutation<ApiResponse<UserProfile>, FormData>({
      query: (data) => ({
        url: `/api/user/profiles/me/avatar`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    getProfile: builder.query<ApiResponse<UserProfile>, string>({
      query: (userId) => `/api/user/profiles/${userId}`,
      providesTags: ['User'],
    }),
    updateProfile: builder.mutation<ApiResponse<UserProfile>, { userId: string; data: Partial<UserProfile> }>({
      query: ({ userId, data }) => ({
        url: `/api/user/profiles/${userId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useUpdateUserProfilePictureMutation,
  useGetProfileQuery,
  useUpdateProfileMutation
} = userProfilesApi;
