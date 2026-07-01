import Pricing from "../Shared/Pricing";
import { Button } from '@/components/ui/Button';
import homeStory1 from '@/assets/images/home/home-story-1.png';
import homeStory2 from '@/assets/images/home/home-story-2.png';
import homeStory3 from '@/assets/images/home/home-story-3.png';
import TrustNetworkStatisticsSection from "./components/TrustNetworkStatisticsSection";
import { useNavigate } from "react-router";
import { useAuth } from 'react-oidc-context'
import { showToast } from "@/utils/toast";

export default function Home() {
  const navigate = useNavigate();
  const auth = useAuth();

  const handleRegister = async () => {
    try {
      await auth.signinRedirect({ extraQueryParams: { prompt: 'register' } })
    } catch (error: any) {
      showToast.error("Register redirect failed", "Something went wrong while registering. Please try again.")
    }
  }
  const testimonials = [
    { name: "Marcus Thorne", role: "Sci-Fi Creator (2M+ Subs)", body: "VidiMetrics transformed my production pipeline. I write a script, and the storyboarder generates frame-consistent spaceships in seconds.", score: "99% Retention Rate" },
    { name: "Elena Rostova", role: "Documentary Producer", body: "The deep YouTube metric integration predicted my last thumbnail A/B test failure before I even hit publish. Pure wizardry.", score: "+40% CTR Jump" }
  ];

  return (
    <div className="bg-[#0b1326] text-white selection:bg-[#7818c6]/30">

      {/* 1️⃣ Hero Section */}
      <section className="relative pt-44 pb-32 px-8 overflow-hidden">
        <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20 items-center relative z-10">
          <div className="lg:col-span-6 space-y-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-[#7818c6] animate-pulse"></span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/60 font-bold">New: Cinematic Engine v4.0</span>
            </div>

            <h1 className="font-headline font-bold text-6xl lg:text-7xl leading-[0.9] tracking-tighter">
              The Engine For <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ddb7ff] via-[#7818c6] to-[#ddb7ff]">Autonomous</span> <br />
              Visual Media
            </h1>
            <p className="text-lg text-white/60 max-w-lg leading-relaxed font-body">
              AI-powered illustrated stories and deep YouTube analytics in one place. Elevate your narrative with data-driven creative precision.
            </p>
            <div className="flex flex-wrap gap-6 pt-4">
              <Button variant="primary" size="lg" onClick={() => handleRegister()}>
                Get Started
              </Button>
              <Button variant="secondary" onClick={() => navigate("/demo")} size="lg" icon={<span className="material-symbols-outlined text-lg">play_circle</span>}>
                Watch Demo
              </Button>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative aspect-square max-w-xl ml-auto group">
              <div className="absolute inset-0 bg-[#7818c6]/20 blur-[100px] rounded-full -z-10 animate-pulse"></div>
              <div className="w-full h-full rounded-[2.5rem] p-8 bg-[#161f35] border border-white/10 shadow-2xl overflow-hidden relative">
                <div className="w-full h-full rounded-2xl overflow-hidden relative">
                  <img
                    className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDw2K9FIoyTSkQXUl0yHnXNOLQm5bV_FRfZgcGzAZoMXevYiZgvaPxI72fgNtcOTdTepddjTbswkIxCc3sbob0pXuyUwpoFFMyFJp3rK7ehVJ5cWc67yY1hoyT42ScraztkP6O9vWeCa46GcYNPvQ9VmnxdxMRrmmVUMkvOWVxyBjSSTiW4JsqC3oULapA0fcrVRuXJlUOWUce0mQJvoZXduq3fwh57EwowCuSMr1FYlgbegeM4sjFrXv8WB1R2wpmjIh19PLzGhKQ"
                    alt="Cinematic Visualization"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b1326] via-transparent to-transparent"></div>
                  <div className="absolute bottom-8 left-8 right-8 p-6 glass-panel rounded-xl border border-white/10 backdrop-blur-md bg-black/40">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ddb7ff]">Live Generation</span>
                      <span className="text-[10px] text-white/40">84% Complete</span>
                    </div>
                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#7818c6] w-[84%] h-full shadow-[0_0_15px_rgba(120,24,198,0.8)]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#7818c6]/10 blur-[160px] rounded-full -mr-96 -mt-96 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#3da9fc]/5 blur-[120px] rounded-full -ml-40 -mb-40 pointer-events-none"></div>
      </section>

      <TrustNetworkStatisticsSection />


      {/* 3️⃣ Core Engine Section */}
      <section className="py-24 px-8">
        <div className="max-w-screen-2xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-[10px] uppercase tracking-[0.3em] text-[#7818c6] font-bold">The Core Engine</h2>
            <h3 className="text-5xl font-headline font-bold text-white tracking-tight">From Prompt to Performance.</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* AI Storyboarder Card */}
            <div className="group p-12 rounded-[2rem] bg-[#161f35] border border-white/5 hover:border-white/10 transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#7818c6]/5 blur-3xl -mr-32 -mt-32"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-[#7818c6]/10 transition-colors">
                    <span className="material-symbols-outlined text-[#7818c6]">movie_edit</span>
                  </div>
                  <h4 className="text-3xl font-headline font-bold">AI Storyboarder</h4>
                </div>

                <p className="text-white/40 text-lg leading-relaxed mb-10 max-w-sm">
                  Transform scripts into visual masterpieces. Our AI generates consistent characters, breathtaking scenes, and cohesive episodes in seconds.
                </p>
                <div className="flex gap-4">
                  {[homeStory1, homeStory2, homeStory3].map((image, index) => (
                    <div key={index} className="flex-1 aspect-[4/3] rounded-xl overflow-hidden border border-white/10">
                      <img
                        className="w-full h-full object-cover grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
                        src={image}
                        alt="Storyboard sample"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Metric Integration Card */}
            <div className="group p-12 rounded-[2rem] bg-[#161f35] border border-white/5 hover:border-white/10 transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#3da9fc]/5 blur-3xl -mr-32 -mt-32"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-[#7818c6]/10 transition-colors">
                    <span className="material-symbols-outlined text-[#7818c6]">analytics</span>
                  </div>
                  <h4 className="text-3xl font-headline font-bold">Metric Integration</h4>
                </div>
                <p className="text-white/40 text-lg leading-relaxed mb-10 max-w-sm">
                  Link your YouTube channels directly. Visualize retention peaks, demographic shifts, and A/B test thumbnails with AI-predicted performance scores.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-5 bg-white/5 rounded-xl border border-white/10 group-hover:bg-white/[0.08] transition-colors">
                    <div className="flex items-center gap-4">
                      <span className="material-symbols-outlined text-[#3da9fc] text-lg font-bold">trending_up</span>
                      <span className="text-xs font-bold uppercase tracking-widest text-white/80">Retention Prediction</span>
                    </div>
                    <span className="text-[#3da9fc] font-bold">+12.4%</span>
                  </div>
                  <div className="flex items-center justify-between p-5 bg-white/5 rounded-xl border border-white/10 group-hover:bg-white/[0.08] transition-colors">
                    <div className="flex items-center gap-4">
                      <span className="material-symbols-outlined text-[#3da9fc] text-lg font-bold">groups</span>
                      <span className="text-xs font-bold uppercase tracking-widest text-white/80">Audience Sync</span>
                    </div>
                    <span className="text-[#3da9fc] font-bold uppercase text-[10px] tracking-[0.2em]">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-8 bg-black/20 border-t border-white/5">
        <div className="max-w-screen-2xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <h2 className="text-[10px] uppercase tracking-[0.3em] text-[#3da9fc] font-bold">The Creative Workflow</h2>
            <h3 className="text-4xl font-headline font-black text-white">Three Steps to Hyper-Growth.</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-[#161f35]/50 border border-white/5 rounded-2xl space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#7818c6]/10 border border-[#7818c6]/20 flex items-center justify-center text-[#ddb7ff] font-mono font-bold text-sm">01</div>
              <h4 className="font-headline font-bold text-lg">Input Your Blueprint</h4>
              <p className="text-xs text-white/50 leading-relaxed">Paste your video script directly into our system. Our NLP parsers identify core assets, emotional shifts, and environment logs automatically.</p>
            </div>
            <div className="p-8 bg-[#161f35]/50 border border-white/5 rounded-2xl space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#3da9fc]/10 border border-[#3da9fc]/20 flex items-center justify-center text-[#3da9fc] font-mono font-bold text-sm">02</div>
              <h4 className="font-headline font-bold text-lg">Render Dynamic Scenes</h4>
              <p className="text-xs text-white/50 leading-relaxed">Let our decentralized GPU nodes process custom cinematic illustration clusters, ensuring uniform composition and character synchronization.</p>
            </div>
            <div className="p-8 bg-[#161f35]/50 border border-white/5 rounded-2xl space-y-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/70 font-mono font-bold text-sm">03</div>
              <h4 className="font-headline font-bold text-lg">Predict Audience Impact</h4>
              <p className="text-xs text-white/50 leading-relaxed">Review deep AI-simulated metrics before deployment, adjusting frame velocities to map onto maximum organic retention graphs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5️⃣ Pricing Section */}
      <section className="py-32 px-8">
        <Pricing />
      </section>

      <section className="py-24 px-8 border-t border-white/5 bg-gradient-to-b from-transparent to-black/30">
        <div className="max-w-screen-2xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <h2 className="text-[10px] uppercase tracking-[0.3em] text-[#7818c6] font-bold">Endorsements</h2>
            <h3 className="text-4xl font-headline font-black text-white">Trusted by Top Tier Creators.</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className="p-10 bg-[#161f35] border border-white/5 rounded-3xl space-y-6 hover:border-white/10 transition-colors duration-300">
                <p className="text-white/70 italic text-sm md:text-base leading-relaxed">"{t.body}"</p>
                <div className="flex justify-between items-center border-t border-white/5 pt-4">
                  <div>
                    <h4 className="font-bold text-sm text-white">{t.name}</h4>
                    <p className="text-xs text-white/40 mt-0.5">{t.role}</p>
                  </div>
                  <span className="px-3 py-1 bg-[#7818c6]/10 text-[#ddb7ff] font-mono text-[10px] font-bold uppercase rounded-full border border-[#7818c6]/20">
                    {t.score}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7️⃣ Final CTA Section */}
      <section className="py-40 px-10 relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center p-10 rounded-[2rem] bg-[#161f35] border border-white/5 shadow-3xl relative z-10 overflow-hidden">
          <h2 className="text-5xl font-headline font-bold text-white mb-8 tracking-tight">Ready to see your stories <br /> through our lens?</h2>
          <p className="text-lg text-white/40 mb-12 max-w-md mx-auto leading-relaxed">Join 10,000+ creators using VidiMetrics.Ai to redefine their content.</p>
          <div className="flex justify-center">
            <Button variant="primary" size="lg" onClick={() => handleRegister()}>
              Launch Engine
            </Button>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-[#7818c6]/10 to-transparent -mb-48 blur-[100px]"></div>
      </section>
    </div>
  )
}