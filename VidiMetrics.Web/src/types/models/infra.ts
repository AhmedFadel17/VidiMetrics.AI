import { CreditActionType, SubscriptionStatus } from "../enums";

// ─── SubscriptionPlan ─────────────────────────────────────────────────────────
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  maxChannelsAllowed: number;
  baseMonthlyCredits: number;
  stripePriceId?: string;
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
  cancelledAt?: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  stripeSubscriptionId?: string;
  status: SubscriptionStatus;
}



// ─── UserCreditWallet ─────────────────────────────────────────────────────────
export interface UserCreditWallet {
  id: string;
  userId: string;
  totalCreditsAvailable: number;
  creditsUsed: number;
  lastResetDate: string;
  nextResetDate: string;
  remainingCredits: number;
  hasBalanceForAction: boolean;
}

// ─── CreditCostRule ─────────────────────────────────────────────────────────
export interface CreditCostRule {
  id: string;
  actionKey: CreditActionType;
  creditCost: number;
  isEnabled: boolean;
}

// ─── CreditTransactionLedger ─────────────────────────────────────────────────────────
export interface CreditTransactionLedger {
  id: string;
  userId: string;
  actionType: CreditActionType;
  amountDeducted: number;
  description: string;
  timestamp: string;
}