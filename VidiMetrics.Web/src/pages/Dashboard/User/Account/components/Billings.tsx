export default function BillingsTab() {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="lg:col-span-6 space-y-8">
        <h3 className="text-xl font-display font-bold mb-6">
          Billing Information
        </h3>
      </div>
      <div className="lg:col-span-6 space-y-8">
        <div className="glass-panel p-8 rounded-3xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
          <h3 className="text-xl font-display font-bold mb-6">Subscription</h3>
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-primary-container/40 to-surface-container-high p-6 rounded-2xl border border-primary/20">
              <p className="text-xs font-label uppercase tracking-widest text-primary mb-1">
                Current Plan
              </p>
              <h4 className="text-2xl font-display font-extrabold mb-4">
                Pro Producer
              </h4>
              <div className="flex items-center gap-2 text-sm text-on-surface-variant mb-6">
                <span className="material-symbols-outlined text-sm text-secondary fill-icon">
                  verified
                </span>
                Renews on Nov 24, 2026
              </div>
              <button className="w-full py-3 bg-on-background text-background font-bold rounded-xl hover:scale-[1.02] active:scale-95 transition-all text-sm uppercase tracking-wider">
                Manage Subscription
              </button>
            </div>

            <div className="flex flex-col gap-3 px-2">
              <div className="flex items-center gap-3 text-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-secondary text-lg">
                  check_circle
                </span>
                Unlimited 4K Rendering
              </div>
              <div className="flex items-center gap-3 text-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-secondary text-lg">
                  check_circle
                </span>
                Priority GPU Access
              </div>
              <div className="flex items-center gap-3 text-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-secondary text-lg">
                  check_circle
                </span>
                Custom Model Fine-tuning
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
