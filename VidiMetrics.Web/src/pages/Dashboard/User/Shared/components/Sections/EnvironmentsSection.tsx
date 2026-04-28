import EnvironmentCard from "@/components/ui/Cards/EnvironmentCard"
import { StoryEnvironment } from "@/types/models/storyEngine"

interface EnvironmentsSectionProps {
    showId: string
    initialData?: StoryEnvironment[]
}

export default function EnvironmentsSection({ showId, initialData = [] }: EnvironmentsSectionProps) {
    const environments = initialData.length > 0 ? initialData : [];

    return (
        <div className="glass-card rounded-[3rem] p-10 border border-white/5 h-full flex flex-col">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-headline font-bold text-white tracking-tight">Environments</h3>
                <span className="material-symbols-outlined text-white/20">landscape</span>
            </div>

            <div className="space-y-4 flex-grow">
                {environments.map((env, index) => (
                    <EnvironmentCard key={index} environment={env} />
                ))}
            </div>

            <button className="mt-8 w-full glass-card hover:bg-white/10 px-6 py-4 rounded-xl flex items-center justify-center gap-3 border border-white/5 transition-all duration-300 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white">
                Generate New World
            </button>
        </div>
    )
}
