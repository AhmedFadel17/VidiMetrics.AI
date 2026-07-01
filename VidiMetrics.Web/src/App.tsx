import { Routes, Route } from 'react-router-dom'
import MainLayout from '@/layouts/MainLayout/MainLayout'
import DashboardLayout from '@/layouts/DashboardLayout/DashboardLayout'
import AuthLayout from '@/layouts/AuthLayout/AuthLayout'
import ProtectedRoute from '@/components/guards/ProtectedRoute'
import AdminRoute from '@/components/guards/AdminRoute'
import { AppUserRoutes, AuthRoutes, MainRoutes, AppAdminRoutes } from '@/routes'


function App() {

  return (
    <Routes>
      <Route element={<MainLayout />}>
        {MainRoutes.map((route, index) => (
          <Route key={index} index={index === 0} path={route.path} element={route.element} />
        ))}
      </Route>

      <Route element={<AuthLayout />}>
        {AuthRoutes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Route>

      <Route element={<ProtectedRoute />}>

        <Route element={<DashboardLayout />}>
          {AppUserRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Route>

        <Route element={<AdminRoute />}>
          <Route element={<DashboardLayout />}>
            {AppAdminRoutes.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}
          </Route>
        </Route>

      </Route>
    </Routes>
  )
}

export default App