type PricingPlan = {
    id: string;
    name: string;
    targetAudience: string;
    price: number;
    currency: string;
    interval: string;
    features: string[];
    startAction: string;
    isPopular: boolean;
    isFree: boolean;
    isEnterprise: boolean;
}

