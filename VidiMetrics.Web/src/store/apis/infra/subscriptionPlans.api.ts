import { mainApi } from '../mainApi';
import { ApiResponse } from '@/types/api';
import { SubscriptionPlan } from '@/types/models/infra';

export const subscriptionPlansApi = mainApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllPlans: builder.query<ApiResponse<SubscriptionPlan[]>, void>({
            query: () => '/api/subscriptions/plans',
            providesTags: ['SubscriptionPlan'],
        }),

        getPlanById: builder.query<ApiResponse<SubscriptionPlan>, string>({
            query: (id) => `/api/subscriptions/plans/${id}`,
            providesTags: (_result, _error, id) => [{ type: 'SubscriptionPlan', id }],
        }),
    }),
});

export const {
    useGetAllPlansQuery,
    useGetPlanByIdQuery,
} = subscriptionPlansApi;