import { ErrorScreen, LoadingScreen } from "@/components/ui/Feedback/StatusScreens";
import { useGetShowsQuery } from "@/store/apis"
import { ShowStatus } from "@/types"
import { useNavigate } from "react-router-dom";

const avatarThumb = "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&auto=format&fit=crop&q=60"
export default function ActiveSeries() {
    const navigate = useNavigate();
    const { data: response, isLoading, error } = useGetShowsQuery({
        pageNumber: 1,
        pageSize: 4,
        sortOrder: "desc",
        orderBy: "createdAt"
    })

    function getStatusBox(status: ShowStatus) {
        let style = ""
        let label = ""
        switch (status) {
            case ShowStatus.Draft:
                style = "bg-white/20 text-white backdrop-blur-md"
                label = "Draft"
                break;
            case ShowStatus.InProduction:
                style = "bg-accent-purple text-white shadow-[0_0_10px_rgba(138,43,226,0.3)]"
                label = "In Production"
                break;
            case ShowStatus.Published:
                style = "bg-accent-cyan text-on-surface font-bold shadow-[0_0_10px_rgba(0,242,255,0.3)]"
                label = "Published"
                break;
            case ShowStatus.Archived:
                style = "bg-error/20 text-error backdrop-blur-md border border-error/20"
                label = "Archived"
                break;
        }
        return <span className={`px-2 py-1 ${style} text-[9px] font-black uppercase tracking-widest rounded-md animate-pulse`}>{label}</span>
    }

    if (isLoading) return <LoadingScreen message="Loading shows..." />
    if (error) return <ErrorScreen message="Failed to load shows" />
    const shows = response?.data?.items;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-accent-purple">movie_filter</span>
                    <h2 className="text-xl font-bold text-white tracking-wide">Latest Series</h2>
                </div>
                <button onClick={() => navigate("/dashboard/series")} className="text-xs font-black uppercase tracking-widest text-accent-cyan hover:underline">View All
                    <span className="material-symbols-outlined text-sm pl-2">arrow_forward</span>
                </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
                {shows && shows.map((show) => (

                    <div key={show.id}
                        onClick={() => navigate(`/dashboard/series/${show.id}`)}
                        className="glass-card cursor-pointer rounded-2xl overflow-hidden group border border-white/5 hover:border-accent-purple/30 transition-all duration-500">
                        <div className="relative h-48 overflow-hidden bg-white/5">
                            <img
                                src={show.referenceImageUrl ?? avatarThumb}
                                alt="Production"
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-dashboard-bg via-dashboard-bg/20 to-transparent"></div>
                            <div className="absolute top-4 left-4 flex gap-2">
                                {getStatusBox(show.status)}
                            </div>
                        </div>
                        <div className="p-6">
                            <h3 className="text-lg font-bold text-white mb-1">{show.title}</h3>
                            <p className="text-white/40 text-xs font-medium">{show.description}</p>
                        </div>
                    </div>
                ))}


            </div>
        </div>
    )
}
