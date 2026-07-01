export default function About() {
  const stats = [
    { value: "99.99%", label: "Render Uptime" },
    { value: "40M+", label: "Credits Processed" },
    { value: "150ms", label: "Average API Latency" },
    { value: "24/7", label: "Node Monitoring" },
  ];

  const milestones = [
    { year: "2024", title: "The Spark", desc: "VidiMetrics.Ai was founded with a mission to decouple rendering infrastructure from rigid, expensive cloud monopolies." },
    { year: "2025", title: "Distributed Nodes Go Live", desc: "Launched our decentralized worker queues, drastically reducing cost-per-credit render metrics for global enterprise users." },
    { year: "2026", title: "AI Metrics Automation", desc: "Integrated fully automated real-time analytics to measure rendering output accuracy and resource consumption instantly." },
  ];

  return (
    <div className="bg-surface text-white min-h-screen pt-36 pb-20 px-6 md:px-12 transition-all duration-300">
      <div className="max-w-5xl mx-auto space-y-24">

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
              Our Vision
            </span>
            <h1 className="text-4xl md:text-5xl font-headline font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/50 tracking-tight leading-none">
              Democratizing High-Performance Video AI.
            </h1>
            <p className="text-white/60 text-base md:text-lg leading-relaxed pt-2">
              At <span className="text-primary-light font-bold">VidiMetrics.Ai</span>, we build the cloud infrastructure layer that connects distributed computing power with intelligent video analytics. We empower creators and enterprises to render, compute, and optimize video data at scale without the overhead infrastructure bottleneck.
            </p>
          </div>

          {/* Abstract Grid Graphic */}
          <div className="lg:col-span-5 bg-gradient-to-br from-white/[0.02] to-transparent border border-white/5 p-8 rounded-3xl relative overflow-hidden h-64 flex items-center justify-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--color-primary),0.05)_0%,transparent_70%)]" />
            <div className="grid grid-cols-3 gap-3 w-full max-w-xs relative z-10 opacity-60">
              {[...Array(9)].map((_, i) => (
                <div key={i} className={`h-12 border rounded-xl transition-all duration-1000 ${i % 2 === 0 ? "bg-primary/5 border-primary/20 animate-pulse" : "border-white/5 bg-white/[0.01]"}`} />
              ))}
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white/[0.01] border border-white/5 p-6 rounded-2xl text-center space-y-1 hover:border-white/10 transition-colors duration-300">
              <div className="text-2xl md:text-3xl font-mono font-black text-primary-light tracking-tight">
                {stat.value}
              </div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-white/40">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Core Philosophy / Mission */}
        <div className="space-y-8">
          <div className="border-l-2 border-primary pl-4">
            <h3 className="text-lg font-headline font-bold text-white">Our Core Philosophy</h3>
            <p className="text-xs text-white/40 mt-0.5">How we engineer solutions differently.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white/[0.01] border border-white/5 rounded-2xl space-y-3">
              <span className="material-symbols-outlined text-primary-light text-2xl">dns</span>
              <h4 className="font-bold text-sm text-white">Resource Optimization</h4>
              <p className="text-xs text-white/50 leading-relaxed">We optimize rendering sequences down to the millisecond, utilizing low-latency worker routing to keep credits inexpensive.</p>
            </div>

            <div className="p-6 bg-white/[0.01] border border-white/5 rounded-2xl space-y-3">
              <span className="material-symbols-outlined text-primary-light text-2xl">lock</span>
              <h4 className="font-bold text-sm text-white">Isolated Security</h4>
              <p className="text-xs text-white/50 leading-relaxed">Identity isolation via secure token layers ensures account data, metrics, and computing payloads remain confidential.</p>
            </div>

            <div className="p-6 bg-white/[0.01] border border-white/5 rounded-2xl space-y-3">
              <span className="material-symbols-outlined text-primary-light text-2xl">insights</span>
              <h4 className="font-bold text-sm text-white">Data-Driven Insights</h4>
              <p className="text-xs text-white/50 leading-relaxed">We do not just compile videos; we extract deeper performance metrics to analyze cloud-rendering yield instantly.</p>
            </div>
          </div>
        </div>

        {/* Timeline / Milestones */}
        <div className="space-y-8">
          <div className="border-l-2 border-primary pl-4">
            <h3 className="text-lg font-headline font-bold text-white">The Journey So Far</h3>
            <p className="text-xs text-white/40 mt-0.5">Tracking our developmental pipeline velocity.</p>
          </div>

          <div className="relative border-l border-white/5 ml-4 pl-8 space-y-10">
            {milestones.map((m, idx) => (
              <div key={idx} className="relative group">
                {/* Timeline Bullet */}
                <div className="absolute -left-[41px] top-1 w-5 h-5 bg-surface border border-white/10 rounded-full flex items-center justify-center group-hover:border-primary transition-colors duration-300">
                  <div className="w-2 h-2 bg-white/20 group-hover:bg-primary rounded-full transition-colors duration-300" />
                </div>

                {/* Content */}
                <div className="space-y-1">
                  <span className="font-mono text-xs font-bold text-primary-light">{m.year}</span>
                  <h4 className="font-bold text-base text-white group-hover:text-primary-light transition-colors duration-300">{m.title}</h4>
                  <p className="text-xs text-white/50 max-w-2xl leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}