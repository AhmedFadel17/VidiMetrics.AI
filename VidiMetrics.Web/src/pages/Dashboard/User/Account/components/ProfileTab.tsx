export default function ProfileTab() {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="lg:col-span-8 space-y-8">
        <div className="glass-panel p-8 rounded-3xl space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-display font-bold">
              Personal Information
            </h3>
            <button className="text-primary text-sm font-label hover:underline flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">edit</span>{" "}
              Edit Details
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-label uppercase tracking-widest text-on-surface-variant ml-1">
                Full Name
              </label>
              <div className="bg-surface-container-lowest/50 p-4 rounded-xl text-on-surface font-medium border border-outline-variant/10">
                Alex Rivera
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-label uppercase tracking-widest text-on-surface-variant ml-1">
                Email Address
              </label>
              <div className="bg-surface-container-lowest/50 p-4 rounded-xl text-on-surface font-medium border border-outline-variant/10">
                a.rivera@vidimetrics.ai
              </div>
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-label uppercase tracking-widest text-on-surface-variant ml-1">
                Bio
              </label>
              <div className="bg-surface-container-lowest/50 p-4 rounded-xl text-on-surface leading-relaxed border border-outline-variant/10">
                Creative visionary and AI production specialist. Focused on
                pushing the boundaries of generative cinematic experiences
                through VidiMetrics' advanced synthesis engine. Managing over 10
                concurrent narrative series.
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-label uppercase tracking-widest text-on-surface-variant ml-1">
                Primary Role
              </label>
              <div className="bg-surface-container-lowest/50 p-4 rounded-xl text-on-surface font-medium border border-outline-variant/10">
                Creative Director
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-label uppercase tracking-widest text-on-surface-variant ml-1">
                Timezone
              </label>
              <div className="bg-surface-container-lowest/50 p-4 rounded-xl text-on-surface font-medium border border-outline-variant/10">
                PST (UTC-8)
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:col-span-4 space-y-8">
        <div className="glass-panel p-8 rounded-3xl">
          <h3 className="text-xl font-display font-bold mb-6">
            Recent Activity
          </h3>
          <div className="space-y-6">
            <div className="flex gap-4 relative">
              <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 to-transparent"></div>
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 z-10">
                <span className="material-symbols-outlined text-primary text-sm fill-icon">
                  movie
                </span>
              </div>
              <div>
                <p className="text-sm font-bold">Rendered Scene 04</p>
                <p className="text-xs text-on-surface-variant">
                  Neon Chronicles • 2h ago
                </p>
              </div>
            </div>

            <div className="flex gap-4 relative">
              <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-gradient-to-b from-secondary/50 to-transparent"></div>
              <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center shrink-0 z-10">
                <span className="material-symbols-outlined text-secondary text-sm">
                  edit_note
                </span>
              </div>
              <div>
                <p className="text-sm font-bold">Updated Storyboard</p>
                <p className="text-xs text-on-surface-variant">
                  Cyberpunk Odyssey • 5h ago
                </p>
              </div>
            </div>

            <div className="flex gap-4 relative">
              <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-gradient-to-b from-tertiary/50 to-transparent"></div>
              <div className="w-8 h-8 rounded-full bg-tertiary/20 flex items-center justify-center shrink-0 z-10">
                <span className="material-symbols-outlined text-tertiary text-sm">
                  share
                </span>
              </div>
              <div>
                <p className="text-sm font-bold">Exported Master Cut</p>
                <p className="text-xs text-on-surface-variant">
                  Void Theory • Yesterday
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-sm">
                  settings
                </span>
              </div>
              <div>
                <p className="text-sm font-bold">Changed Password</p>
                <p className="text-xs text-on-surface-variant">
                  Security • 3 days ago
                </p>
              </div>
            </div>
          </div>

          <button className="w-full mt-8 py-3 border border-outline-variant/30 text-on-surface-variant text-sm font-label rounded-xl hover:bg-surface-variant hover:text-on-surface transition-all">
            View Full Audit Log
          </button>
        </div>
        <div className="bg-gradient-to-br from-secondary-container to-secondary p-8 rounded-3xl text-on-secondary shadow-xl shadow-secondary/20">
          <h4 className="text-xl font-display font-extrabold mb-2">
            Invite Collaborators
          </h4>
          <p className="text-sm opacity-80 mb-6">
            Unlock team features by inviting up to 5 collaborators to your
            workspace.
          </p>
          <button className="bg-on-secondary-fixed text-on-secondary-container px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:translate-x-1 transition-transform">
            <span className="material-symbols-outlined">person_add</span>
            Invite Team
          </button>
        </div>
      </div>
    </div>
  );
}
