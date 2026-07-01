import { useState } from "react";

export default function FeaturesPage() {
  const coreFeatures = [
    {
      icon: "grid_view",
      title: "Decentralized GPU Clusters",
      desc: "Distribute your heavy rendering workloads across an elastic framework of decentralized node operators, bypassing traditional cloud hardware monopolies."
    },
    {
      icon: "psychology",
      title: "Context-Aware AI Prompting",
      desc: "Our model parsing architecture breaks down complex prompt sequences into frame-by-frame asset layouts, guaranteeing strict visual consistency."
    },
    {
      icon: "account_balance_wallet",
      title: "Granular Credit Auditing",
      desc: "Track every milli-credit spent. Real-time logging maps resolution, target FPS, and generative complexity straight to your multi-tenant wallet."
    },
    {
      icon: "api",
      title: "Native REST & Webhook Gateways",
      desc: "Trigger high-volume renders via automated JSON payloads and handle async callbacks instantly without system polling bottlenecks."
    },
    {
      icon: "speed",
      title: "Parallel Rendering Pipeline",
      desc: "Break a single long-form video into simultaneous multi-scene blocks, rendering them across independent node workers to slash wait times by 70%."
    },
    {
      icon: "security",
      title: "Isolated Sandbox Security",
      desc: "Every background rendering node containerizes execution variables inside a temporary, encrypted environment backed by OIDC tokens."
    }
  ];

  return (
    <div className="bg-surface text-white min-h-screen pt-36 pb-20 px-6 md:px-12 transition-all duration-300">
      <div className="max-w-6xl mx-auto space-y-24">

        {/* Hero Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
            Platform Capabilities
          </span>
          <h1 className="text-4xl md:text-6xl font-headline font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/40 tracking-tight leading-none">
            Next-Gen Architecture for Video Automation.
          </h1>
          <p className="text-white/50 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            VidiMetrics.Ai replaces rigid legacy infrastructure with high-performance distributed computing built explicitly for generative AI pipelines.
          </p>
        </div>

        {/* Features Bento-Style Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreFeatures.map((feat, idx) => (
            <div
              key={idx}
              className="group bg-white/[0.01] hover:bg-white/[0.02] border border-white/5 hover:border-white/10 p-6 rounded-2xl space-y-4 transition-all duration-300 relative overflow-hidden"
            >
              {/* Subtle ambient glow on hover */}
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Feature Icon Container */}
              <div className="w-10 h-10 bg-white/5 border border-white/5 text-white/40 group-hover:text-primary-light group-hover:border-primary/20 rounded-xl flex items-center justify-center transition-all duration-300">
                <span className="material-symbols-outlined text-xl">{feat.icon}</span>
              </div>

              {/* Title & Description */}
              <div className="space-y-2 relative z-10">
                <h3 className="font-headline font-bold text-base text-white group-hover:text-primary-light transition-colors duration-200">
                  {feat.title}
                </h3>
                <p className="text-xs text-white/40 leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Technical Efficiency Metrics Split Section */}
        <div className="bg-gradient-to-b from-white/[0.02] to-transparent border border-white/5 rounded-3xl p-8 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <h3 className="text-xl md:text-2xl font-headline font-black text-white">
              Why Engineers Choose VidiMetrics.Ai
            </h3>
            <p className="text-xs md:text-sm text-white/50 leading-relaxed">
              Traditional cloud hyperscalers lock you into rigid pricing models and single-cluster resource limitations. Our distributed pipeline optimizes resource handshakes to unlock maximum frame rendering velocities.
            </p>

            <div className="pt-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-white/60">
                <span className="material-symbols-outlined text-emerald-400 text-sm">check_circle</span>
                Auto-failover to concurrent node pools
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-white/60">
                <span className="material-symbols-outlined text-emerald-400 text-sm">check_circle</span>
                Dynamic resolution optimization matrix
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="p-5 bg-white/[0.01] border border-white/5 rounded-2xl">
              <span className="text-[10px] font-mono text-white/40 uppercase block">Render Acceleration</span>
              <span className="text-3xl font-mono font-black text-white mt-1 block">4.2x</span>
              <p className="text-[11px] text-white/30 mt-1">Faster completion vs legacy AWS EC2 instances.</p>
            </div>
            <div className="p-5 bg-white/[0.01] border border-white/5 rounded-2xl">
              <span className="text-[10px] font-mono text-white/40 uppercase block">Infrastructure Overhead</span>
              <span className="text-3xl font-mono font-black text-primary-light mt-1 block">-60%</span>
              <p className="text-[11px] text-white/30 mt-1">Reduction in raw compute fees via decentralized nodes.</p>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="text-center space-y-4">
          <h3 className="text-lg font-headline font-bold text-white">Experience the rendering evolution today.</h3>
          <div className="flex justify-center gap-3">
            <button className="px-5 py-3 bg-white text-black font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-white/90 transition-colors">
              Deploy First Node
            </button>
            <button className="px-5 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl text-xs uppercase tracking-wider border border-white/5 transition-colors">
              View API Specs
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}