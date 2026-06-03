import { Link, useLocation } from 'react-router-dom';
import { SidebarRoutes } from '@/routes/sidebar';
import { useGetBalanceQuery } from '@/store/apis';

export default function Sidebar() {
  const { pathname } = useLocation();
  const { data, isLoading, isError } = useGetBalanceQuery();

  const wallet = data?.data;

  const total = wallet?.totalCreditsAvailable ?? 0;
  const used = wallet?.creditsUsed ?? 0;
  const remaining = Math.max(0, total - used);
  const fillPercentage = total > 0 ? (remaining / total) * 100 : 0;

  return (
    <aside className="h-screen w-72 fixed left-0 top-0 z-40 bg-dashboard-bg border-r border-white/5 flex flex-col py-8 overflow-y-auto">
      {/* Logo Section */}
      <div className="px-8 mb-8">
        <Link to="/">
          <h1 className="text-white font-headline font-bold text-2xl tracking-tight flex items-center gap-2">
            VidiMetrics.Ai
          </h1>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-1">
        {SidebarRoutes.map((item) => {
          const isActive = pathname === item.path;
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
          );
        })}
      </nav>

      {/* Credit Wallet Information Box Footer */}
      <div className="px-4 mt-8 mb-6">
        <div className="bg-white/[0.02] rounded-3xl p-5 relative overflow-hidden group border border-white/5">
          <div className="absolute top-0 right-0 w-24 h-24 bg-accent-purple/5 blur-3xl -mr-8 -mt-8 group-hover:bg-accent-purple/10 transition-all duration-500"></div>

          <div className="relative z-10 space-y-3">
            {isLoading ? (
              /* Skeleton Loading Placeholder */
              <div className="animate-pulse space-y-2">
                <div className="h-3 bg-white/10 rounded w-1/2"></div>
                <div className="h-2 bg-white/5 rounded w-full"></div>
                <div className="h-3 bg-white/10 rounded w-3/4"></div>
              </div>
            ) : isError || !wallet ? (
              /* Graceful State Recovery Handler */
              <div className="flex flex-col items-center justify-center py-1 text-center">
                <span className="material-symbols-outlined text-white/20 text-xl mb-1">cloud_off</span>
                <span className="text-[11px] text-white/30 font-medium">Failed to update credits</span>
              </div>
            ) : (
              /* Real-time Content Display */
              <>
                <div className="flex justify-between items-baseline">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Render Balance</span>
                  <span className="text-sm font-black text-white tracking-tight">
                    {remaining.toLocaleString()} <span className="text-[10px] text-white/40 font-normal">left</span>
                  </span>
                </div>

                {/* Progress Bar with Dynamic Width Inline Assignment */}
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-accent-purple to-primary rounded-full shadow-[0_0_8px_rgba(138,43,226,0.4)] transition-all duration-1000 ease-out"
                    style={{ width: `${fillPercentage}%` }}
                  ></div>
                </div>

                <div className="flex justify-between items-center text-[11px] font-medium text-white/40 tracking-tight">
                  <span>Quota usage metrics</span>
                  <span className="text-white/60 font-mono">
                    {used.toLocaleString()} / {total.toLocaleString()}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}