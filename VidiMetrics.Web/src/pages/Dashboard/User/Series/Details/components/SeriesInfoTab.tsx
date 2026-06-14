import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Show } from '@/types/models/storyEngine';
import { useUpdateShowMutation } from '@/store/apis/storyEngine/shows.api';
import { ShowStatus } from '@/types/enums';
import { InputField } from '@/components/ui/Inputs/InputField';
import { TextAreaField } from '@/components/ui/Inputs/TextAreaField';

// 📋 1. Define Form Validation Schema with Zod
const seriesInfoSchema = z.object({
    title: z.string().min(1, 'Project title is required').max(100, 'Title is too long'),
    description: z.string().min(10, 'Synopsis must be at least 10 characters long'),
    visualStyle: z.string().min(1, 'Genre/Visual Style is required'),
    targetAudience: z.string().min(1, 'Target audience statement is required'),
});

type SeriesInfoFormValues = z.infer<typeof seriesInfoSchema>;

interface SeriesInfoTabProps {
    show: Show;
}

export default function SeriesInfoTab({ show }: SeriesInfoTabProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [updateShow, { isLoading: isUpdating }] = useUpdateShowMutation();

    // 📋 2. Initialize React Hook Form
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<SeriesInfoFormValues>({
        resolver: zodResolver(seriesInfoSchema),
        defaultValues: {
            title: show.title,
            description: show.description,
            visualStyle: show.visualStyle,
            targetAudience: show.targetAudience,
        },
    });

    // Sync form values if the parent component sends down updated props values
    useEffect(() => {
        reset({
            title: show.title,
            description: show.description,
            visualStyle: show.visualStyle,
            targetAudience: show.targetAudience,
        });
    }, [show, reset]);

    // 💾 3. Handle Form Submit
    const onSubmit = async (data: SeriesInfoFormValues) => {
        try {
            await updateShow({
                id: show.id,
                body: {
                    title: data.title,
                    description: data.description,
                    visualStyle: data.visualStyle,
                    targetAudience: data.targetAudience,
                },
            }).unwrap();

            toast.success('Series details updated successfully');
            setIsEditing(false);
        } catch (error) {
            toast.error('Failed to update series details');
            console.error('Update error:', error);
        }
    };

    // 🔄 4. Handle Discard/Cancel Actions
    const handleDiscard = () => {
        reset(); // Reverts fields back to initial clean default state values
        setIsEditing(false);
    };

    const getStatusLabel = (status: ShowStatus) => {
        switch (status) {
            case ShowStatus.Draft: return 'Draft';
            case ShowStatus.InProduction: return 'In Production';
            case ShowStatus.Published: return 'Published';
            case ShowStatus.Archived: return 'Archived';
            default: return 'Unknown';
        }
    };

    return (
        <div className="glass-card rounded-xl p-10 border border-white/5 space-y-8 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-purple/5 blur-[100px] pointer-events-none" />

            {/* Header / Action Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10 border-b border-white/5 pb-6">
                <div>
                    <h3 className="text-3xl font-headline font-bold text-white tracking-tight">Series Details</h3>
                    <p className="text-white/40 text-sm mt-1">Manage core metadata and project settings.</p>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                    {/* Discard Button (Shows only during edit phase) */}
                    {isEditing && (
                        <button
                            type="button"
                            onClick={handleDiscard}
                            disabled={isUpdating}
                            className="px-5 py-2.5 rounded-xl text-xs uppercase tracking-widest font-black font-mono text-white/40 hover:text-rose-400 border border-white/5 hover:border-rose-500/20 bg-white/5 hover:bg-rose-500/5 transition-all duration-300"
                        >
                            Discard
                        </button>
                    )}

                    {/* Submit / Edit Master Action Trigger */}
                    <button
                        type="button"
                        onClick={isEditing ? handleSubmit(onSubmit) : () => setIsEditing(true)}
                        disabled={isUpdating}
                        className={`px-6 py-2.5 rounded-xl text-xs uppercase tracking-widest font-bold flex items-center gap-2 transition-all duration-300 ${isEditing
                            ? 'bg-primary text-on-primary shadow-[0_0_15px_rgba(0,242,255,0.4)]'
                            : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                            } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <span className={`material-symbols-outlined text-sm ${isUpdating ? 'animate-spin' : ''}`}>
                            {isUpdating ? 'sync' : isEditing ? 'save' : 'edit'}
                        </span>
                        {isUpdating ? 'Saving...' : isEditing ? 'Save Changes' : 'Edit Details'}
                    </button>
                </div>
            </div>

            {/* Main Form Body Panel */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">

                {/* Project Title */}
                <div className="space-y-2">
                    {isEditing ? (
                        <InputField
                            label='Series Title'
                            type="text"
                            placeholder="e.g. The Orion Chronicles"
                            icon="local_movies"
                            error={errors.title?.message}
                            {...register('title')}
                        />
                    ) : (
                        <div className='space-y-2'>
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 pl-2">Series Title</label>
                            <div className="w-full bg-black/20 border border-transparent rounded-xl px-4 py-3 text-white font-bold">
                                {show.title}
                            </div>
                        </div>
                    )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                    {isEditing ? (
                        <TextAreaField
                            label='Description'
                            placeholder="A brief synopsis of what this series is about..."
                            icon="info"
                            rows={5}
                            error={errors.description?.message}
                            {...register('description')}
                        />
                    ) : (
                        <div className='space-y-2'>
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 pl-2">Description</label>
                            <div className="w-full bg-black/20 border border-transparent rounded-xl px-4 py-3 text-white/80 leading-relaxed min-h-[104px] whitespace-pre-wrap">
                                {show.description}
                            </div>
                        </div>
                    )}
                </div>

                {/* Meta Attributes Layer Matrix */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Genre / Visual Style */}
                    <div className="space-y-2">
                        {isEditing ? (
                            <TextAreaField
                                label="Genre / Visual Style"
                                placeholder="e.g. Cyberpunk noir, anime, cinematic..."
                                icon="palette"
                                rows={2}
                                error={errors.visualStyle?.message}
                                {...register('visualStyle')}
                            />
                        ) : (
                            <div className='space-y-2'>
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 pl-2">Genre / Visual Style</label>
                                <div className="w-full bg-black/20 border border-transparent rounded-xl px-4 py-3 text-white">
                                    {show.visualStyle}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Target Audience */}
                    <div className="space-y-2">
                        {isEditing ? (
                            <TextAreaField
                                label='Target Audience'
                                placeholder="e.g. Young Adults 18-35"
                                icon="group"
                                rows={2}
                                error={errors.targetAudience?.message}
                                {...register('targetAudience')}
                            />
                        ) : (
                            <div className='space-y-2'>
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 pl-2">Target Audience</label>

                                <div className="w-full bg-black/20 border border-transparent rounded-xl px-4 py-3 text-white">
                                    {show.targetAudience}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Production Status (Read-Only Footnote Indicator) */}
                <div className="space-y-2 pt-4 border-t border-white/5">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 pl-2">Production Status</label>
                    <div className="w-full bg-black/20 border border-transparent rounded-xl px-4 py-3 text-accent-cyan font-bold select-none">
                        {getStatusLabel(show.status)}
                    </div>
                </div>
            </form>
        </div>
    );
}