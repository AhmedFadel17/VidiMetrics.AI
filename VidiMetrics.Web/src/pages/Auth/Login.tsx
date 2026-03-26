import { Link } from 'react-router-dom'

export default function Login() {
  return (
    <div className="bg-surface text-on-surface font-body selection:bg-primary/30 min-h-screen flex flex-col items-center justify-center overflow-x-hidden relative">
      {/* Background Cinematic Visual */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-surface via-surface-container-lowest to-surface opacity-90"></div>
        <img 
          alt="VidiMetrics AI Background" 
          className="w-full h-full object-cover mix-blend-overlay opacity-30" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDw_yBD7uqDjUY4xgSzPTLjKz-P_HcLWko-3Zxvk1VJN9C8OYhtEVgbiASqKNrq-DkexATIpsc2NkUgIykdya0xyw4f98PU_7UVTXtrERRYmU4b9knZKfVeqlmQayN6aybvASBlQujeussoaiBClOZLOm26SvQou4QMNERqvrbdepziL_B4WCwz7sXDpoCCviSs3RjAzu7x4IVqDFtarWR21rXbqjk_TuDt3Iq2H3WKf6lB64U_y8vZsE1AJhQy7T89YooRyg8216M"
        />
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 blur-[120px] rounded-full"></div>
      </div>

      <main className="relative z-10 w-full max-w-lg px-6 py-12">
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
      </main>
    </div>
  )
}
