import { mainApi } from '../mainApi';
import { ApiResponse } from '@/types/api';
import { Notification } from '@/types/models/infra';

export const notificationsApi = mainApi.injectEndpoints({
    endpoints: (builder) => ({
        getMyNotifications: builder.query<ApiResponse<Notification[]>, void>({
            query: () => `/api/notifications`,
            providesTags: ['Notification'],
        }),
        markNotificationAsRead: builder.mutation<ApiResponse<Notification>, string>({
            query: (id) => ({
                url: `/api/notifications/${id}/read`,
                method: 'PUT',
            }),
            invalidatesTags: ['Notification'],
        }),
        markAllNotificationsAsRead: builder.mutation<ApiResponse<null>, void>({
            query: () => ({
                url: `/api/notifications/read-all`,
                method: 'PUT',
            }),
            invalidatesTags: ['Notification'],
        }),
    }),
});

export const {
    useGetMyNotificationsQuery,
    useMarkNotificationAsReadMutation,
    useMarkAllNotificationsAsReadMutation
} = notificationsApi;
