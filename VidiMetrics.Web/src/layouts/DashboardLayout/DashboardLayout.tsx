import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import DashboardNavbar from './Navbar'

export default function DashboardLayout() {

  return (
    <div className="flex min-h-screen bg-dashboard-bg text-white font-body selection:bg-accent-purple/30">
      <Sidebar />
      <div className="flex-1 ml-72 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <DashboardNavbar />

        {/* Page Content */}
        <main className="flex-1 min-h-0 flex flex-col p-10 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
