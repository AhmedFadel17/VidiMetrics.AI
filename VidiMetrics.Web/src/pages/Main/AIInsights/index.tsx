import { useState } from "react";

export default function AiInsights() {
  const [selectedModel, setSelectedModel] = useState("All Active Nodes");

  const globalMetrics = [
    { label: "Neural Fidelity Score", value: "94.8%", sub: "+1.2% variance", trend: "up" },
    { label: "Avg Node Processing Temp", value: "62°C", sub: "Optimal range", trend: "stable" },
    { label: "Token Parsing Velocity", value: "1.4k /s", sub: "Zero queue latency", trend: "up" },
    { label: "AI Resource Yield", value: "98.2%", sub: "Minimal loss", trend: "up" }
  ];

  const layerInsights = [
    {
      id: "LYR-09",
      scene: "Scene 1: Neon Cluster Intro",
      modelUsed: "VidiDiffusion-v2.5",
      accuracy: 96,
      renderTime: "4.2s",
      status: "Optimized"
    },
    {
      id: "LYR-12",
      scene: "Scene 2: Holographic Grid Analytics",
      modelUsed: "VidiDiffusion-v2.5",
      accuracy: 91,
      renderTime: "7.8s",
      status: "Optimized"
    },
    {
      id: "LYR-14",
      scene: "Scene 3: Deep Space Rendering Loop",
      modelUsed: "Custom-Sora-Node",
      accuracy: 88,
      renderTime: "12.1s",
      status: "Heavy Load"
    }
  ];

  return (
    <div className="bg-surface text-white min-h-screen pt-36 pb-20 px-6 md:px-12 transition-all duration-300">
      <div className="max-w-6xl mx-auto space-y-16">

        {/* Top Header & Filter Controller */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-6">
          <div className="space-y-1.5">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
              Real-Time Neural Logs
            </span>
            <h1 className="text-3xl md:text-4xl font-headline font-black tracking-tight">
              AI Insights Engine
            </h1>
            <p className="text-white/50 text-xs md:text-sm">
              Audit cognitive visual consistency, token vector parameters, and real-time node computational performance.
            </p>
          </div>

          {/* Selector Filter */}
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-1.5 flex gap-1 self-start md:self-center font-mono text-xs">
            {["All Active Nodes", "VidiDiffusion", "Sora Cluster"].map((node) => (
              <button
                key={node}
                onClick={() => setSelectedModel(node)}
                className={`px-3 py-1.5 rounded-lg transition-all duration-300 font-medium ${selectedModel === node
                    ? "bg-white/5 text-primary-light font-bold border border-white/10"
                    : "text-white/40 hover:text-white"
                  }`}
              >
                {node}
              </button>
            ))}
          </div>
        </div>

        {/* Global Statistics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {globalMetrics.map((metric, idx) => (
            <div key={idx} className="bg-white/[0.01] border border-white/5 p-5 rounded-2xl space-y-2 hover:border-white/10 transition-colors duration-300">
              <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 block">
                {metric.label}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl md:text-3xl font-mono font-black text-white">{metric.value}</span>
                <span className={`text-[10px] font-mono font-medium ${metric.trend === "up" ? "text-emerald-400" : "text-white/30"
                  }`}>
                  {metric.trend === "up" ? "↑" : "•"}
                </span>
              </div>
              <p className="text-[11px] text-white/30 font-sans">{metric.sub}</p>
            </div>
          ))}
        </div>

        {/* Neural Analytics Progress Tracking & Table Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Table Section: Active Layer Performance (8 Columns) */}
          <div className="lg:col-span-8 bg-white/[0.01] border border-white/5 rounded-2xl overflow-hidden">
            <div className="p-4 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
              <h3 className="text-xs font-headline font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm">analytics</span>
                Scene Architecture Audit logs
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-medium">
                <thead className="bg-black/20 text-white/40 font-mono text-[10px] tracking-wider uppercase border-b border-white/5">
                  <tr>
                    <th className="p-4">Layer ID</th>
                    <th className="p-4">Target Scene</th>
                    <th className="p-4">Model Pipeline</th>
                    <th className="p-4">Prompt Sync</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-white/70">
                  {layerInsights.map((layer) => (
                    <tr key={layer.id} className="hover:bg-white/[0.01] transition-colors group">
                      <td className="p-4 font-mono text-white/40 group-hover:text-primary-light transition-colors">{layer.id}</td>
                      <td className="p-4 font-bold text-white max-w-[180px] truncate">{layer.scene}</td>
                      <td className="p-4 font-mono text-[11px]">{layer.modelUsed}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-12 bg-white/5 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${layer.accuracy >= 90 ? "bg-emerald-400" : "bg-amber-400"}`}
                              style={{ width: `${layer.accuracy}%` }}
                            />
                          </div>
                          <span className="font-mono text-[11px] text-white/80">{layer.accuracy}%</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${layer.status === "Optimized" ? "text-emerald-400 bg-emerald-500/5" : "text-amber-400 bg-amber-500/5"
                          }`}>
                          {layer.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Section: Node Health Diagnostic Widget (4 Columns) */}
          <div className="lg:col-span-4 bg-gradient-to-b from-white/[0.02] to-transparent border border-white/5 p-6 rounded-2xl space-y-6">
            <h3 className="text-xs font-headline font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3">
              Cluster Vitals Status
            </h3>

            <div className="space-y-4">
              {/* Metric Card 1 */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-white/50">GPU Memory Allocation</span>
                  <span className="font-mono text-white/80">14.2 GB / 24 GB</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-xl overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-primary-light w-[60%] rounded-xl" />
                </div>
              </div>

              {/* Metric Card 2 */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-white/50">Active Batch Queue Load</span>
                  <span className="font-mono text-white/80">32% Capacity</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-xl overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-primary-light w-[32%] rounded-xl" />
                </div>
              </div>
            </div>

            <div className="bg-black/30 border border-white/5 p-4 rounded-xl flex gap-3 items-start">
              <span className="material-symbols-outlined text-primary-light text-lg">verified_user</span>
              <p className="text-[11px] text-white/40 leading-relaxed">
                Analytical layers are fully certified against the VidiMetrics safety architecture protocol, ensuring no invalid frame noise corruption.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}