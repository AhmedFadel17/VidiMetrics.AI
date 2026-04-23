import { ApiType, SubscriptionStatus } from "../enums";

// ─── SubscriptionPlan ─────────────────────────────────────────────────────────
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  maxChannelsAllowed: number;
  dailyApiQuotaLimit: number;
  isActive: boolean;
}

// ─── UserProfile ──────────────────────────────────────────────────────────────
export interface UserProfile {
  userId: string;
  email: string;
  fullName: string;
  profilePictureUrl?: string;
  bio?: string;
  createdAt: string;
  lastLoginAt?: string;
  isActive: boolean;
  subscriptionPlanId: string;
  subscriptionPlan?: SubscriptionPlan;
  subscriptionHistory?: UserSubscription[];
}

// ─── UserSubscription ─────────────────────────────────────────────────────────
export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  subscriptionPlan?: SubscriptionPlan;
  startDate: string;
  endDate?: string;
  status: SubscriptionStatus;
}

// ─── ApiUsageQuota ────────────────────────────────────────────────────────────
export interface ApiUsageQuota {
  id: string;
  userId: string;
  apiType: ApiType;
  monthlyLimit: number;
  currentUsage: number;
  periodStart: string;
  periodEnd: string;
  canCallApi: boolean;
}
