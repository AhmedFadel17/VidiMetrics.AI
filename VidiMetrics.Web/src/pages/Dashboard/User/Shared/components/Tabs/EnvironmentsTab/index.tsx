import EnvironmentCard from "@/components/ui/Cards/EnvironmentCard";
import { useGetEnvironmentsByShowQuery } from "@/store/apis";
import { StoryEnvironment } from "@/types/models/storyEngine";

interface EnvironmentsTabProps {
    showId: string;
    initialData?: StoryEnvironment[];
}

export default function EnvironmentsTab({ showId, initialData }: EnvironmentsTabProps) {
    const { data: response, isLoading, error } = useGetEnvironmentsByShowQuery(showId);
    const environments: StoryEnvironment[] = response?.data || []
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-white">Environments</h3>
                <button className="glass-card px-6 py-2 rounded-full flex items-center gap-2 hover:bg-white/10">
                    <span className="material-symbols-outlined text-sm text-white/60">add</span>
                    <span className="text-xs font-bold text-white uppercase tracking-widest">New Environment</span>
                </button>
            </div>

            {/* Environments Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* New Environment Action */}
                <button className="border-[1.5px] border-dashed border-white/10 rounded-[1rem] bg-white/[0.02] hover:bg-white/[0.04] hover:border-accent-cyan/40 transition-all duration-500 group flex flex-col items-center justify-center p-4 text-center min-h-[95px]">

                    <h4 className="text-lg font-bold text-white mb-2">Generate New Environment</h4>
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Tap to launch AI screenwriter</p>
                </button>
                {isLoading ? (
                    [1, 2, 3].map(i => (
                        <div key={i} className="glass-card h-64 rounded-2xl animate-pulse bg-white/5 border border-white/5"></div>
                    ))
                ) : error ? (
                    <div className="col-span-full p-12 glass-panel border-error/20 flex flex-col items-center justify-center text-center space-y-4">
                        <span className="material-symbols-outlined text-error text-5xl">warning</span>
                        <h3 className="text-xl font-bold text-white">Neural Uplink Failed</h3>
                        <p className="text-white/40">Unable to retrieve environment data.</p>
                    </div>
                ) : (
                    environments.map((env, index) => (
                        <EnvironmentCard key={index} environment={env} />
                    ))
                )}
            </div>
        </div>
    )
}