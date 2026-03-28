import React from 'react';

const AIInsights: React.FC = () => {
  return (
    <div className="bg-[#0b1326] text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-44 pb-32 px-8 overflow-hidden">
        <div className="max-w-screen-2xl mx-auto relative z-10 text-center lg:text-left">
          <div className="w-full space-y-8">
            <h1 className="font-headline font-bold text-7xl lg:text-8xl leading-[0.9] tracking-tighter">
              The Future of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ddb7ff] via-[#3da9fc] to-[#7818c6] pr-4">Visual</span>
              Narratives.
            </h1>
            <div className='grid grid-cols-2 gap-4'>
              <p className="text-xl text-white/50 max-w-2xl leading-relaxed font-body">
                Moving beyond simple metrics into deep generative intelligence. VidiMetrics.Ai synthesizes audience data into actionable storyboards, character arcs, and cinematic production workflows.
              </p>
              <div className='relative'>
                <div className="absolute bottom-2 right-2 flex gap-4 pt-4">
                  <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest font-bold text-[#3da9fc]">Real-time Engine</span>
                  <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest font-bold text-[#7818c6]">Generative Logic</span>
                </div>
              </div>

            </div>

          </div>
        </div>
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-primary/10 blur-[180px] rounded-full -mr-96 -mt-96 pointer-events-none"></div>
      </section>

      {/* Bento Grid Features */}
      <section className="py-20 px-8">
        <div className="max-w-screen-2xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[300px]">

            {/* YouTube Analytics Integration */}
            <div className="md:col-span-8 group relative overflow-hidden rounded-3xl bg-[#161f35] border border-white/5 p-10 hover:border-white/10 transition-all duration-500">
              <div className="relative z-10 max-w-md">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-8 border border-white/10 group-hover:bg-[#3da9fc]/10 transition-colors">
                  <span className="material-symbols-outlined text-[#3da9fc]">analytics</span>
                </div>
                <h3 className="text-3xl font-headline font-bold mb-4">YouTube Analytics Integration</h3>
                <p className="text-white/40 leading-relaxed mb-8">
                  Deep-link your channel data to uncover the hidden narrative patterns. We don't just show views; we map the emotional resonance of every frame.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-sm text-white/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3da9fc]"></span>
                    Retention-to-Story Correlation
                  </li>
                  <li className="flex items-center gap-3 text-sm text-white/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3da9fc]"></span>
                    Demographic Sentiment Mapping
                  </li>
                </ul>
                <div className="mt-10">
                  <a href="#" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#3da9fc] hover:gap-4 transition-all">
                    Explore Data Engine <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </a>
                </div>
              </div>
              {/* Abstract Wavy Graph Mockup */}
              <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none">
                <svg viewBox="0 0 400 400" className="w-full h-full">
                  <path d="M0,200 Q100,100 200,200 T400,200" fill="none" stroke="#3da9fc" strokeWidth="2" />
                  <path d="M0,220 Q100,120 200,220 T400,220" fill="none" stroke="#3da9fc" strokeWidth="1" opacity="0.5" />
                  <path d="M0,240 Q100,140 200,240 T400,240" fill="none" stroke="#3da9fc" strokeWidth="0.5" opacity="0.2" />
                </svg>
              </div>
            </div>

            {/* Live Transcripts */}
            <div className="md:col-span-4 group relative overflow-hidden rounded-3xl bg-[#161f35] border border-white/5 p-10 hover:border-white/10 transition-all duration-500">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-8 border border-white/10 group-hover:bg-[#ddb7ff]/10 transition-colors">
                <span className="material-symbols-outlined text-[#ddb7ff]">description</span>
              </div>
              <h3 className="text-2xl font-headline font-bold mb-4">Live Transcripts</h3>
              <p className="text-white/40 text-sm leading-relaxed mb-8">
                Convert every word into structured data. Our engine parses dialogue for thematic consistency and brand safety in real-time.
              </p>
              {/* Mock Transcript Lines */}
              <div className="space-y-3 opacity-20 group-hover:opacity-40 transition-opacity">
                <div className="h-2 bg-white/40 rounded-full w-full"></div>
                <div className="h-2 bg-white/40 rounded-full w-3/4"></div>
                <div className="h-2 bg-white/40 rounded-full w-5/6"></div>
              </div>
            </div>

            {/* AI Storyboarding */}
            <div className="md:col-span-4 group relative overflow-hidden rounded-3xl bg-[#161f35] border border-white/5 p-10 hover:border-white/10 transition-all duration-500 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-8 border border-white/10 group-hover:bg-[#7818c6]/10 transition-colors">
                  <span className="material-symbols-outlined text-[#7818c6]">auto_fix</span>
                </div>
                <h3 className="text-2xl font-headline font-bold mb-4">AI Storyboarding</h3>
                <p className="text-white/40 text-sm leading-relaxed mb-6">
                  Transform abstract ideas into visual reality. Character sheets, scene layouts, and episode arcs generated in seconds.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="aspect-square rounded-xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 border border-white/5">
                  <img src="/src/assets/images/AIInsights/character1.png" alt="Character 1" className="w-full h-full object-cover" />
                </div>
                <div className="aspect-square rounded-xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 border border-white/5">
                  <img src="/src/assets/images/AIInsights/scene1.png" alt="Scene 1" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            {/* Precision Prompt Engineering */}
            <div className="md:col-span-8 group relative overflow-hidden rounded-3xl bg-[#161f35] border border-white/5 p-10 hover:border-white/10 transition-all duration-500 flex flex-col md:flex-row gap-10">
              <div className="flex-1">
                <h3 className="text-3xl font-headline font-bold mb-6">Precision Prompt Engineering</h3>
                <p className="text-white/40 leading-relaxed mb-10">
                  Take absolute control over the creative output. Our advanced command center allows for granular adjustments to lighting, mood, and camera movement.
                </p>
                <div className="flex gap-8">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Atmosphere</span>
                    <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="w-[70%] h-full bg-[#7818c6]"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Contrast</span>
                    <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="w-[45%] h-full bg-[#3da9fc]"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 bg-black/40 rounded-2xl p-6 border border-white/5 font-mono text-[11px] text-white/40 leading-relaxed">
                <div className="flex gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-red-400 opacity-50"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-400 opacity-50"></div>
                  <div className="w-2 h-2 rounded-full bg-green-400 opacity-50"></div>
                </div>
                <p><span className="text-[#ddb7ff]">/render</span> <span className="text-white/70">cinematic --mood "noir" --lighting "volumetric" --subject "Protagonist_A" --environment "City_Core_v2"</span></p>
                <p className="mt-2 text-white/20">// Processing metadata...</p>
                <p className="text-white/20">// Engine sequence initiated.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Orchestration Timeline */}
      <section className="py-32 px-8">
        <div className="max-w-screen-2xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-headline font-bold tracking-tight">Workflow Orchestration</h2>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Center Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#7818c6] via-[#3da9fc] to-[#7818c6] -translate-x-1/2 hidden md:block"></div>

            <div className="space-y-32">
              {/* Step 1 */}
              <div className="relative flex flex-col md:flex-row items-center md:justify-between group">
                <div className="md:w-[45%] text-center md:text-right">
                  <h4 className="text-[#ddb7ff] font-bold mb-1">01. Intake</h4>
                  <p className="text-white/40 text-sm leading-relaxed">Sync your YouTube channel and ingest previous performance data.</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#161f35] border-2 border-[#7818c6] flex items-center justify-center relative z-10 my-6 md:my-0">
                  <div className="w-2 h-2 rounded-full bg-[#7818c6] animate-ping"></div>
                </div>
                <div className="md:w-[45%]"></div>
              </div>

              {/* Step 2 */}
              <div className="relative flex flex-col md:flex-row items-center md:justify-between group">
                <div className="md:w-[45%]"></div>
                <div className="w-8 h-8 rounded-full bg-[#161f35] border-2 border-[#3da9fc] flex items-center justify-center relative z-10 my-6 md:my-0">
                  <div className="w-2 h-2 rounded-full bg-[#3da9fc]"></div>
                </div>
                <div className="md:w-[45%] text-center md:text-left">
                  <h4 className="text-[#3da9fc] font-bold mb-1">02. Synthesis</h4>
                  <p className="text-white/40 text-sm leading-relaxed">AI generates characters and scene structures based on high-retention cues.</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative flex flex-col md:flex-row items-center md:justify-between group">
                <div className="md:w-[45%] text-center md:text-right">
                  <h4 className="text-[#7818c6] font-bold mb-1">03. Production</h4>
                  <p className="text-white/40 text-sm leading-relaxed">Export prompts, scripts, and visual references for your creative team.</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#161f35] border-2 border-[#7818c6] flex items-center justify-center relative z-10 my-6 md:my-0">
                  <div className="w-2 h-2 rounded-full bg-[#7818c6]"></div>
                </div>
                <div className="md:w-[45%]"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Branding */}
      <footer className="py-20 px-8 border-t border-white/5">
        <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="max-w-sm space-y-6">
            <h2 className="text-2xl font-headline font-bold">VidiMetrics.Ai</h2>
            <p className="text-white/40 text-xs leading-relaxed">Elevating content creation through the lens of algorithmic narrative and cinematic intelligence.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-[10px] font-bold uppercase tracking-widest text-white/40">
            <div className="space-y-4">
              <span className="text-white/20">Platform</span>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-white transition-colors">Analytics</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Storyboarding</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Insights</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <span className="text-white/20">Resources</span>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press Kit</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <span className="text-white/20">Company</span>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <span className="text-white/20">Legal</span>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-screen-2xl mx-auto mt-20 pt-8 border-t border-white/5 flex justify-between items-center text-[10px] text-white/20 font-bold tracking-widest uppercase">
          <span>© 2024 VidiMetrics.Ai. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
};

export default AIInsights;
