export default function TrustNetworkStatisticsSection() {
    const stats = [
        { value: "4.7M+", label: "Frames Generated" },
        { value: "10k+", label: "Active Creators" },
        { value: "< 12s", label: "Avg Render Velocity" },
        { value: "99.9%", label: "API Cluster Uptime" },
    ];

    return (
        <section className="border-y border-white/5 bg-white/[0.01] py-12 px-8">
            <div className="max-w-screen-2xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
                {stats.map((stat, idx) => (
                    <div key={idx} className="space-y-1 text-center">
                        <span className="text-3xl font-mono font-black text-white">{stat.value}</span>
                        <p className="text-xs text-white/40 font-mono tracking-wider uppercase">{stat.label}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}