import Pricing from "../Shared/Pricing";
import { Button } from '@/components/ui/Button';
import homeStory1 from '@/assets/images/home/home-story-1.png';
import homeStory2 from '@/assets/images/home/home-story-2.png';
import homeStory3 from '@/assets/images/home/home-story-3.png';

export default function Home() {
  return (
    <div className="bg-[#0b1326] text-white">
      {/* Hero Section */}
      <section className="relative pt-44 pb-32 px-8 overflow-hidden">
        <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20 items-center relative z-10">
          <div className="lg:col-span-6 space-y-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-[#7818c6] animate-pulse"></span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/60 font-bold">New: Cinematic Engine v4.0</span>
            </div>
            <h1 className="font-headline font-bold text-7xl lg:text-8xl leading-[0.9] tracking-tighter">
              The Future of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ddb7ff] via-[#7818c6] to-[#ddb7ff]">YouTube</span> <br />
              Storytelling
            </h1>
            <p className="text-lg text-white/60 max-w-lg leading-relaxed font-body">
              AI-powered illustrated stories and deep YouTube analytics in one place. Elevate your narrative with data-driven creative precision.
            </p>
            <div className="flex flex-wrap gap-6 pt-4">
              <Button variant="primary" size="lg">
                Get Started
              </Button>
              <Button variant="secondary" size="lg" icon={<span className="material-symbols-outlined text-lg">play_circle</span>}>
                Watch Demo
              </Button>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative aspect-square max-w-xl ml-auto group">
              {/* Outer Glow */}
              <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full -z-10 animate-pulse"></div>
              {/* Illustration Frame */}
              <div className="w-full h-full rounded-[2.5rem] p-8 bg-[#161f35] border border-white/10 shadow-2xl overflow-hidden relative">
                <div className="w-full h-full rounded-2xl overflow-hidden relative">
                  <img
                    className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDw2K9FIoyTSkQXUl0yHnXNOLQm5bV_FRfZgcGzAZoMXevYiZgvaPxI72fgNtcOTdTepddjTbswkIxCc3sbob0pXuyUwpoFFMyFJp3rK7ehVJ5cWc67yY1hoyT42ScraztkP6O9vWeCa46GcYNPvQ9VmnxdxMRrmmVUMkvOWVxyBjSSTiW4JsqC3oULapA0fcrVRuXJlUOWUce0mQJvoZXduq3fwh57EwowCuSMr1FYlgbegeM4sjFrXv8WB1R2wpmjIh19PLzGhKQ"
                    alt="Cinematic Visualization"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b1326] via-transparent to-transparent"></div>
                  <div className="absolute bottom-8 left-8 right-8 p-6 glass-panel rounded-xl border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7818c6]">Live Generation</span>
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
        {/* Abstract Background Gradients */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 blur-[160px] rounded-full -mr-96 -mt-96 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/5 blur-[120px] rounded-full -ml-40 -mb-40 pointer-events-none"></div>
      </section>

      {/* Core Engine Section */}
      <section className="py-20 px-8">
        <div className="max-w-screen-2xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-[10px] uppercase tracking-[0.3em] text-[#7818c6] font-bold">The Core Engine</h2>
            <h3 className="text-5xl font-headline font-bold text-white tracking-tight">From Prompt to Performance.</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* AI Storyboarder Card */}
            <div className="group p-12 rounded-[2rem] bg-[#161f35] border border-white/5 hover:border-white/10 transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl -mr-32 -mt-32"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center mb-8 border border-white/10 group-hover:bg-[#7818c6]/10 transition-colors">
                  <span className="material-symbols-outlined text-[#7818c6]">movie_edit</span>
                </div>
                <h4 className="text-2xl font-headline font-bold mb-4">AI Storyboarder</h4>
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
                <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center mb-8 border border-white/10 group-hover:bg-[#3da9fc]/10 transition-colors">
                  <span className="material-symbols-outlined text-[#3da9fc]">analytics</span>
                </div>
                <h4 className="text-2xl font-headline font-bold mb-4">Metric Integration</h4>
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

      {/* Pricing Section */}
      <section className="py-32 px-8">
        <Pricing />
      </section>

      {/* Final CTA Section */}
      <section className="py-40 px-10 relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center p-10 rounded-[2rem] bg-[#161f35] border border-white/5 shadow-3xl relative z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent"></div>
          <h2 className="text-5xl font-headline font-bold text-white mb-8 tracking-tight">Ready to see your stories <br /> through our lens?</h2>
          <p className="text-lg text-white/40 mb-12 max-w-md mx-auto leading-relaxed">Join 10,000+ creators using VidiMetrics.Ai to redefine their content.</p>
          <div className="flex justify-center">
            <Button variant="accent" size="lg">
              Launch Engine
            </Button>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-primary/10 to-transparent -mb-48 blur-[100px]"></div>
      </section>
    </div>
  )
}
