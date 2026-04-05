import { useAuth } from 'react-oidc-context';


export default function DashboardNavbar() {
    const auth = useAuth();
    const user = auth.user;

    return (
        <header className="h-20 border-b border-white/5 px-10 flex items-center justify-end sticky top-0 z-30 bg-dashboard-bg/80 backdrop-blur-md">
            <div className="flex items-center gap-4">
                <div className="text-right flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Operator</span>
                    <span className="text-sm font-bold text-white">{user?.profile.name || 'Alex Rivera'}</span>
                </div>
                <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 p-0.5">
                    <img
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                        alt="Operator"
                        className="w-full h-full object-cover rounded-full"
                    />
                </div>
            </div>
        </header>
    )
}
