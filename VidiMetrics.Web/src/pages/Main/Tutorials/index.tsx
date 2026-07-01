import { useState } from "react";

export default function Tutorials() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = ["All", "Getting Started", "API & Dev", "Node Architecture"];

  const guides = [
    {
      title: "VidiMetrics.Ai Quickstart Guide",
      description: "Learn how to upload your first media asset, configure template variables, and monitor your initial credit allocation.",
      duration: "5 min read",
      level: "Beginner",
      category: "Getting Started",
      icon: "play_circle"
    },
    {
      title: "Optimizing Video Rendering via REST API",
      description: "A deep dive into constructing clean JSON payloads, authenticating via OIDC tokens, and handling async webhook responses.",
      duration: "12 min read",
      level: "Intermediate",
      category: "API & Dev",
      icon: "terminal"
    },
    {
      title: "Setting Up Your First Distributed Render Node",
      description: "Step-by-step instructions on connecting your local GPU clusters to our decentralized worker queues using Docker.",
      duration: "20 min read",
      level: "Advanced",
      category: "Node Architecture",
      icon: "dns"
    },
    {
      title: "Understanding Dynamic Credit Calculations",
      description: "How our processing engine maps frames, resolution (1080p vs 4K), and FPS into real-time wallet deductions.",
      duration: "8 min read",
      level: "Beginner",
      category: "Getting Started",
      icon: "account_balance_wallet"
    }
  ];

  const filteredGuides = activeFilter === "All"
    ? guides
    : guides.filter(guide => guide.category === activeFilter);

  return (
    <div className="bg-surface text-white min-h-screen pt-36 pb-20 px-6 md:px-12 transition-all duration-300">
      <div className="max-w-5xl mx-auto space-y-16">

        {/* Header Hero Section */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
            Knowledge Base
          </span>
          <h1 className="text-4xl md:text-5xl font-headline font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/50 tracking-tight">
            Master the Rendering Engine
          </h1>
          <p className="text-white/50 text-base md:text-lg leading-relaxed">
            Explore our curated guides, architectural code walkthroughs, and step-by-step tutorials designed to help you build video automation workflows at scale.
          </p>

          {/* Dynamic Filter Badges */}
          <div className="flex flex-wrap justify-center gap-2 pt-6">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all duration-300 ${activeFilter === filter
                    ? "bg-primary text-black font-bold shadow-[0_0_20px_rgba(var(--color-primary),0.2)]"
                    : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                  }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Tutorials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredGuides.map((guide, idx) => (
            <div
              key={idx}
              className="group bg-white/[0.01] hover:bg-white/[0.02] border border-white/5 hover:border-white/10 p-6 rounded-2xl flex flex-col justify-between space-y-6 transition-all duration-300 relative overflow-hidden"
            >
              {/* Top Meta Details */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-white/5 text-white/40 group-hover:text-primary-light group-hover:bg-primary/5 rounded-xl transition-all duration-300">
                    <span className="material-symbols-outlined text-xl">{guide.icon}</span>
                  </div>
                  <span className={`text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded ${guide.level === "Beginner" ? "text-emerald-400 bg-emerald-500/5" :
                      guide.level === "Intermediate" ? "text-amber-400 bg-amber-500/5" : "text-rose-400 bg-rose-500/5"
                    }`}>
                    {guide.level}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-headline font-bold text-white group-hover:text-primary-light transition-colors duration-200">
                    {guide.title}
                  </h3>
                  <p className="text-xs text-white/50 leading-relaxed">
                    {guide.description}
                  </p>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="flex items-center justify-between border-t border-white/5 pt-4 text-xs text-white/40 font-mono">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">schedule</span>
                  {guide.duration}
                </span>
                <span className="group-hover:text-white flex items-center gap-1 font-bold transition-colors duration-200">
                  Read Guide <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform duration-200">arrow_forward</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Request a Tutorial Callout */}
        <div className="p-8 bg-gradient-to-b from-white/[0.02] to-transparent border border-white/5 rounded-3xl text-center space-y-3">
          <h3 className="text-lg font-headline font-bold text-white">Need a specific deployment guide?</h3>
          <p className="text-xs text-white/50 max-w-lg mx-auto">
            If you are building custom AI video infrastructure or enterprise pipelines and need architectural support, tell our engineering team.
          </p>
          <a
            href="mailto:support@vidimetrics.ai"
            className="inline-block text-xs font-bold uppercase tracking-wider text-primary-light hover:text-primary bg-primary/5 border border-primary/10 hover:bg-primary/10 px-5 py-3 rounded-xl transition-all duration-300"
          >
            Request Custom Documentation
          </a>
        </div>

      </div>
    </div>
  );
}