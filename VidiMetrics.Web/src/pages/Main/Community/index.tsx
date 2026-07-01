import { useState } from "react";

export default function Community() {
  const [searchQuery, setSearchQuery] = useState("");

  const channels = [
    { name: "announcements", desc: "Official updates, core infrastructure feature drops, and system upgrades.", posts: 42, icon: "campaign" },
    { name: "showcase-your-work", desc: "Share your AI-generated videos, customized rendering pipelines, and metrics templates.", posts: 1204, icon: "movie" },
    { name: "node-operators", desc: "Discussions regarding distributed worker queues, GPU optimization, and node syncing bugs.", posts: 341, icon: "dns" },
    { name: "api-integrations", desc: "Technical QA on building webhooks, token authentication, and managing client credits via REST.", posts: 892, icon: "terminal" },
    { name: "general-chat", desc: "Hangout with other creators, share industry news, or network with fellow engineers.", posts: 2450, icon: "forum" },
  ];

  const topContributors = [
    { name: "Alex_NodeFX", role: "GPU Core Specialist", avatar: "A", color: "from-blue-500 to-indigo-600" },
    { name: "Samer_Dev", role: "API Master", avatar: "S", color: "from-emerald-500 to-teal-600" },
    { name: "Elena_AI", role: "Prompt Engineer", avatar: "E", color: "from-purple-500 to-pink-600" },
  ];

  const filteredChannels = channels.filter(channel =>
    channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    channel.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-surface text-white min-h-screen pt-36 pb-20 px-6 md:px-12 transition-all duration-300">
      <div className="max-w-6xl mx-auto space-y-16">

        {/* Header Hero Section */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
            VidiMetrics Ecosystem
          </span>
          <h1 className="text-4xl md:text-5xl font-headline font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/50 tracking-tight">
            Connect & Engineer Together
          </h1>
          <p className="text-white/50 text-base md:text-lg leading-relaxed">
            Join thousands of distributed system developers, AI media creators, and node infrastructure operators building the decentralized future of video analytics.
          </p>

          {/* Search Box */}
          <div className="pt-4 max-w-md mx-auto relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-xl">search</span>
            <input
              type="text"
              placeholder="Search community channels or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.02] focus:bg-white/[0.04] border border-white/5 focus:border-primary/30 rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder-white/30 outline-none transition-all duration-300"
            />
          </div>
        </div>

        {/* Dynamic Community Core Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: Discussion Channels */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-base font-headline font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">tag</span>
                Discussion Channels
              </h3>
              <span className="text-xs font-mono text-white/40">{filteredChannels.length} hubs available</span>
            </div>

            <div className="space-y-3">
              {filteredChannels.length > 0 ? (
                filteredChannels.map((channel, idx) => (
                  <div
                    key={idx}
                    className="group bg-white/[0.01] hover:bg-white/[0.02] border border-white/5 hover:border-white/10 p-5 rounded-2xl flex items-start gap-4 transition-all duration-300 cursor-pointer"
                  >
                    <div className="p-3 bg-white/5 group-hover:bg-primary/10 border border-transparent group-hover:border-primary/10 text-white/40 group-hover:text-primary-light rounded-xl flex items-center justify-center transition-all duration-300">
                      <span className="material-symbols-outlined text-xl">{channel.icon}</span>
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between gap-4">
                        <h4 className="font-mono text-sm font-bold text-white group-hover:text-primary-light transition-colors duration-200">
                          #{channel.name}
                        </h4>
                        <span className="text-[11px] font-mono font-medium text-white/30 bg-white/5 px-2 py-0.5 rounded-md">
                          {channel.posts} threads
                        </span>
                      </div>
                      <p className="text-xs text-white/50 leading-relaxed max-w-2xl">
                        {channel.desc}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-white/[0.01] rounded-2xl border border-white/5">
                  <span className="material-symbols-outlined text-white/20 text-3xl mb-2 block">comments_disabled</span>
                  <p className="text-sm text-white/40">No channels match your search filter.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Community Sidebar Insights */}
          <div className="lg:col-span-4 space-y-6">

            {/* Box 1: Join External Server */}
            <div className="p-6 bg-gradient-to-b from-white/[0.02] to-transparent border border-white/5 rounded-2xl space-y-4 relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-primary/5 blur-2xl rounded-full" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">Join the VidiMetrics Discord</h4>
                <p className="text-xs text-white/50 leading-relaxed">
                  Prefer real-time chat? Join our active developer chat rooms to get instant support and peer code reviews.
                </p>
              </div>
              <button className="w-full bg-white text-black font-bold text-xs uppercase tracking-wider py-2.5 rounded-xl hover:bg-white/90 transition-colors duration-300">
                Launch Discord Server
              </button>
            </div>

            {/* Box 2: Top Contributors */}
            <div className="p-6 bg-white/[0.01] border border-white/5 rounded-2xl space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white/40 border-b border-white/5 pb-2">
                Top Ecosystem Contributors
              </h4>
              <div className="space-y-3">
                {topContributors.map((user, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${user.color} flex items-center justify-center text-xs font-black font-mono text-white shadow-sm`}>
                      {user.avatar}
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-white">{user.name}</div>
                      <div className="text-[10px] text-white/40 font-mono">{user.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}