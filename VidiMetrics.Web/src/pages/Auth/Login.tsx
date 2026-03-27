import { Link } from 'react-router-dom'

export default function Login() {
  return (
    <div className="w-full max-w-lg">
      <div className="text-center mb-10">
        <Link to="/" className="inline-block mb-6">
          <span className="text-3xl font-headline font-bold text-gradient-primary tracking-tight">VidiMetrics.Ai</span>
        </Link>
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-on-surface tracking-tighter mb-4">Welcome Back, Observer</h1>
        <p className="text-on-surface-variant font-label text-sm uppercase tracking-[0.2em]">Initiating access to the data stream</p>
      </div>

      <div className="glass-panel ghost-border rounded-xl p-8 md:p-12 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.6)]">
        <form action="#" className="space-y-8" method="POST">
          <div className="space-y-2">
            <label className="block text-xs font-label uppercase tracking-widest text-secondary font-semibold ml-1" htmlFor="email">Terminal ID (Email)</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-on-surface-variant text-lg">alternate_email</span>
              </div>
              <input
                className="block w-full bg-surface-container-lowest/50 border-0 focus:ring-2 focus:ring-secondary/20 text-on-surface rounded-lg py-4 pl-12 transition-all duration-300 placeholder:text-on-surface-variant/30 font-body text-sm"
                id="email"
                name="email"
                placeholder="observer@vidimetrics.ai"
                required
                type="email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="block text-xs font-label uppercase tracking-widest text-secondary font-semibold" htmlFor="password">Encryption Key</label>
              <Link className="text-[10px] uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors" to="/recovery">Forgot Password?</Link>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-on-surface-variant text-lg">lock</span>
              </div>
              <input
                className="block w-full bg-surface-container-lowest/50 border-0 focus:ring-2 focus:ring-secondary/20 text-on-surface rounded-lg py-4 pl-12 transition-all duration-300 placeholder:text-on-surface-variant/30 font-body text-sm"
                id="password"
                name="password"
                placeholder="••••••••••••"
                required
                type="password"
              />
            </div>
          </div>

          <button className="w-full relative overflow-hidden group btn-gradient font-headline font-bold py-4 rounded-lg flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-[0_8px_24px_-4px_rgba(120,24,198,0.4)]" type="submit">
            <span className="text-sm tracking-widest uppercase">Sign In</span>
            <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-on-surface-variant/10">
          <p className="text-center text-xs text-on-surface-variant font-label uppercase tracking-widest mb-6">Or synchronize with</p>
          <div className="grid grid-cols-2 gap-4">
            <button className="ghost-border bg-surface-variant/20 hover:bg-surface-variant/40 py-3 rounded-lg flex items-center justify-center gap-2 transition-all">
              <span className="material-symbols-outlined text-lg text-secondary">cloud</span>
              <span className="text-xs font-bold uppercase tracking-tighter">Google</span>
            </button>
            <button className="ghost-border bg-surface-variant/20 hover:bg-surface-variant/40 py-3 rounded-lg flex items-center justify-center gap-2 transition-all">
              <span className="material-symbols-outlined text-lg text-primary">terminal</span>
              <span className="text-xs font-bold uppercase tracking-tighter">GitHub</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center space-y-4">
        <p className="text-on-surface-variant text-sm font-body">
          New to the system? <Link className="text-secondary font-semibold hover:text-primary transition-colors underline-offset-4 hover:underline" to="/register">Create an Account</Link>
        </p>
      </div>
    </div>
  )
}
