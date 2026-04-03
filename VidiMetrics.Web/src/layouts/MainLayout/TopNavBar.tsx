import { NavbarRoutes } from '@/routes'
import { Link, NavLink } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { useAuth } from 'react-oidc-context'
export default function TopNavBar() {
  const auth = useAuth();
  console.log("auth:", auth.isAuthenticated, auth.user);
  const handleLogin = async () => {
    try {
      await auth.signinRedirect()
    } catch (error) {
      console.error("Login redirect failed:", error)
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
    <nav className="fixed top-0 w-full z-50 bg-[#0b1326]/80 backdrop-blur-xl border-b border-white/5 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
      <div className="flex justify-between items-center px-8 py-4 max-w-screen-2xl mx-auto">
        <Link to="/" className="text-2xl font-headline font-bold text-white tracking-tight flex items-center">
          VidiMetrics<span className="text-primary-light">.Ai</span>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {NavbarRoutes.map((route, index) => {
            return (
              <NavLink
                key={index}
                className={({ isActive }: { isActive: boolean }) =>
                  `text-sm font-label uppercase tracking-widest font-bold transition-colors ${isActive
                    ? 'text-primary border-b-2 border-primary pb-1'
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
              <button
                className='text-sm font-label uppercase tracking-widest text-white/60 hover:text-white font-bold transition-colors'
                onClick={handleLogin}
              >
                Login
              </button>
              <Link to="/register">
                <Button
                  variant="light"
                  wrapperClassName="overflow-hidden"
                >
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
