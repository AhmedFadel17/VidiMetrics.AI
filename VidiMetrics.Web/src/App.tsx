import { Routes, Route } from 'react-router-dom'
import MainLayout from '@/layouts/MainLayout/MainLayout'
import DashboardLayout from '@/layouts/DashboardLayout/DashboardLayout'
import AuthLayout from '@/layouts/AuthLayout/AuthLayout'
import { AppUserRoutes, AuthRoutes, MainRoutes } from '@/routes'

function App() {
  return (
    <Routes>
      {/* Main Routes */}
      <Route element={<MainLayout />}>
        {MainRoutes.map((route, index) => (
          <Route key={index} index={index == 0} path={route.path} element={route.element} />
        ))}
      </Route>

      {/* Dashboard Routes */}
      <Route element={<DashboardLayout />}>
        {AppUserRoutes.map((route, index) => (
          <Route key={index} index={index == 0} path={route.path} element={route.element} />
        ))}
      </Route>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        {AuthRoutes.map((route, index) => (
          <Route key={index} index={index == 0} path={route.path} element={route.element} />
        ))}
      </Route>
    </Routes>
  )
}

export default App
