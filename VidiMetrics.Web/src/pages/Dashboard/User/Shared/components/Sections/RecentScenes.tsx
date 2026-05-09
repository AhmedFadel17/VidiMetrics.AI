import { Link } from 'react-router-dom'
import { ErrorScreen, LoadingScreen } from '@/components/ui/Feedback/StatusScreens'
import { useGetScenesQuery } from '@/store/apis'
import { Scene } from '@/types';
import SceneCard from '@/components/ui/Cards/SceneCard';

interface RecentScenesProps {
    showId: string
}
export default function RecentScenes({ showId }: RecentScenesProps) {
    const { data: response, isLoading, error } = useGetScenesQuery({ showId, limit: 3 });
    const scenes: Scene[] = response?.data?.items || []
    if (isLoading) return <LoadingScreen message="Loading Scenes" />
    if (error) return <ErrorScreen onRetry={() => { }} title="Error" message="Failed to load scenes" />

    return (
        <div className="glass-card rounded-[3rem] p-10 border border-white/5 h-full flex flex-col">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-headline font-bold text-white tracking-tight">Recent Scenes</h3>
                <Link to="/dashboard/storyboarder" className="text-[10px] font-black uppercase tracking-widest text-accent-purple hover:underline flex items-center gap-2">
                    Storyboarder <span className="material-symbols-outlined text-sm text-accent-purple">open_in_new</span>
                </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 flex-grow">
                {scenes.map((scene) => (
                    <SceneCard key={scene.id} scene={scene} />
                ))}
            </div>
        </div>
    )
}
