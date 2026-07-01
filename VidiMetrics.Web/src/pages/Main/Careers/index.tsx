import { useState } from "react";

export default function Careers() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const perks = [
    { icon: "bolt", title: "Cutting-Edge Stack", desc: "Work with advanced GPU clusters, Next.js, FastAPI, and distributed AI models." },
    { icon: "distance", title: "Remote-First", desc: "We optimize for deep work. Work from anywhere in the world, on your own schedule." },
    { icon: "wallet", title: "Competitive Equity", desc: "Generous salary packages combined with high-upside early-stage stock options." },
    { icon: "fitness_center", title: "Health & Wellness", desc: "Comprehensive health coverage plus a yearly stipend for mental and physical fitness." }
  ];

  const jobs = [
    { id: 1, title: "Senior AI / Infrastructure Engineer", category: "Engineering", type: "Full-Time", location: "Remote" },
    { id: 2, title: "Distributed Systems & Render Node Developer", category: "Engineering", type: "Full-Time", location: "Remote" },
    { id: 3, title: "Senior Product Designer (UI/UX)", category: "Design", type: "Full-Time", location: "Remote (EU/ME Timezones)" },
    { id: 4, title: "Enterprise Growth Account Executive", category: "Growth", type: "Contract / Full-Time", location: "Remote" }
  ];

  const categories = ["All", "Engineering", "Design", "Growth"];

  const filteredJobs = selectedCategory === "All"
    ? jobs
    : jobs.filter(job => job.category === selectedCategory);

  return (
    <div className="bg-surface text-white min-h-screen pt-36 pb-20 px-6 md:px-12 transition-all duration-300">
      <div className="max-w-5xl mx-auto space-y-20">

        {/* Header Hero Section */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
            We are hiring
          </span>
          <h1 className="text-4xl md:text-5xl font-headline font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/50 tracking-tight">
            Build the Future of Video AI
          </h1>
          <p className="text-white/50 text-base md:text-lg leading-relaxed">
            Join a lean, highly technical team automating complex media workflows, training real-time metrics engines, and scaling cloud-rendering nodes globally.
          </p>
        </div>

        {/* Culture & Perks Grid */}
        <div className="space-y-8">
          <div className="border-l-2 border-primary pl-4">
            <h3 className="text-lg font-headline font-bold text-white">Why VidiMetrics.Ai?</h3>
            <p className="text-xs text-white/40 mt-0.5">The infrastructure that empowers creators and engineering teams.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {perks.map((perk, idx) => (
              <div key={idx} className="bg-white/[0.01] border border-white/5 p-6 rounded-2xl flex items-start gap-4 hover:border-white/10 hover:bg-white/[0.02] transition-all duration-300">
                <div className="p-3 bg-primary/5 border border-primary/10 text-primary-light rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">{perk.icon}</span>
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-white">{perk.title}</h4>
                  <p className="text-xs text-white/50 leading-relaxed">{perk.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Open Positions Section */}
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-4">
            <div>
              <h3 className="text-xl font-headline font-bold text-white">Open Positions</h3>
              <p className="text-xs text-white/40 mt-0.5">Explore our active career paths and pipelines.</p>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${selectedCategory === cat
                    ? "bg-primary text-black font-bold shadow-[0_0_15px_rgba(var(--color-primary),0.3)]"
                    : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Job Listings Loop */}
          <div className="space-y-3">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="group bg-white/[0.01] hover:bg-white/[0.02] border border-white/5 hover:border-white/10 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 cursor-pointer"
                >
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-primary-light bg-primary/5 px-2 py-0.5 rounded">
                      {job.category}
                    </span>
                    <h4 className="text-base font-bold text-white group-hover:text-primary-light transition-colors duration-300">
                      {job.title}
                    </h4>
                    <div className="flex items-center gap-4 text-xs text-white/40 font-medium">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">schedule</span> {job.type}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">location_on</span> {job.location}
                      </span>
                    </div>
                  </div>

                  <button className="self-start md:self-center px-4 py-2 bg-white/5 group-hover:bg-white group-hover:text-black rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap">
                    Apply Now
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white/[0.01] rounded-2xl border border-white/5">
                <span className="material-symbols-outlined text-white/20 text-3xl mb-2 block">search_off</span>
                <p className="text-sm text-white/40">No positions open in this category right now.</p>
              </div>
            )}
          </div>
        </div>

        {/* Speculative Application Box */}
        <div className="p-8 bg-gradient-to-b from-white/[0.02] to-transparent border border-white/5 rounded-3xl text-center space-y-4">
          <h3 className="text-lg font-headline font-bold text-white">Don't see your role?</h3>
          <p className="text-xs text-white/50 max-w-xl mx-auto leading-relaxed">
            We are always hunting for exceptional infrastructure engineers, AI specialists, and distributed system architects. Drop us your GitHub link or portfolio directly.
          </p>
          <a
            href="mailto:jobs@vidimetrics.ai"
            className="inline-block text-xs font-bold uppercase tracking-wider text-primary-light hover:text-primary bg-primary/5 border border-primary/10 hover:bg-primary/10 px-5 py-3 rounded-xl transition-all duration-300"
          >
            Send Spontaneous Application
          </a>
        </div>

      </div>
    </div>
  );
}