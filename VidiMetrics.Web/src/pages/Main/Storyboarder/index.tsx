import { useState } from "react";

interface Scene {
  id: number;
  title: string;
  prompt: string;
  duration: number; // بالثواني
}

export default function Storyboarder() {
  const [scenes, setScenes] = useState<Scene[]>([
    { id: 1, title: "Scene 1: Introduction", prompt: "Cinematic shot of a decentralized server farm glowing with purple neon neon lights, drone flying through the corridors.", duration: 5 },
    { id: 2, title: "Scene 2: Core Metrics", prompt: "Abstract 3D holographic charts floating over a dark glass futuristic desk, high tech interface animation.", duration: 8 }
  ]);

  const [newTitle, setNewTitle] = useState("");
  const [newPrompt, setNewPrompt] = useState("");
  const [newDuration, setNewDuration] = useState(5);

  const addScene = () => {
    if (!newTitle.trim() || !newPrompt.trim()) return;

    const newScene: Scene = {
      id: scenes.length > 0 ? Math.max(...scenes.map(s => s.id)) + 1 : 1,
      title: newTitle,
      prompt: newPrompt,
      duration: Number(newDuration)
    };

    setScenes([...scenes, newScene]);
    setNewTitle("");
    setNewPrompt("");
    setNewDuration(5);
  };

  const deleteScene = (id: number) => {
    setScenes(scenes.filter(scene => scene.id !== id));
  };

  // حساب إجمالي الثواني والـ Credits التقديرية (بفرض أن الثانية بـ 2 كاش)
  const totalDuration = scenes.reduce((sum, s) => sum + s.duration, 0);
  const estimatedCredits = totalDuration * 2;

  return (
    <div className="bg-surface text-white min-h-screen pt-36 pb-20 px-6 md:px-12 transition-all duration-300">
      <div className="max-w-6xl mx-auto space-y-12">

        {/* Header and Live Quota Calculator */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/5 pb-6">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
              AI Video Planner
            </span>
            <h1 className="text-3xl md:text-4xl font-headline font-black tracking-tight">
              Ecosystem Storyboarder
            </h1>
            <p className="text-white/50 text-xs md:text-sm">
              Structure your video asset scene by scene, specify analytical prompt layers, and audit credit metrics instantly.
            </p>
          </div>

          {/* Real-time Estimate Wallet Widget */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex gap-6 items-center self-start lg:self-center">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-white/40 block">Total Duration</span>
              <span className="text-xl font-mono font-black text-white">{totalDuration}s</span>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary-light block">Est. Credits Cost</span>
              <span className="text-xl font-mono font-black text-primary-light">{estimatedCredits} <span className="text-xs font-normal text-white/40">cr</span></span>
            </div>
          </div>
        </div>

        {/* Core Layout: Editor Left + Timeline Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* 1️⃣ Scene Creation Panel (Left 4 Columns) */}
          <div className="lg:col-span-4 bg-white/[0.01] border border-white/5 p-6 rounded-2xl space-y-4 sticky top-32">
            <h3 className="text-sm font-headline font-bold text-white flex items-center gap-2 border-b border-white/5 pb-2">
              <span className="material-symbols-outlined text-primary text-lg">add_box</span>
              Append New Scene
            </h3>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-white/40 font-medium">Scene Title / Identifier</label>
                <input
                  type="text"
                  placeholder="e.g., Scene 3: Feature Focus"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/5 focus:border-primary/30 rounded-xl px-3 py-2.5 outline-none text-white transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-white/40 font-medium">AI Generative Prompt</label>
                <textarea
                  rows={3}
                  placeholder="Describe visual composition, camera velocity, lighting cues..."
                  value={newPrompt}
                  onChange={(e) => setNewPrompt(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/5 focus:border-primary/30 rounded-xl px-3 py-2.5 outline-none text-white transition-colors resize-none text-xs leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <label className="text-white/40 font-medium">Sequence Duration (Seconds)</label>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={newDuration}
                  onChange={(e) => setNewDuration(Number(e.target.value))}
                  className="w-full bg-white/[0.02] border border-white/5 focus:border-primary/30 rounded-xl px-3 py-2.5 outline-none text-white font-mono transition-colors"
                />
              </div>

              <button
                onClick={addScene}
                className="w-full bg-white text-black font-bold uppercase tracking-wider py-3 rounded-xl hover:bg-white/90 transition-colors mt-2"
              >
                Insert Sequence
              </button>
            </div>
          </div>

          {/* 2️⃣ Interactive Storyboard Grid (Right 8 Columns) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <h3 className="text-sm font-headline font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">view_kanban</span>
                Storyboard Timeline
              </h3>
              <span className="text-xs font-mono text-white/40">{scenes.length} steps configured</span>
            </div>

            <div className="space-y-3">
              {scenes.length > 0 ? (
                scenes.map((scene, index) => (
                  <div
                    key={scene.id}
                    className="group bg-white/[0.01] hover:bg-white/[0.02] border border-white/5 hover:border-white/10 p-5 rounded-2xl flex gap-4 transition-all duration-300 relative"
                  >
                    {/* Index Counter Node */}
                    <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center font-mono text-xs text-white/40 group-hover:text-primary-light group-hover:border-primary/20 transition-colors shrink-0">
                      {index + 1}
                    </div>

                    {/* Scene Data */}
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-4">
                        <h4 className="text-sm font-bold text-white truncate">{scene.title}</h4>
                        <span className="text-[11px] font-mono text-white/40 shrink-0 bg-white/5 px-2 py-0.5 rounded">
                          {scene.duration}s ({scene.duration * 2} cr)
                        </span>
                      </div>
                      <p className="text-xs text-white/50 leading-relaxed font-sans">
                        {scene.prompt}
                      </p>
                    </div>

                    {/* Delete Action Trigger */}
                    <button
                      onClick={() => deleteScene(scene.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-white/40 hover:text-rose-400 hover:bg-rose-500/5 rounded-xl transition-all self-start"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-16 bg-white/[0.01] rounded-2xl border border-white/5 border-dashed">
                  <span className="material-symbols-outlined text-white/20 text-4xl mb-2 block">layers_clear</span>
                  <p className="text-sm text-white/40">Your storyboard is empty. Create your initial sequence card.</p>
                </div>
              )}
            </div>

            {/* Final Dispatch Render Queue Button */}
            {scenes.length > 0 && (
              <div className="pt-4 flex justify-end">
                <button className="flex items-center gap-2 px-6 py-3.5 bg-primary text-black font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-primary-light transition-all duration-300 shadow-lg">
                  <span className="material-symbols-outlined text-sm">rocket_launch</span>
                  Dispatch to Render Nodes
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}