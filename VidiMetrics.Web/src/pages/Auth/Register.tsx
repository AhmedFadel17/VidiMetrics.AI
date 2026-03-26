import { Link } from 'react-router-dom'

export default function Register() {
  return (
    <div className="bg-surface text-on-surface font-body selection:bg-primary-container min-h-screen pt-24 pb-12 px-6 flex items-center justify-center overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">
        <div className="hidden lg:block space-y-8">
          <div className="space-y-4">
            <span className="text-secondary font-label text-xs tracking-[0.3em] uppercase">The Cinematic Observer</span>
            <h1 className="font-headline text-6xl font-bold leading-tight tracking-tighter">
              Enter the <br/>
              <span className="text-gradient-primary">Cinematic Engine</span>
            </h1>
          </div>
          <p className="text-on-surface-variant text-lg leading-relaxed max-w-md">
            Transforming raw metrics into visual narratives. Join the elite network of data storytellers and witness your analytics evolve into a cinematic experience.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/10">
              <span className="material-symbols-outlined text-primary mb-2">auto_awesome</span>
              <div className="text-sm font-semibold text-on-surface">Neural Insights</div>
            </div>
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/10">
              <span className="material-symbols-outlined text-secondary mb-2">videocam</span>
              <div className="text-sm font-semibold text-on-surface">Director Mode</div>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-xl p-8 lg:p-12 border border-outline-variant/20 relative overflow-hidden">
          <form className="space-y-6">
            <div className="space-y-2">
              <label className="block font-label text-xs uppercase tracking-widest text-on-surface-variant ml-1">Full Identity</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">person</span>
                <input className="w-full bg-surface-container-lowest/50 border-none rounded-lg py-4 pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant/30 focus:ring-2 focus:ring-secondary/20 transition-all font-body text-sm" placeholder="ALEXANDER VANCE" type="text"/>
              </div>
            </div>
            <div className="space-y-2">
              <label className="block font-label text-xs uppercase tracking-widest text-on-surface-variant ml-1">Universal Address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">alternate_email</span>
                <input className="w-full bg-surface-container-lowest/50 border-none rounded-lg py-4 pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant/30 focus:ring-2 focus:ring-secondary/20 transition-all font-body text-sm" placeholder="vance@vidimetrics.ai" type="email"/>
              </div>
            </div>
            <div className="space-y-2">
              <label className="block font-label text-xs uppercase tracking-widest text-on-surface-variant ml-1">Secure Key</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">lock</span>
                <input className="w-full bg-surface-container-lowest/50 border-none rounded-lg py-4 pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant/30 focus:ring-2 focus:ring-secondary/20 transition-all font-body text-sm" placeholder="••••••••••••" type="password"/>
              </div>
            </div>
            <button className="w-full py-4 btn-gradient rounded-lg font-bold tracking-widest uppercase text-sm shadow-lg shadow-primary/20" type="submit">
              Begin Journey
            </button>
            <p className="text-center text-sm text-on-surface-variant mt-4">
              Already part of the network? <Link className="text-secondary font-medium hover:text-primary transition-colors" to="/login">Sign In</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
