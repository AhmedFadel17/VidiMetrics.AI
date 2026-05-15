import { useGetCharacterByIdQuery, useGetShowByIdQuery, useDeleteCharacterMutation } from '@/store/apis'
import { useParams, useNavigate } from 'react-router-dom'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import { ErrorScreen, LoadingScreen } from '@/components/ui/Feedback/StatusScreens'
import { toast } from 'sonner'
import { useState } from 'react'
import ConfirmationDialog from '@/components/ui/Feedback/ConfirmationDialog'
import { showToast } from '@/utils/toast'

export default function CharacterDetails() {
    const { showId, id: characterId } = useParams<{ showId: string, id: string }>();
    const navigate = useNavigate();
    const { data: showResponse, isLoading: isShowLoading } = useGetShowByIdQuery(showId || '');
    const { data: characterResponse, isLoading: isCharacterLoading } = useGetCharacterByIdQuery(characterId || '');
    const [deleteCharacter, { isLoading: isDeleting }] = useDeleteCharacterMutation();

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const show = showResponse?.data;
    const character = characterResponse?.data;

    if (isShowLoading || isCharacterLoading) return <LoadingScreen message="Accessing Character Archives..." accentColor="purple" />
    if (!show || !character) return <ErrorScreen title="Series Connection Lost" message="Unable to retrieve character details for character placement." />

    const traits = character.personalityTraits?.split(',').map(t => t.trim()).filter(Boolean) || [];
    const formattedDate = new Date(character.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    const handleDelete = async () => {
        if (!characterId) return;
        try {
            await deleteCharacter(characterId).unwrap();
            showToast.success('Character Deprioritized', `${character.name} has been removed from the active series archives.`);
            navigate(`/dashboard/series/${showId}?tab=Characters`);
        } catch (error: any) {
            showToast.error('De-initialization Failed', error.data?.message || 'A system error occurred while trying to remove the character.');
        } finally {
            setIsDeleteDialogOpen(false);
        }
    };

    return (
        <div className="space-y-10 pb-20">
            {/* Top Navigation / Breadcrumbs */}
            <Breadcrumbs items={[
                { label: 'Home', path: '/' },
                { label: 'Series Library', path: '/dashboard/series' },
                { label: show.title, path: `/dashboard/series/${show.id}` },
                { label: 'Characters', path: `/dashboard/series/${show.id}?tab=Characters` },
                { label: character.name },
            ]} />

            {/* Main Content Canvas */}
            <div className="max-w-7xl mx-auto px-4 lg:px-10">
                {/* Hero Section & Asymmetric Layout */}
                <div className="grid grid-cols-12 gap-10 items-start">
                    {/* Character Portrait (The Pulse) */}
                    <div className="col-span-12 lg:col-span-5 lg:sticky lg:top-28">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent z-10 rounded-2xl"></div>
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                            <div className="relative rounded-2xl overflow-hidden aspect-[4/5] cinematic-shadow border border-outline-variant/15 bg-surface-container-low">
                                {character.referenceImageUrl ? (
                                    <img
                                        alt={`${character.name} Character Portrait`}
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                        src={character.referenceImageUrl}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-on-surface-variant/20">
                                        <span className="material-symbols-outlined text-9xl">person</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Insight Level Floating Badge */}
                        <div className="absolute -bottom-6 -right-6 glass-card p-6 rounded-2xl border border-primary/20 shadow-2xl z-20 hidden md:block">
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold mb-3">Insight Level</span>
                                <div className="relative w-20 h-20 flex items-center justify-center">
                                    <svg className="w-full h-full -rotate-90">
                                        <circle className="text-surface-container-highest" cx="40" cy="40" fill="transparent" r="36" stroke="currentColor" strokeWidth="6"></circle>
                                        <circle
                                            className="text-primary"
                                            cx="40" cy="40"
                                            fill="transparent"
                                            r="36"
                                            stroke="currentColor"
                                            strokeWidth="6"
                                            strokeDasharray="226"
                                            strokeDashoffset={226 - (226 * (character.insightLevel || 0)) / 100}
                                            strokeLinecap="round"
                                        ></circle>
                                    </svg>
                                    <span className="absolute font-headline text-2xl font-bold text-on-surface">
                                        {character.insightLevel || 0}<span className="text-xs ml-0.5 text-primary-fixed-dim">%</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="col-span-12 lg:col-span-7 pt-6">
                        <div className="flex flex-col h-full">
                            <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-6">
                                <div>
                                    <div className="inline-flex items-center px-3 py-1 rounded-md bg-primary/10 border border-primary/20 mb-4">
                                        <span className="w-2 h-2 rounded-full bg-primary mr-2 animate-pulse"></span>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Creative Entity</span>
                                    </div>
                                    <h2 className="text-5xl lg:text-7xl font-headline font-bold text-on-surface tracking-tighter mb-2">{character.name}</h2>
                                    <p className="text-xl text-on-surface-variant font-light italic">"{character.role}"</p>
                                </div>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => showToast.info('Edit mode coming soon', 'Character modification is being recalibrated.')}
                                        className="flex items-center px-5 py-2.5 rounded-lg glass-card border border-outline-variant/20 text-on-surface hover:border-secondary hover:text-secondary transition-all active:scale-95"
                                    >
                                        <span className="material-symbols-outlined mr-2 text-xl">edit</span>
                                        <span className="font-medium text-sm">Edit</span>
                                    </button>
                                    <button
                                        onClick={() => setIsDeleteDialogOpen(true)}
                                        disabled={isDeleting}
                                        className="flex items-center px-5 py-2.5 rounded-lg bg-error-container/20 border border-error/20 text-error hover:bg-error-container/40 transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        <span className="material-symbols-outlined mr-2 text-xl">{isDeleting ? 'sync' : 'delete_outline'}</span>
                                        <span className="font-medium text-sm">{isDeleting ? 'Removing...' : 'Remove'}</span>
                                    </button>
                                </div>
                            </div>

                            {/* Info Grid (Bento Style) */}
                            <div className="grid grid-cols-2 gap-6 mb-12">
                                {/* Narrative Profile Card */}
                                <div className="col-span-2 glass-card rounded-2xl p-8 border border-outline-variant/10 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 opacity-5">
                                        <span className="material-symbols-outlined text-9xl">psychology</span>
                                    </div>
                                    <div className="relative z-10">
                                        <h3 className="font-headline text-lg font-bold text-primary mb-6 flex items-center">
                                            <span className="material-symbols-outlined mr-2">auto_awesome</span>
                                            Narrative Profile
                                        </h3>
                                        <div className="space-y-6">
                                            <div>
                                                <label className="text-[10px] uppercase tracking-widest text-on-surface-variant/60 font-bold block mb-2">Role in Series</label>
                                                <p className="text-lg text-on-surface leading-relaxed">{character.role}</p>
                                            </div>
                                            <div>
                                                <label className="text-[10px] uppercase tracking-widest text-on-surface-variant/60 font-bold block mb-2">Personality Traits</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {traits.map((trait, index) => (
                                                        <span key={index} className="px-3 py-1 bg-surface-container rounded-md text-xs font-medium border border-outline-variant/10">
                                                            {trait}
                                                        </span>
                                                    ))}
                                                    {traits.length === 0 && <span className="text-on-surface-variant/40 text-xs italic">No traits defined</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Physical Profile Card */}
                                <div className="col-span-2 lg:col-span-1 glass-card rounded-2xl p-8 border border-outline-variant/10">
                                    <h3 className="font-headline text-lg font-bold text-secondary mb-6 flex items-center">
                                        <span className="material-symbols-outlined mr-2">fingerprint</span>
                                        Physicality
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-[10px] uppercase tracking-widest text-on-surface-variant/60 font-bold block mb-1">Description</label>
                                            <p className="text-sm text-on-surface leading-snug">{character.physicalDescription || 'No physical description available.'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Clothing Style Card */}
                                <div className="col-span-2 lg:col-span-1 glass-card rounded-2xl p-8 border border-outline-variant/10">
                                    <h3 className="font-headline text-lg font-bold text-tertiary mb-6 flex items-center">
                                        <span className="material-symbols-outlined mr-2">checkroom</span>
                                        Attire
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-[10px] uppercase tracking-widest text-on-surface-variant/60 font-bold block mb-1">Core Style</label>
                                            <p className="text-sm text-on-surface leading-snug">{character.clothingStyle || 'No clothing style specified.'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>



                            {/* Metadata Bar */}
                            <footer className="mt-auto pt-8 border-t border-outline-variant/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex items-center space-x-8">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] uppercase tracking-widest text-on-surface-variant/40 font-bold">Created On</span>
                                        <span className="text-xs font-medium">{formattedDate}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] uppercase tracking-widest text-on-surface-variant/40 font-bold">Generated By</span>
                                        <span className="text-xs font-medium flex items-center">
                                            <span className="material-symbols-outlined text-[14px] mr-1 text-primary">bolt</span>
                                            {character.createdBy || 'VidiMetrics AI'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 text-on-surface-variant/40">
                                    <span className="material-symbols-outlined text-sm">lock_open</span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Public Asset</span>
                                </div>
                            </footer>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAB for quick AI generation */}
            <div className="fixed bottom-10 right-10 z-50">
                <button className="bg-gradient-to-r from-primary to-primary-container p-4 rounded-full shadow-[0_10px_40px_rgba(120,24,198,0.5)] hover:scale-110 active:scale-95 transition-all group overflow-hidden relative">
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="material-symbols-outlined text-on-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_fix_high</span>
                </button>
            </div>

            {/* Confirmation Dialogs */}
            <ConfirmationDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDelete}
                title="Remove Character Archetype"
                description={`Are you sure you want to remove ${character.name} from the series archives? This action will permanently de-initialize their narrative profile and visual assets.`}
                confirmText="De-initialize"
                variant="danger"
                isLoading={isDeleting}
            />
        </div>
    )
}
