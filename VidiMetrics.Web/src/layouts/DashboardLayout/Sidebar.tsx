import { Link, useLocation } from 'react-router-dom'

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
  { label: 'Storyboarder', path: '/storyboarder', icon: 'movie_edit' },
  { label: 'Tasks', path: '/tasks', icon: 'assignment_turned_in' },
  { label: 'Prompts', path: '/prompts', icon: 'psychology' },
  { label: 'Settings', path: '/settings', icon: 'settings' },
]

export default function Sidebar() {
  const { pathname } = useLocation()

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 z-40 bg-surface-container-low bg-gradient-to-b from-surface-container-low to-background shadow-[4px_0_24px_rgba(0,0,0,0.5)] flex flex-col py-6">
      <div className="px-6 mb-10">
        <h1 className="text-primary font-headline font-bold text-2xl tracking-tight">VidiMetrics</h1>
        <p className="text-secondary text-[10px] uppercase tracking-[0.2em] mt-1 font-bold">AI Engine Active</p>
      </div>
      
      <nav className="flex-1 px-2 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-200 ease-in-out hover:translate-x-1 font-body font-medium text-sm
                ${isActive 
                  ? 'bg-primary/10 text-primary border-r-4 border-primary' 
                  : 'text-on-surface/50 hover:bg-on-surface/5'}`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="px-4 mt-auto">
        <button className="w-full py-3 btn-gradient rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-transform">
          <span className="material-symbols-outlined text-sm">add_circle</span>
          <span>New Story</span>
        </button>
        
        <div className="mt-6 flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20 bg-surface-container-highest">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9udzcgy1BvWVJoZYHGn67KJQ601QPn2sCn2bddzmfZN_FcEhXT6fiGvt6dV1KM-LAwb9R7M_ASSWZlSEz4unjetvY1ElmQ3Ny0B33xNPayLn9KdUYqWmq7gOt1r7uoLWLXWfhRMLwtIfhCNpv29-TwPHcxUZipJUC3TcS7JtyPwTPh8Z8wu13mqhJWMNJw8VfZZUE-16h7trh0JCeiPN4B-FcLcYNAZOEy8UWpvzQVzIG9ItMwKvO0AFIzHjgb_PD7JT_vWLSLz0" 
              alt="User Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-on-surface">Alex Rivera</span>
            <span className="text-[10px] text-on-surface-variant uppercase tracking-tighter">Pro Creator</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
