import { NavbarRoutes } from '@/routes/navbar'
import { Link, NavLink } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { useAuth } from 'react-oidc-context'
import logo from "@/assets/images/logos/logo.png";
export default function TopNavBar() {
  const auth = useAuth();

  const handleLogin = async () => {
    try {
      await auth.signinRedirect()
    } catch (error) {
      console.error("Login redirect failed:", error)
    }
  }

  const handleRegister = async () => {
    try {
      await auth.signinRedirect({ extraQueryParams: { prompt: 'register' } })
    } catch (error) {
      console.error("Register redirect failed:", error)
    }
  }

  const handleLogout = async () => {
    try {
      await auth.signoutRedirect()
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface-dim/80 backdrop-blur-xl border-b border-white/5 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
      <div className="flex justify-between items-center px-8 py-4 max-w-screen-2xl mx-auto font-headline">
        <div className="text-2xl font-headline font-bold text-white tracking-tight flex items-center">
          <div className='flex items-center gap-2'>
            <img src={logo} alt="logo" className='w-10 h-10' />
            <div>
              <span className='text-primary-light'>VidiMetrics</span>
              <span className="text-primary">.Ai</span>
            </div>

          </div>
        </div>

        <div className="hidden md:flex items-center gap-10">
          {NavbarRoutes.map((route, index) => {
            return (
              <NavLink
                key={index}
                className={({ isActive }: { isActive: boolean }) =>
                  `text-sm uppercase tracking-widest font-bold transition-colors ${isActive
                    ? 'text-primary border-b border-primary pb-1'
                    : 'text-white/60 hover:text-white'
                  }`
                }
                to={route.path}
                end={route.path === '/'}
              >
                {route.label}
              </NavLink>
            )
          })}
        </div>

        <div className="flex items-center gap-6">
          {auth.isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className='text-sm font-label uppercase tracking-widest text-white/60 hover:text-white font-bold transition-colors'
              >
                Dashboard
              </Link>
              <button
                className='text-sm font-label uppercase tracking-widest text-primary hover:text-primary-light font-bold transition-colors'
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={handleLogin}
              >
                Login
              </Button>
              <Button
                variant="light"
                wrapperClassName="overflow-hidden"
                onClick={handleRegister}
              >
                Get Started
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
