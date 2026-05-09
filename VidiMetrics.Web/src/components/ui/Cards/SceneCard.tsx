import { Scene } from "@/types/models/storyEngine";
import { Link } from "react-router-dom";

interface SceneCardProps {
    scene: Scene;
}

export default function SceneCard({ scene }: SceneCardProps) {
    return (
        <Link 
            to={`/dashboard/scenes/${scene.id}`}
            className="group block"
        >
            <div className="glass-card rounded-[2rem] p-6 border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-500 space-y-4">
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-accent-cyan">Scene {scene.order}</span>
                        <h4 className="text-white font-bold line-clamp-1">{scene.visualPrompt || "Untitled Scene"}</h4>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-accent-cyan/20 transition-colors">
                        <span className="material-symbols-outlined text-white/40 group-hover:text-accent-cyan text-sm">movie_edit</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <p className="text-white/40 text-xs line-clamp-3 leading-relaxed italic">
                        "{scene.script}"
                    </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex -space-x-2">
                        {scene.characters?.slice(0, 3).map((char, i) => (
                            <div key={i} className="w-6 h-6 rounded-full border border-surface bg-neutral-800 flex items-center justify-center overflow-hidden">
                                {char.referenceImageUrl ? (
                                    <img src={char.referenceImageUrl} alt={char.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-[8px] font-black text-white/40">{char.name[0]}</span>
                                )}
                            </div>
                        ))}
                        {(scene.characters?.length || 0) > 3 && (
                            <div className="w-6 h-6 rounded-full border border-surface bg-white/5 flex items-center justify-center text-[8px] font-black text-white/40">
                                +{scene.characters!.length - 3}
                            </div>
                        )}
                    </div>
                    <span className="text-[9px] font-bold text-white/20 uppercase tracking-tighter">
                        {scene.characters?.length || 0} Characters
                    </span>
                </div>
            </div>
        </Link>
    );
}
