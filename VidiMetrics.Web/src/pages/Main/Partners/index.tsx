export default function Partners() {
  const partnerCategories = [
    {
      title: "Infrastructure & Compute",
      description: "High-performance processing networks power our background rendering nodes.",
      items: ["NVIDIA Inception", "AWS Cloud", "RunPod Nodes", "Google Cloud"]
    },
    {
      title: "AI Ecosystem & Models",
      description: "State-of-the-art architectures powering our video analytical and generation workflows.",
      items: ["OpenAI", "Hugging Face", "Anthropic", "Replicate Engine"]
    },
    {
      title: "Enterprise Ecosystem",
      description: "Global networks and tools integrating VidiMetrics.Ai workflows directly via APIs.",
      items: ["Vercel Edge", "Supabase", "GitHub Enterprise", "Stripe Core"]
    }
  ];

  return (
    <div className="bg-surface text-white min-h-screen pt-36 pb-20 px-6 md:px-12 transition-all duration-300">
      <div className="max-w-5xl mx-auto space-y-16">

        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
            Global Network
          </span>
          <h1 className="text-4xl md:text-5xl font-headline font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/50 tracking-tight">
            Strategic Alliances
          </h1>
          <p className="text-white/50 text-base md:text-lg leading-relaxed">
            VidiMetrics.Ai scales enterprise video computing workloads by collaborating with industry leaders in decentralized infrastructure, machine learning models, and security architectures.
          </p>
        </div>

        {/* Categories Display */}
        <div className="space-y-12">
          {partnerCategories.map((category, catIndex) => (
            <div key={catIndex} className="space-y-6">
              {/* Category Subtitle */}
              <div className="border-l-2 border-primary pl-4">
                <h3 className="text-lg font-headline font-bold text-white">{category.title}</h3>
                <p className="text-xs text-white/40 mt-0.5">{category.description}</p>
              </div>

              {/* Partners Logotypes Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {category.items.map((partner, index) => (
                  <div
                    key={index}
                    className="h-24 bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 hover:border-white/10 rounded-2xl flex flex-col items-center justify-center p-4 transition-all duration-300 group cursor-pointer relative overflow-hidden"
                  >
                    {/* Background Radial Glow Effect on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Placeholder for Logo Text - Replace with <img /> tags later */}
                    <span className="font-mono text-sm tracking-wide text-white/40 group-hover:text-white group-hover:scale-105 transition-all duration-300 font-bold">
                      {partner}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action Box */}
        <div className="mt-20 p-8 bg-gradient-to-b from-white/[0.02] to-transparent border border-white/5 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
              <h3 className="text-xl font-headline font-bold text-white">Become an Infrastructure or API Partner</h3>
              <p className="text-sm text-white/50 max-w-xl">
                Interested in connecting your high-performance GPU nodes to our decentralized worker queues, or integrating our metrics engine inside your enterprise application? Let’s talk.
              </p>
            </div>
            <a
              href="mailto:partners@vidimetrics.ai"
              className="w-full md:w-auto text-center text-xs font-bold uppercase tracking-wider text-black bg-white hover:bg-white/90 px-6 py-3.5 rounded-xl transition-all duration-300 whitespace-nowrap shadow-[0_4px_20px_rgba(255,255,255,0.05)]"
            >
              Apply for Partnership
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}