import { useState } from "react";

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "AI Research", "Infrastructure", "Product Updates"];

  const featuredPost = {
    title: "The Future of Asynchronous Cloud Rendering: Scaling Distributed GPU Nodes",
    description: "An architectural deep dive into how VidiMetrics.Ai handles massive render queues, isolates node environments, and reduces operational credit latency by 40% using optimized Docker clusters.",
    date: "July 1, 2026",
    readTime: "15 min read",
    category: "Infrastructure",
    author: "Dr. K. Aris, Chief Architect",
    tag: "Featured"
  };

  const posts = [
    {
      title: "Optimizing Next-Gen Video Generators for Real-Time Metrics",
      description: "How we train internal analytical networks to parse frame-by-frame data during the active composition stage, avoiding post-render errors.",
      date: "June 24, 2026",
      readTime: "8 min read",
      category: "AI Research",
      author: "Elena Rostov (AI Team)"
    },
    {
      title: "Introducing Webhook Signatures and V1 API Release",
      description: "A complete walkthrough of the changes in our stable enterprise gateway, including full OIDC profile syncs and multi-tenant credit wallets.",
      date: "June 18, 2026",
      readTime: "5 min read",
      category: "Product Updates",
      author: "Samer H., Product Lead"
    },
    {
      title: "Why Decentralized GPU Architecture Beats Traditional Monopolies",
      description: "Breaking down the cost-per-second render efficiencies when shifting rendering tasks away from fixed hyperscalers into specialized distributed pools.",
      date: "June 05, 2026",
      readTime: "10 min read",
      category: "Infrastructure",
      author: "Alex Mercer (Infra Team)"
    }
  ];

  const filteredPosts = activeCategory === "All"
    ? posts
    : posts.filter(post => post.category === activeCategory);

  return (
    <div className="bg-surface text-white min-h-screen pt-36 pb-20 px-6 md:px-12 transition-all duration-300">
      <div className="max-w-5xl mx-auto space-y-16">

        {/* Header Hero Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
          <div className="space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
              VidiMetrics Insights
            </span>
            <h1 className="text-4xl md:text-5xl font-headline font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/50 tracking-tight">
              The Engineering Journal
            </h1>
            <p className="text-white/50 text-sm md:text-base max-w-xl">
              Stay up to date with the latest architectural benchmarks, artificial intelligence breakthroughs, and product updates from our core laboratory.
            </p>
          </div>

          {/* Categories Filter */}
          <div className="flex flex-wrap gap-1.5 self-start md:self-end">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-300 ${activeCategory === cat
                    ? "bg-primary text-black font-bold shadow-[0_0_15px_rgba(var(--color-primary),0.2)]"
                    : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Post Card (Only visible when 'All' or specific category matches) */}
        {(activeCategory === "All" || activeCategory === featuredPost.category) && (
          <div className="group bg-gradient-to-b from-white/[0.02] to-transparent border border-white/5 hover:border-white/10 rounded-3xl p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center transition-all duration-300 cursor-pointer relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 blur-3xl rounded-full pointer-events-none" />

            <div className="lg:col-span-8 space-y-4 relative z-10">
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="text-primary-light bg-primary/10 border border-primary/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[10px]">
                  {featuredPost.tag}
                </span>
                <span className="text-white/40">•</span>
                <span className="text-white/50">{featuredPost.category}</span>
              </div>

              <h2 className="text-2xl md:text-3xl font-headline font-black text-white group-hover:text-primary-light transition-colors duration-200 leading-tight">
                {featuredPost.title}
              </h2>

              <p className="text-xs md:text-sm text-white/50 leading-relaxed max-w-3xl">
                {featuredPost.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2 text-[11px] font-mono text-white/40">
                <span className="text-white/70 font-sans font-medium">{featuredPost.author}</span>
                <span>{featuredPost.date}</span>
                <span>{featuredPost.readTime}</span>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-end">
              <span className="material-symbols-outlined text-white/10 group-hover:text-primary-light/20 text-7xl md:text-8xl transition-colors duration-300 hidden lg:block select-none">
                article
              </span>
            </div>
          </div>
        )}

        {/* Regular Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post, idx) => (
              <div
                key={idx}
                className="group bg-white/[0.01] hover:bg-white/[0.02] border border-white/5 hover:border-white/10 p-6 rounded-2xl flex flex-col justify-between space-y-6 transition-all duration-300 cursor-pointer"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-primary-light">
                    <span>{post.category}</span>
                    <span className="text-white/30 font-normal">{post.readTime}</span>
                  </div>

                  <h3 className="text-base font-headline font-bold text-white group-hover:text-primary-light transition-colors duration-200 line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-xs text-white/40 leading-relaxed line-clamp-3">
                    {post.description}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-4 text-[11px] font-mono text-white/40">
                  <span className="truncate max-w-[150px] font-sans text-white/50">{post.author}</span>
                  <span>{post.date}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-white/[0.01] rounded-2xl border border-white/5">
              <span className="material-symbols-outlined text-white/20 text-3xl mb-2 block">history_edu</span>
              <p className="text-sm text-white/40">No articles found in this category yet.</p>
            </div>
          )}
        </div>

        {/* Newsletter Subscription Box */}
        <div className="p-8 bg-gradient-to-b from-white/[0.02] to-transparent border border-white/5 rounded-3xl text-center space-y-4">
          <h3 className="text-lg font-headline font-bold text-white">Subscribe to Technical Updates</h3>
          <p className="text-xs text-white/50 max-w-md mx-auto leading-relaxed">
            Get major network status architecture reports and deep AI research papers delivered straight to your inbox once a month.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
            <input
              type="email"
              placeholder="Enter your professional email"
              className="flex-1 bg-white/[0.02] focus:bg-white/[0.04] border border-white/5 focus:border-primary/30 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/30 outline-none transition-colors"
            />
            <button className="bg-white text-black font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl hover:bg-white/90 transition-colors whitespace-nowrap">
              Join Newsletter
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}