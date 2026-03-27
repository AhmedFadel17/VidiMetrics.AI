import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-background text-on-surface">
      <Sidebar />
      <main className="ml-64 p-8 flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  )
}
