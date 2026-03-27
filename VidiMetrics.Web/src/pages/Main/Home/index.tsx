export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-8 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 -z-10 w-[400px] h-[400px] bg-secondary/10 blur-[100px] rounded-full"></div>

        <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high ghost-border">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              <span className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">New: Cinematic Engine v4.0</span>
            </div>
            <h1 className="font-headline font-bold text-6xl md:text-8xl leading-tight tracking-tighter text-on-surface">
              The Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-tertiary">YouTube</span> Storytelling
            </h1>
            <p className="text-xl text-on-surface-variant max-w-2xl leading-relaxed">
              AI-powered illustrated stories and deep YouTube analytics in one place. Elevate your narrative with data-driven creative precision.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button className="px-8 py-4 btn-gradient font-headline font-bold text-lg rounded-xl shadow-lg shadow-primary/20">
                Get Started
              </button>
              <button className="px-8 py-4 glass-morphism ghost-border text-on-surface font-headline font-bold text-lg rounded-xl flex items-center gap-2 hover:bg-surface-variant/40 transition-all">
                <span className="material-symbols-outlined">play_circle</span>
                Watch Demo
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="aspect-square rounded-3xl overflow-hidden glass-morphism ghost-border p-4">
              <div className="w-full h-full rounded-2xl overflow-hidden relative">
                <img
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDw2K9FIoyTSkQXUl0yHnXNOLQm5bV_FRfZgcGzAZoMXevYiZgvaPxI72fgNtcOTdTepddjTbswkIxCc3sbob0pXuyUwpoFFMyFJp3rK7ehVJ5cWc67yY1hoyT42ScraztkP6O9vWeCa46GcYNPvQ9VmnxdxMRrmmVUMkvOWVxyBjSSTiW4JsqC3oULapA0fcrVRuXJlUOWUce0mQJvoZXduq3fwh57EwowCuSMr1FYlgbegeM4sjFrXv8WB1R2wpmjIh19PLzGhKQ"
                  alt="Cinematic Visualization"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-dim to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 p-6 glass-morphism rounded-xl ghost-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-secondary">Live Generation</span>
                    <span className="text-xs text-on-surface-variant">84% Complete</span>
                  </div>
                  <div className="w-full bg-surface-container-lowest h-1.5 rounded-full overflow-hidden">
                    <div className="bg-secondary w-[84%] h-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Engine Section */}
      <section className="py-32 px-8 bg-surface-container-low/30">
        <div className="max-w-screen-2xl mx-auto">
          <div className="mb-20 space-y-4">
            <h2 className="text-xs uppercase tracking-widest text-primary font-bold">The Core Engine</h2>
            <h3 className="text-4xl md:text-5xl font-headline font-bold text-on-surface">From Prompt to Performance.</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* AI Storyboarder Card */}
            <div className="group p-10 rounded-3xl glass-morphism ghost-border hover:bg-surface-container-high transition-all duration-500">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-primary text-4xl">movie_edit</span>
              </div>
              <h4 className="text-2xl font-headline font-bold text-on-surface mb-4">AI Storyboarder</h4>
              <p className="text-on-surface-variant text-lg leading-relaxed mb-8">
                Transform scripts into visual masterpieces. Our AI generates consistent characters, breathtaking scenes, and cohesive episodes in seconds.
              </p>
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="aspect-video rounded-lg overflow-hidden ghost-border">
                    <img
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all"
                      src={`https://lh3.googleusercontent.com/aida-public/AB6AXuCXiSyX1kQAzw0DLxo1xyflEHg-ARKhK64ZHc2F0rZT61-uo_XHw6NtSa9Qhj1FhGqPLOgq-ZYy_YN4q5sY6zG2StccSDjRRONraGjTY2Fh1f4XznZdEOnaWK3M_4J5WfprAmRaWiZKFecqjZYVYQBYOHFJ_BnkulshnySwTHOUCOFsEWzru0dJmAumXLF-TYu-5-TLSVXtP4IzGgcTIoDggzpvvH3B6am8QhkLf0sbAcyR755DlRnGKt9Er5t7JlNdpJDMLaxCP-c`}
                      alt="Storyboard sample"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* YouTube Analytics Card */}
            <div className="group p-10 rounded-3xl glass-morphism ghost-border hover:bg-surface-container-high transition-all duration-500">
              <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-secondary text-4xl">analytics</span>
              </div>
              <h4 className="text-2xl font-headline font-bold text-on-surface mb-4">Metric Integration</h4>
              <p className="text-on-surface-variant text-lg leading-relaxed mb-8">
                Link your YouTube channels directly. Visualize retention peaks, demographic shifts, and A/B test thumbnails with AI-predicted performance scores.
              </p>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-xl ghost-border">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-secondary">trending_up</span>
                    <span className="text-sm">Retention Prediction</span>
                  </div>
                  <span className="text-secondary font-headline font-bold">+12.4%</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-xl ghost-border">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-secondary">groups</span>
                    <span className="text-sm">Audience Sync</span>
                  </div>
                  <span className="text-secondary font-headline font-bold">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 px-8 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center glass-morphism ghost-border p-16 rounded-[3rem] relative z-10">
          <h2 className="text-4xl md:text-5xl font-headline font-bold text-on-surface mb-6">Ready to see your stories through our lens?</h2>
          <p className="text-xl text-on-surface-variant mb-10">Join 10,000+ creators using VidiMetrics.Ai to redefine their content.</p>
          <div className="flex justify-center">
            <button className="px-10 py-5 bg-gradient-to-r from-secondary to-secondary-container text-on-secondary-container font-headline font-bold text-xl rounded-2xl hover:brightness-110 transition-all active:scale-95">
              Launch Engine
            </button>
          </div>
        </div>
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent"></div>
      </section>
    </>
  )
}
