import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { useCreateCharacterMutation } from '@/store/apis/storyEngine/characters.api'
import { useGetShowByIdQuery } from '@/store/apis'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import { LoadingScreen, ErrorScreen } from '@/components/ui/Feedback/StatusScreens'

const characterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.string().min(2, 'Role must be defined'),
  physicalDescription: z.string().min(10, 'Description must be detailed'),
  clothingStyle: z.string().min(5, 'Clothing style must be specified'),
  personalityTraits: z.string().min(5, 'Personality traits must be specified'),
  insightLevel: z.number().min(1).max(10),
})

type CharacterFormValues = z.infer<typeof characterSchema>

export default function CharacterSetup() {
  const { showId } = useParams<{ showId: string }>();
  const navigate = useNavigate()
  const { data: showResponse, isLoading: isShowLoading } = useGetShowByIdQuery(showId || '');
  const [createCharacter, { isLoading: isCreating }] = useCreateCharacterMutation()

  const show = showResponse?.data;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CharacterFormValues>({
    resolver: zodResolver(characterSchema),
    defaultValues: {
      insightLevel: 5,
    }
  })

  const onSubmit = async (values: CharacterFormValues) => {
    if (!showId) return;

    try {
      await createCharacter({
        ...values,
        showId: showId,
      }).unwrap()
      
      toast.success('Character Initialized', {
        description: 'Archetype accepted. Neural engine is compiling visual references...',
      })
      
      setTimeout(() => {
        navigate(`/dashboard/series/${showId}`)
      }, 1500)

    } catch (error: any) {
      toast.error('Initialization Failed', {
        description: error.data?.message || 'System failure during character creation.',
      })
    }
  }

  if (isShowLoading) return <LoadingScreen message="Accessing Show Parameters..." accentColor="purple" />;
  if (!show) return <ErrorScreen title="Series Connection Lost" message="Unable to retrieve show details for character placement." />;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in-up pb-20">
      <div className="space-y-4">
          <Breadcrumbs
            items={[
              { label: 'Series Library', path: '/dashboard/series', icon: 'shelves' },
              { label: show.title, path: `/dashboard/series/${show.id}`, icon: 'movie' },
              { label: 'Character Setup', icon: 'person_add' }
            ]}
          />
          <h1 className="font-headline text-5xl font-bold tracking-tight text-white flex items-center gap-3">
            <span className="material-symbols-outlined text-accent-purple text-5xl">person_add</span>
            Character <span className="text-accent-purple">Setup</span>
          </h1>
          <p className="text-white/60 font-body text-lg">Define the biological and psychological parameters for a new entity.</p>
      </div>

      <div className="glass-panel p-8 lg:p-12 rounded-[3rem] border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-purple/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 relative z-10">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Name */}
            <div className="space-y-3">
                <label className="block font-label text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Full Name / Designation</label>
                <div className="relative">
                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-white/40 text-xl">person</span>
                <input 
                    {...register('name')}
                    className={`w-full bg-white/5 border border-white/10 rounded-xl py-5 pl-14 pr-5 text-white placeholder:text-white/20 focus:ring-2 focus:ring-accent-purple/50 focus:border-transparent transition-all font-body text-base ${errors.name ? 'ring-2 ring-error/50' : ''}`} 
                    placeholder="E.g. Captain Silas Vance" 
                    type="text" 
                    disabled={isCreating}
                />
                </div>
                {errors.name && <p className="text-error text-[10px] uppercase ml-1 tracking-wider mt-2">{errors.name.message}</p>}
            </div>

            {/* Role */}
            <div className="space-y-3">
                <label className="block font-label text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Narrative Role</label>
                <div className="relative">
                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-white/40 text-xl">psychology</span>
                <input 
                    {...register('role')}
                    className={`w-full bg-white/5 border border-white/10 rounded-xl py-5 pl-14 pr-5 text-white placeholder:text-white/20 focus:ring-2 focus:ring-accent-purple/50 focus:border-transparent transition-all font-body text-base ${errors.role ? 'ring-2 ring-error/50' : ''}`} 
                    placeholder="E.g. Protagonist / Antagonist" 
                    type="text" 
                    disabled={isCreating}
                />
                </div>
                {errors.role && <p className="text-error text-[10px] uppercase ml-1 tracking-wider mt-2">{errors.role.message}</p>}
            </div>
          </div>

          {/* Physical Description */}
          <div className="space-y-3">
            <label className="block font-label text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Physical Characteristics</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-5 top-5 text-white/40 text-xl">accessibility_new</span>
              <textarea 
                {...register('physicalDescription')}
                className={`w-full bg-white/5 border border-white/10 rounded-xl py-5 pl-14 pr-5 text-white placeholder:text-white/20 focus:ring-2 focus:ring-accent-purple/50 focus:border-transparent transition-all font-body text-base min-h-[120px] resize-none ${errors.physicalDescription ? 'ring-2 ring-error/50' : ''}`} 
                placeholder="Height, build, eye color, facial features..." 
                disabled={isCreating}
              />
            </div>
            {errors.physicalDescription && <p className="text-error text-[10px] uppercase ml-1 tracking-wider mt-2">{errors.physicalDescription.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Clothing Style */}
            <div className="space-y-3">
                <label className="block font-label text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Clothing & Aesthetics</label>
                <div className="relative">
                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-white/40 text-xl">apparel</span>
                <input 
                    {...register('clothingStyle')}
                    className={`w-full bg-white/5 border border-white/10 rounded-xl py-5 pl-14 pr-5 text-white placeholder:text-white/20 focus:ring-2 focus:ring-accent-purple/50 focus:border-transparent transition-all font-body text-base ${errors.clothingStyle ? 'ring-2 ring-error/50' : ''}`} 
                    placeholder="E.g. Tactical futuristic armor" 
                    type="text" 
                    disabled={isCreating}
                />
                </div>
                {errors.clothingStyle && <p className="text-error text-[10px] uppercase ml-1 tracking-wider mt-2">{errors.clothingStyle.message}</p>}
            </div>

            {/* Insight Level */}
            <div className="space-y-3">
                <label className="block font-label text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">AI Insight Level (1-10)</label>
                <div className="relative">
                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-white/40 text-xl">hub</span>
                <input 
                    {...register('insightLevel', { valueAsNumber: true })}
                    className={`w-full bg-white/5 border border-white/10 rounded-xl py-5 pl-14 pr-5 text-white placeholder:text-white/20 focus:ring-2 focus:ring-accent-purple/50 focus:border-transparent transition-all font-body text-base ${errors.insightLevel ? 'ring-2 ring-error/50' : ''}`} 
                    type="number" 
                    min="1"
                    max="10"
                    disabled={isCreating}
                />
                </div>
                {errors.insightLevel && <p className="text-error text-[10px] uppercase ml-1 tracking-wider mt-2">{errors.insightLevel.message}</p>}
            </div>
          </div>

          {/* Personality Traits */}
          <div className="space-y-3">
            <label className="block font-label text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Psychological Traits</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-5 top-5 text-white/40 text-xl">self_improvement</span>
              <textarea 
                {...register('personalityTraits')}
                className={`w-full bg-white/5 border border-white/10 rounded-xl py-5 pl-14 pr-5 text-white placeholder:text-white/20 focus:ring-2 focus:ring-accent-purple/50 focus:border-transparent transition-all font-body text-base min-h-[120px] resize-none ${errors.personalityTraits ? 'ring-2 ring-error/50' : ''}`} 
                placeholder="Stoic, impulsive, brilliant but haunted..." 
                disabled={isCreating}
              />
            </div>
            {errors.personalityTraits && <p className="text-error text-[10px] uppercase ml-1 tracking-wider mt-2">{errors.personalityTraits.message}</p>}
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
              className="px-10 py-4 bg-gradient-to-r from-accent-purple to-purple-600 rounded-xl font-bold tracking-widest uppercase text-[10px] text-white shadow-lg shadow-accent-purple/25 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-3 hover:shadow-accent-purple/40 transition-all border border-white/10"
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
                  Initialize Character
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}
