import { Link } from 'react-router-dom'

export default function Recovery() {
  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-10">
        <Link to="/" className="inline-block mb-8">
          <span className="text-3xl font-headline font-bold text-gradient-primary tracking-tight">VidiMetrics.Ai</span>
        </Link>
        <div className="w-20 h-20 bg-surface-container-high rounded-3xl mx-auto flex items-center justify-center mb-8 ghost-border shadow-xl">
           <span className="material-symbols-outlined text-on-surface-variant text-4xl">key</span>
        </div>
        <h1 className="text-4xl font-headline font-bold text-on-surface tracking-tighter mb-4">Lost in the Stream?</h1>
        <p className="text-on-surface-variant text-sm font-label uppercase tracking-[0.2em]">Recover Your Access Token</p>
      </div>

      <div className="glass-panel ghost-border rounded-xl p-8 shadow-2xl">
        <p className="text-sm text-on-surface-variant mb-8 text-center leading-relaxed">
          Enter your synchronization email. If an account is linked, we will transmit a recovery sequence to your terminal.
        </p>
        
        <form className="space-y-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-label uppercase tracking-[0.2em] text-on-surface-variant ml-1 font-bold">Terminal ID (Email)</label>
            <input 
              className="w-full bg-surface-container-lowest/50 border-none rounded-lg py-4 px-4 text-on-surface placeholder:text-on-surface-variant/20 focus:ring-2 focus:ring-secondary/20 transition-all font-body text-sm" 
              placeholder="observer@vidimetrics.ai" 
              required 
              type="email"
            />
          </div>
          
          <button className="w-full py-4 btn-gradient rounded-lg font-bold tracking-widest uppercase text-xs shadow-lg shadow-primary/20" type="submit">
            Send Recovery Sequence
          </button>
        </form>
      </div>

      <div className="mt-8 text-center">
        <Link className="text-on-surface-variant hover:text-primary transition-colors text-sm flex items-center justify-center gap-2 group" to="/login">
          <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span>
          Return to Login
        </Link>
      </div>
    </div>
  )
}
