import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
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

      <main className="relative z-10 w-full px-6 py-12 flex flex-col items-center justify-center">
        <Outlet />
      </main>
    </div>
  )
}
