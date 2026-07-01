import { Button } from '@/components/ui/Button';
import { PricingPlan } from '@/types/pricing';
import { showToast } from "@/utils/toast"
import { useAuth } from 'react-oidc-context'
import { useNavigate } from 'react-router-dom';

const plans: PricingPlan[] = [
    {
        id: "free",
        name: "Free",
        targetAudience: "For new observers",
        price: 0,
        currency: "USD",
        interval: "month",
        features: [
            "5 AI Storyboards / mo",
            "Basic Analytics",
            "Standard Resolution"
        ],
        startAction: "Start Free",
        isPopular: false,
        isFree: true,
        isEnterprise: false
    },
    {
        id: "creator",
        name: "Creator",
        targetAudience: "For the storytellers",
        price: 29,
        currency: "USD",
        interval: "month",
        features: [
            "Unlimited Characters",
            "Custom Prompt Tuning",
            "High-res Downloads",
            "Retention Heatmaps"
        ],
        startAction: "Join Creator",
        isPopular: true,
        isFree: false,
        isEnterprise: false
    },
    {
        id: "studio",
        name: "Studio",
        targetAudience: "For the production team",
        price: 99,
        currency: "USD",
        interval: "month",
        features: [
            "Team Collaboration",
            "API Access",
            "4K Cinematic Export",
            "Priority Rendering"
        ],
        startAction: "Contact Sales",
        isPopular: false,
        isFree: false,
        isEnterprise: true
    }
]
export default function Pricing() {
    const auth = useAuth();
    const navigate = useNavigate();
    const handleRegister = async () => {
        try {
            await auth.signinRedirect({ extraQueryParams: { prompt: 'register' } })
        } catch (error: any) {
            showToast.error("Register redirect failed", "Something went wrong while registering. Please try again.")
        }
    }
    return (
        <div className="max-w-screen-2xl mx-auto">
            <div className="text-center mb-20 space-y-4">
                <h2 className="text-[10px] uppercase tracking-[0.3em] text-[#7818c6] font-bold">The Creative Investment</h2>
                <h3 className="text-6xl font-headline font-bold text-white tracking-tight">Choose Your Level.</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {plans.map((plan) => {
                    return (
                        <div className={`p-10 rounded-[2rem]  border flex flex-col items-center text-center transition-all duration-500 hover:scale-105 ${plan.isPopular ? "relative bg-[#1c2742] border-[#7818c6]/50 shadow-2xl shadow-[#7818c6]/20 border-2" : "bg-[#161f35]/50 border-white/5"}`}>
                            {plan.isPopular && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1.5 bg-[#7818c6] rounded-full text-[10px] font-bold uppercase tracking-widest text-white shadow-lg">
                                    Most Popular
                                </div>
                            )}
                            <h4 className="text-xl font-bold mb-1">{plan.name}</h4>
                            <p className="text-[10px] uppercase tracking-widest text-white/40 mb-8 font-bold">{plan.targetAudience}</p>
                            <div className="flex items-baseline gap-1 mb-10">
                                <span className="text-4xl font-headline font-bold">${plan.price}</span>
                                <span className="text-white/30 text-xs">/{plan.interval}</span>
                            </div>
                            <ul className="space-y-5 mb-12 text-sm text-white/60 font-medium text-left w-full pl-6">
                                {plan.features.map((feature: string) => {
                                    return (
                                        <li className="flex items-center gap-3"><span className="material-symbols-outlined text-[10px] text-[#7818c6] font-bold">check</span> {feature}</li>
                                    )
                                })}
                            </ul>
                            <Button
                                fullWidth
                                className="mt-auto"
                                variant={plan.isPopular ? "primary" : "secondary"}
                                size="lg"
                                onClick={() => auth.isAuthenticated ? navigate('/dashboard') : handleRegister()}
                            >
                                {plan.startAction}
                            </Button>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}