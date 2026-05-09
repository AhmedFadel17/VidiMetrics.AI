import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { useCreateSceneMutation } from '@/store/apis/storyEngine/scenes.api'
import { useGetShowByIdQuery, useGetEpisodeByIdQuery } from '@/store/apis'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import { LoadingScreen, ErrorScreen } from '@/components/ui/Feedback/StatusScreens'
import { useState } from 'react'

const sceneSchema = z.object({
  order: z.number().min(1, 'Order must be at least 1'),
  script: z.string().min(10, 'Script must be detailed'),
  visualPrompt: z.string().min(10, 'Visual prompt must be detailed'),
  storyEnvironmentId: z.string().min(1, 'Please select an environment'),
  characterIds: z.array(z.string()).min(1, 'Please select at least one character'),
})

type SceneFormValues = z.infer<typeof sceneSchema>

export default function SceneSetup() {
  const { showId, episodeId } = useParams<{ showId: string, episodeId: string }>();
  const navigate = useNavigate()
  
  const { data: showResponse, isLoading: isShowLoading } = useGetShowByIdQuery(showId || '');
  const { data: episodeResponse, isLoading: isEpisodeLoading } = useGetEpisodeByIdQuery(episodeId || '');
  const [createScene, { isLoading: isCreating }] = useCreateSceneMutation()

  const show = showResponse?.data;
  const episode = episodeResponse?.data;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SceneFormValues>({
    resolver: zodResolver(sceneSchema),
    defaultValues: {
      order: (episode?.scenes?.length || 0) + 1,
      characterIds: [],
    }
  })

  const selectedCharacters = watch('characterIds');

  const toggleCharacter = (charId: string) => {
    const current = selectedCharacters || [];
    if (current.includes(charId)) {
        setValue('characterIds', current.filter(id => id !== charId));
    } else {
        setValue('characterIds', [...current, charId]);
    }
  }

  const onSubmit = async (values: SceneFormValues) => {
    if (!episodeId) return;

    try {
      await createScene({
        ...values,
        episodeId: episodeId,
      }).unwrap()
      
      toast.success('Scene Initialized', {
        description: 'Parameters accepted. Neural engine is rendering the storyboard...',
      })
      
      setTimeout(() => {
        navigate(`/dashboard/series/${showId}/episodes/${episodeId}`)
      }, 1500)

    } catch (error: any) {
      toast.error('Initialization Failed', {
        description: error.data?.message || 'System failure during scene creation.',
      })
    }
  }

  if (isShowLoading || isEpisodeLoading) return <LoadingScreen message="Syncing Scene Parameters..." accentColor="cyan" />;
  if (!show || !episode) return <ErrorScreen title="Context Lost" message="Unable to retrieve episode data for scene placement." />;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in-up pb-20">
      <div className="space-y-4">
          <Breadcrumbs
            items={[
              { label: 'Series Library', path: '/dashboard/series', icon: 'shelves' },
              { label: show.title, path: `/dashboard/series/${show.id}`, icon: 'movie' },
              { label: `Ep ${episode.episodeNumber}: ${episode.title}`, path: `/dashboard/series/${show.id}/episodes/${episode.id}`, icon: 'movie_filter' },
              { label: 'Scene Setup', icon: 'add_to_photos' }
            ]}
          />
          <h1 className="font-headline text-5xl font-bold tracking-tight text-white flex items-center gap-3">
            <span className="material-symbols-outlined text-accent-cyan text-5xl">add_to_photos</span>
            Scene <span className="text-accent-cyan">Setup</span>
          </h1>
          <p className="text-white/60 font-body text-lg">Define the sequence, environment, and cast for this narrative segment.</p>
      </div>

      <div className="glass-panel p-8 lg:p-12 rounded-[3rem] border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-cyan/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 relative z-10">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Order */}
            <div className="space-y-3 col-span-1">
                <label className="block font-label text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Sequence Order</label>
                <div className="relative">
                <input 
                    {...register('order', { valueAsNumber: true })}
                    className={`w-full bg-white/5 border border-white/10 rounded-xl py-5 px-6 text-white placeholder:text-white/20 focus:ring-2 focus:ring-accent-cyan/50 focus:border-transparent transition-all font-bold text-center ${errors.order ? 'ring-2 ring-error/50' : ''}`} 
                    type="number" 
                    disabled={isCreating}
                />
                </div>
                {errors.order && <p className="text-error text-[10px] uppercase ml-1 tracking-wider mt-2">{errors.order.message}</p>}
            </div>

            {/* Environment */}
            <div className="space-y-3 col-span-3">
                <label className="block font-label text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Environment / Location</label>
                <div className="relative">
                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-white/40 text-xl pointer-events-none">location_on</span>
                <select 
                  {...register('storyEnvironmentId')}
                  className={`w-full bg-[#1A1A1A] border border-white/10 rounded-xl py-5 pl-14 pr-10 text-white focus:ring-2 focus:ring-accent-cyan/50 focus:border-transparent transition-all font-body text-base appearance-none cursor-pointer ${errors.storyEnvironmentId ? 'ring-2 ring-error/50' : ''}`}
                  disabled={isCreating}
                  defaultValue=""
                >
                  <option value="" disabled className="bg-neutral-900 text-white/20">Select Location...</option>
                  {show.storyEnvironments?.map(env => (
                    <option key={env.id} value={env.id} className="bg-neutral-900 text-white py-2">{env.name}</option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-white/40 text-xl pointer-events-none">expand_more</span>
              </div>
                {errors.storyEnvironmentId && <p className="text-error text-[10px] uppercase ml-1 tracking-wider mt-2">{errors.storyEnvironmentId.message}</p>}
            </div>
          </div>

          {/* Visual Prompt */}
          <div className="space-y-3">
            <label className="block font-label text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Visual Directive (Prompt)</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-5 top-5 text-white/40 text-xl">camera</span>
              <textarea 
                {...register('visualPrompt')}
                className={`w-full bg-white/5 border border-white/10 rounded-xl py-5 pl-14 pr-5 text-white placeholder:text-white/20 focus:ring-2 focus:ring-accent-cyan/50 focus:border-transparent transition-all font-body text-base min-h-[100px] resize-none ${errors.visualPrompt ? 'ring-2 ring-error/50' : ''}`} 
                placeholder="Cinematic 4K, low angle shot, neon lighting, volumetric fog..." 
                disabled={isCreating}
              />
            </div>
            {errors.visualPrompt && <p className="text-error text-[10px] uppercase ml-1 tracking-wider mt-2">{errors.visualPrompt.message}</p>}
          </div>

          {/* Script */}
          <div className="space-y-3">
            <label className="block font-label text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Dialogue & Action (Script)</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-5 top-5 text-white/40 text-xl">description</span>
              <textarea 
                {...register('script')}
                className={`w-full bg-white/5 border border-white/10 rounded-xl py-5 pl-14 pr-5 text-white placeholder:text-white/20 focus:ring-2 focus:ring-accent-cyan/50 focus:border-transparent transition-all font-body text-base min-h-[180px] resize-none ${errors.script ? 'ring-2 ring-error/50' : ''}`} 
                placeholder="SILAS: We don't have much time. The uplink is failing..." 
                disabled={isCreating}
              />
            </div>
            {errors.script && <p className="text-error text-[10px] uppercase ml-1 tracking-wider mt-2">{errors.script.message}</p>}
          </div>

          {/* Characters Selection */}
          <div className="space-y-3">
            <label className="block font-label text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Cast Selection</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {show.characters?.map(char => {
                    const isSelected = selectedCharacters.includes(char.id);
                    return (
                        <button
                            key={char.id}
                            type="button"
                            onClick={() => toggleCharacter(char.id)}
                            className={`flex flex-col items-center p-4 rounded-2xl border transition-all duration-300 gap-3 ${
                                isSelected 
                                    ? 'bg-accent-cyan/10 border-accent-cyan shadow-[0_0_15px_rgba(0,242,255,0.2)]' 
                                    : 'bg-white/5 border-white/10 hover:border-white/30'
                            }`}
                        >
                            <div className="w-12 h-12 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center overflow-hidden">
                                {char.referenceImageUrl ? (
                                    <img src={char.referenceImageUrl} alt={char.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="material-symbols-outlined text-white/20">person</span>
                                )}
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-wider text-center ${isSelected ? 'text-accent-cyan' : 'text-white/60'}`}>
                                {char.name}
                            </span>
                        </button>
                    );
                })}
            </div>
            {errors.characterIds && <p className="text-error text-[10px] uppercase ml-1 tracking-wider mt-2">{errors.characterIds.message}</p>}
          </div>

          <div className="pt-6 flex justify-end gap-6 items-center">
            <button 
              type="button"
              onClick={() => navigate(-1)}
              className="px-8 py-4 rounded-xl font-bold tracking-widest uppercase text-[10px] text-white/60 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
              disabled={isCreating}
            >
              Abort Setup
            </button>
            <button 
              type="submit"
              className="px-10 py-4 bg-gradient-to-r from-accent-cyan to-blue-600 rounded-xl font-bold tracking-widest uppercase text-[10px] text-on-surface shadow-lg shadow-accent-cyan/25 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-3 hover:shadow-accent-cyan/40 transition-all border border-white/10"
              disabled={isCreating}
            >
              {isCreating ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-base">autorenew</span>
                  Processing...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">rocket_launch</span>
                  Initialize Scene
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}
