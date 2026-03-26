import { Link } from 'react-router-dom'

export default function TopNavBar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0b1326]/80 backdrop-blur-xl border-b border-[#ddb7ff]/15 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
      <div className="flex justify-between items-center px-8 py-4 max-w-screen-2xl mx-auto">
        <Link to="/" className="text-2xl font-headline font-bold text-gradient-primary">
          VidiMetrics.Ai
        </Link>
        <div className="hidden md:flex items-center gap-8 font-headline font-bold tracking-tight">
          <Link className="text-primary border-b-2 border-primary pb-1 transform transition-transform active:scale-95" to="/">Home</Link>
          <Link className="text-on-surface/70 hover:text-on-surface transition-colors hover:bg-primary/10 p-1 px-3 rounded transform transition-transform active:scale-95" to="/dashboard">Dashboard</Link>
          <a className="text-on-surface/70 hover:text-on-surface transition-colors hover:bg-primary/10 p-1 px-3 rounded transform transition-transform active:scale-95" href="#">AI Storyboarder</a>
          <a className="text-on-surface/70 hover:text-on-surface transition-colors hover:bg-primary/10 p-1 px-3 rounded transform transition-transform active:scale-95" href="#">Pricing</a>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-on-surface/70 hover:text-on-surface font-headline font-bold transform transition-transform active:scale-95">Login</Link>
          <Link to="/register" className="btn-gradient px-6 py-2 rounded-md font-headline font-bold shadow-lg shadow-primary/20">Sign-up</Link>
        </div>
      </div>
    </nav>
  )
}
