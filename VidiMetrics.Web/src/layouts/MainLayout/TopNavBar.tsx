import { Link } from 'react-router-dom'

export default function TopNavBar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0b1326]/80 backdrop-blur-xl border-b border-white/5 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
      <div className="flex justify-between items-center px-8 py-4 max-w-screen-2xl mx-auto">
        <Link to="/" className="text-2xl font-headline font-bold text-white tracking-tight flex items-center gap-2">
          VidiMetrics<span className="text-primary-light">.Ai</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-10">
          <Link className="text-sm font-label uppercase tracking-widest text-primary border-b-2 border-primary pb-1 font-bold" to="/">Home</Link>
          <Link className="text-sm font-label uppercase tracking-widest text-white/60 hover:text-white transition-colors font-bold" to="/dashboard">Dashboard</Link>
          <a className="text-sm font-label uppercase tracking-widest text-white/60 hover:text-white transition-colors font-bold" href="#">AI Storyboarder</a>
          <a className="text-sm font-label uppercase tracking-widest text-white/60 hover:text-white transition-colors font-bold" href="#">Pricing</a>
        </div>

        <div className="flex items-center gap-6">
          <Link to="/login" className="text-sm font-label uppercase tracking-widest text-white/60 hover:text-white font-bold transition-colors">Login</Link>
          <Link to="/register" className="relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#7818c6] to-[#ddb7ff] blur-md opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <button className="relative px-8 py-2.5 bg-gradient-to-r from-[#7818c6] to-[#ddb7ff] rounded-md font-label font-bold text-xs uppercase tracking-[0.2em] text-white shadow-xl">
              Sign-up
            </button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
