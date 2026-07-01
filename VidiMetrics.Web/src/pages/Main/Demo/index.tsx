import { useState } from "react";

export default function WatchDemo() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeTab, setActiveTab] = useState("telemetry");

    const telemetryLogs = [
        { timestamp: "00:02.15", event: "Node handshake verified", status: "success" },
        { timestamp: "00:04.40", event: "Frame buffer compilation sequence alpha", status: "success" },
        { timestamp: "00:07.12", event: "Injecting 4K analytical metadata vector", status: "success" },
        { timestamp: "00:11.85", event: "Dynamic lighting array pass completed", status: "success" },
    ];

    return (
        <div className="bg-surface text-white min-h-screen pt-36 pb-20 px-6 md:px-12 transition-all duration-300">
            <div className="max-w-6xl mx-auto space-y-10">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
                    <div className="space-y-2">
                        <span className="text-xs font-mono font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
                            Interactive Lab Simulation
                        </span>
                        <h1 className="text-3xl md:text-4xl font-headline font-black tracking-tight">
                            Architecture Sandbox Demo
                        </h1>
                        <p className="text-white/50 text-xs md:text-sm">
                            Observe real-time GPU container execution and vector rendering telemetry synced directly to the video output playback.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[11px] px-3 py-1.5 rounded-xl self-start md:self-auto">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        Live Render Simulation Active
                    </div>
                </div>

                {/* Core Workspace Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

                    {/* 1️⃣ Analytical Interactive Video Player (Left 8 Columns) */}
                    <div className="lg:col-span-8 flex flex-col justify-between bg-black border border-white/5 rounded-3xl overflow-hidden shadow-2xl relative min-h-[350px] md:min-h-[450px]">

                        {/* Player Backdrop Screen Simulated Canvas */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-tr from-surface via-black/90 to-primary/5 p-6 text-center z-0">
                            {isPlaying ? (
                                <div className="space-y-4 animate-pulse">
                                    <span className="material-symbols-outlined text-primary-light text-6xl">blur_on</span>
                                    <p className="font-mono text-xs text-white/60 tracking-wider">Streaming high-fidelity neural frames...</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <button
                                        onClick={() => setIsPlaying(true)}
                                        className="w-16 h-16 rounded-full bg-white text-black hover:bg-primary transition-all duration-300 flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.1)] group"
                                    >
                                        <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform pl-1">play_arrow</span>
                                    </button>
                                    <div className="space-y-1">
                                        <h3 className="text-sm font-headline font-bold text-white">VidiMetrics Core Architecture Render</h3>
                                        <p className="text-xs text-white/40 max-w-xs mx-auto">1080p Asset • 60 FPS Target • Distributed Pool 04</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Simulated Overlay HUD (Heads-Up Display) */}
                        <div className="p-4 flex items-center justify-between w-full relative z-10 bg-gradient-to-b from-black/80 to-transparent">
                            <span className="text-[10px] font-mono tracking-wider text-white/40 bg-white/5 border border-white/5 px-2 py-0.5 rounded">
                                SECURE STREAM // NODE_ID_77
                            </span>
                            <span className="text-[10px] font-mono text-primary-light bg-primary/10 px-2 py-0.5 rounded font-bold">
                                {isPlaying ? "COMPUTING" : "IDLE"}
                            </span>
                        </div>

                        {/* Video Controller Dashboard Bar */}
                        <div className="p-4 w-full relative z-10 bg-gradient-to-t from-black/90 to-transparent space-y-3">
                            {/* Timeline Track Slider */}
                            <div className="w-full bg-white/10 h-1 rounded-full cursor-pointer overflow-hidden group">
                                <div
                                    className={`h-full bg-primary transition-all duration-300 ${isPlaying ? "w-1/3" : "w-0"}`}
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-between text-white/60 text-xs">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setIsPlaying(!isPlaying)}
                                        className="hover:text-white transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-xl">{isPlaying ? "pause" : "play_arrow"}</span>
                                    </button>
                                    <span className="font-mono text-[11px] text-white/40">00:14 / 00:45</span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-lg hover:text-white cursor-pointer transition-colors">settings</span>
                                    <span className="material-symbols-outlined text-lg hover:text-white cursor-pointer transition-colors">fullscreen</span>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* 2️⃣ Real-time Telemetry Dashboard (Right 4 Columns) */}
                    <div className="lg:col-span-4 bg-white/[0.01] border border-white/5 rounded-3xl flex flex-col overflow-hidden">

                        {/* Telemetry Tabs Navigation */}
                        <div className="grid grid-cols-2 bg-white/[0.02] border-b border-white/5 font-mono text-[10px] tracking-wider uppercase text-center font-bold">
                            <button
                                onClick={() => setActiveTab("telemetry")}
                                className={`py-3.5 transition-colors ${activeTab === "telemetry" ? "text-primary-light border-b border-primary bg-white/[0.01]" : "text-white/40 hover:text-white"}`}
                            >
                                Telemetry Logs
                            </button>
                            <button
                                onClick={() => setActiveTab("specifications")}
                                className={`py-3.5 transition-colors ${activeTab === "specifications" ? "text-primary-light border-b border-primary bg-white/[0.01]" : "text-white/40 hover:text-white"}`}
                            >
                                Node Specs
                            </button>
                        </div>

                        {/* Content Switcher Case Box */}
                        <div className="p-5 flex-1 overflow-y-auto space-y-4">
                            {activeTab === "telemetry" ? (
                                <div className="space-y-3">
                                    {telemetryLogs.map((log, idx) => (
                                        <div key={idx} className="font-mono text-[11px] leading-relaxed flex gap-3 items-start border-b border-white/[0.02] pb-2">
                                            <span className="text-primary-light/60 shrink-0">{log.timestamp}</span>
                                            <div className="space-y-0.5">
                                                <p className="text-white/70">{log.event}</p>
                                                <span className="text-[9px] text-emerald-400 bg-emerald-500/5 px-1.5 py-0.2 rounded font-bold uppercase">verified</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-4 text-xs font-mono">
                                    <div className="flex justify-between border-b border-white/5 pb-2">
                                        <span className="text-white/40">Render Core</span>
                                        <span className="text-white/80">RTX 4090 Distributed Cluster</span>
                                    </div>
                                    <div className="flex justify-between border-b border-white/5 pb-2">
                                        <span className="text-white/40">Memory Node Isolation</span>
                                        <span className="text-white/80">VRAM Dynamic Swap</span>
                                    </div>
                                    <div className="flex justify-between border-b border-white/5 pb-2">
                                        <span className="text-white/40">Encryption Key Layer</span>
                                        <span className="text-white/80">OIDC Token Bound</span>
                                    </div>
                                    <div className="flex justify-between pb-2">
                                        <span className="text-white/40">Average Network Quota</span>
                                        <span className="text-primary-light">1.2 cr / sec render</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Bottom Panel Actions inside Sidebar */}
                        <div className="p-4 bg-white/[0.02] border-t border-white/5 text-center">
                            <button className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/5 text-white font-bold rounded-xl text-xs uppercase tracking-wider font-mono transition-colors">
                                Download Telemetry Export (.JSON)
                            </button>
                        </div>

                    </div>

                </div>

                {/* Post-Demo Conversion Box */}
                <div className="p-6 md:p-8 bg-gradient-to-r from-white/[0.02] to-transparent border border-white/5 rounded-3xl flex flex-col sm:flex-row justify-between items-center gap-6">
                    <div className="space-y-1 text-center sm:text-left">
                        <h3 className="text-base font-headline font-bold text-white">Impressive rendering telemetry, isn't it?</h3>
                        <p className="text-xs text-white/40">Deploy your own video compilation pipelines and trigger real-time AI metrics monitoring dashboards.</p>
                    </div>
                    <button className="bg-primary hover:bg-primary-light text-black font-black font-headline text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-colors shadow-lg shrink-0">
                        Claim Your Free API Credits
                    </button>
                </div>

            </div>
        </div>
    );
}