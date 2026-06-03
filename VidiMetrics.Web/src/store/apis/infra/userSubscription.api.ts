import { mainApi } from '../mainApi';
import { ApiResponse } from '@/types/api';
import {
  UserCreditWallet,
  CreditTransactionLedger,
  UserSubscription,
} from '@/types/models/infra';

interface UpgradeSubscriptionDto {
  planId: string;
}

export const userSubscriptionsApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getBalance: builder.query<ApiResponse<UserCreditWallet>, void>({
      query: () => '/api/user/subscriptions/balance',
      providesTags: ['Credits'],
    }),

    getCreditHistory: builder.query<ApiResponse<CreditTransactionLedger[]>, void>({
      query: () => '/api/user/subscriptions/history/credits',
      providesTags: ['Credits'],
    }),

    getSubscriptionHistory: builder.query<ApiResponse<UserSubscription[]>, void>({
      query: () => '/api/user/subscriptions/history/subscriptions',
      providesTags: ['Subscription'],
    }),

    cancelSubscription: builder.mutation<ApiResponse<UserSubscription>, void>({
      query: () => ({
        url: '/api/user/subscriptions/cancel',
        method: 'POST',
      }),
      invalidatesTags: ['Subscription', 'Credits', 'User'],
    }),

    upgradeSubscription: builder.mutation<ApiResponse<UserSubscription>, UpgradeSubscriptionDto>({
      query: (dto) => ({
        url: '/api/user/subscriptions/upgrade',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Subscription', 'Credits', 'User'],
    }),
  }),
});

export const {
  useGetBalanceQuery,
  useGetCreditHistoryQuery,
  useGetSubscriptionHistoryQuery,
  useCancelSubscriptionMutation,
  useUpgradeSubscriptionMutation,
} = userSubscriptionsApi;