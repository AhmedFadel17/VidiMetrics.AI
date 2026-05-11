import { useAuth } from 'react-oidc-context';
import { Link, useLocation } from 'react-router-dom'
import { SidebarRoutes } from '@/routes/sidebar';


export default function Sidebar() {
  const { pathname } = useLocation()
  const auth = useAuth();
  const user = auth.user;

  return (
    <aside className="h-screen w-72 fixed left-0 top-0 z-40 bg-dashboard-bg border-r border-white/5 flex flex-col py-8 overflow-y-auto">
      {/* Logo */}
      <div className="px-8 mb-8">
        <Link to="/">
          <h1 className="text-white font-headline font-bold text-2xl tracking-tight flex items-center gap-2">
            VidiMetrics.Ai
          </h1>
        </Link>
      </div>



      {/* Navigation */}
      <nav className="flex-1 px-4 space-y">
        {SidebarRoutes.map((item) => {
          const isActive = pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-6 py-2 rounded-xl transition-all duration-300 group
                ${isActive
                  ? 'bg-accent-purple/10 text-white border border-accent-purple/20 shadow-[0_0_20px_rgba(138,43,226,0.1)]'
                  : 'text-white/40 hover:bg-white/5 hover:text-white/80'}`}
            >
              <span className={`material-symbols-outlined text-2xl transition-colors ${isActive ? 'text-accent-purple' : 'group-hover:text-white/60'}`}>
                {item.icon}
              </span>
              <span className="font-bold text-[13px] tracking-wide">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-6 bg-accent-purple rounded-full shadow-[0_0_10px_#8a2be2]"></div>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Pro Producer Card */}
      <div className="px-4 mt-8 mb-6">
        <div className="glass-card rounded-3xl p-5 relative overflow-hidden group border border-white/10">
          <div className="absolute top-0 right-0 w-24 h-24 bg-accent-pink/10 blur-3xl -mr-8 -mt-8 group-hover:bg-accent-pink/20 transition-colors"></div>
          <div className="relative z-10">


            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
                <span className="text-white/40">Render Credits</span>
                <span className="text-primary">84%</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-accent-purple to-primary w-[84%] shadow-[0_0_10px_rgba(255,0,127,0.5)]"></div>
              </div>
              <div className="flex justify-between text-xs font-[500] text-white/40 tracking-tighter">
                <span className="">12,400 / 15,000 available</span>
              </div>
            </div>
          </div>
        </div>
      </div>


    </aside>
  )
}
