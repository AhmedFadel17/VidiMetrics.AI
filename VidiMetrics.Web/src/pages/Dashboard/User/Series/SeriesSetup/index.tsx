import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { useCreateSeriesMutation } from '@/store/apis/mainApi'

const AUDIENCE_OPTIONS = [
  'Gen Z (Teens & Young Adults)',
  'Millennials (25-40)',
  'Generation Alpha (Kids)',
  'Professional / Corporate',
  'Global Tech/Sci-Fi Enthusiasts',
  'Luxury & Lifestyle High-End',
  'Other (Custom Input)'
]

const STYLE_OPTIONS = [
  'Cinematic Photorealistic',
  'Cyberpunk Noir / Neon Drift',
  'Minimalist Abstract / Zen',
  'Retro 80s Synthwave',
  'Ultra-Modern High-Fidelity 3D',
  'Hand-Drawn Artistic Illustration',
  'Gritty Industrial / Brutalist',
  'Dreamy Surrealist / Ethereal',
  'Other (Custom Engine)'
]

const seriesSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  visualStyle: z.string().min(2, 'Visual style must be defined'),
  visualStyleCustom: z.string().optional(),
  targetAudience: z.string().min(5, 'Target audience must be specified'),
  targetAudienceCustom: z.string().optional(),
}).refine((data) => {
  if (data.visualStyle === 'Other (Custom Engine)' && (!data.visualStyleCustom || data.visualStyleCustom.length < 2)) {
    return false;
  }
  if (data.targetAudience === 'Other (Custom Input)' && (!data.targetAudienceCustom || data.targetAudienceCustom.length < 2)) {
    return false;
  }
  return true;
}, {
  message: "Custom values must be at least 2 characters",
  path: ["visualStyleCustom"], // This is a bit tricky for nested refinement, but simplifies for now
})

type SeriesFormValues = z.infer<typeof seriesSchema>

export default function SeriesSetup() {
  const navigate = useNavigate()
  const [createSeries, { isLoading }] = useCreateSeriesMutation()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SeriesFormValues>({
    resolver: zodResolver(seriesSchema),
  })

  const selectedStyle = watch('visualStyle')
  const selectedAudience = watch('targetAudience')

  const onSubmit = async (values: SeriesFormValues) => {
    try {
      const data = {
        ...values,
        visualStyle: values.visualStyle === 'Other (Custom Engine)' ? values.visualStyleCustom : values.visualStyle,
        targetAudience: values.targetAudience === 'Other (Custom Input)' ? values.targetAudienceCustom : values.targetAudience,
      }
      
      await createSeries(data as any).unwrap()
      toast.success('Series Initialized', {
        description: 'Parameters accepted. Creating new cinematic universe...',
      })
      
      setTimeout(() => {
        navigate('/dashboard/series')
      }, 1500)

    } catch (error: any) {
      let errorMessage = 'System failure during series creation. Please check your inputs and try again.';
      
      if (error.response && error.response.data) {
        // Handle structured API errors if available
        const apiError = error.response.data;
        errorMessage = apiError.message || (typeof apiError.description === 'string' ? apiError.description : errorMessage);
      } else if (error.message) {
        // Handle general Axios/network errors
        errorMessage = error.message;
      }

      toast.error('Initialization Failed', {
        description: errorMessage,
      })
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in-up pb-20">
      <div className="space-y-4">
        <span className="text-accent-purple font-label text-xs tracking-[0.3em] uppercase">New Project</span>
        <h1 className="font-headline text-5xl font-bold tracking-tight text-white flex items-center gap-3">
          <span className="material-symbols-outlined text-gradient-purple text-5xl">movie</span>
          Series Parameter <span className="text-gradient-purple">Setup</span>
        </h1>
        <p className="text-white/60 font-body text-lg">Define the core attributes and visual engine parameters for your new production.</p>
      </div>

      <div className="glass-panel p-8 lg:p-12 rounded-2xl border border-white/10 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-purple/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 relative z-10">
          
          {/* Title */}
          <div className="space-y-3">
            <label className="block font-label text-xs uppercase tracking-widest text-white/60 ml-1">Series Title</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-white/40 text-xl">title</span>
              <input 
                {...register('title')}
                className={`w-full bg-white/5 border border-white/10 rounded-xl py-5 pl-14 pr-5 text-white placeholder:text-white/20 focus:ring-2 focus:ring-accent-purple/50 focus:border-transparent transition-all font-body text-base ${errors.title ? 'ring-2 ring-error/50' : ''}`} 
                placeholder="E.g. The Quantum Paradox" 
                type="text" 
                disabled={isLoading}
              />
            </div>
            {errors.title && <p className="text-error text-xs uppercase ml-1 tracking-wider mt-2">{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div className="space-y-3">
            <label className="block font-label text-xs uppercase tracking-widest text-white/60 ml-1">Narrative Logline (Description)</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-5 top-5 text-white/40 text-xl">description</span>
              <textarea 
                {...register('description')}
                className={`w-full bg-white/5 border border-white/10 rounded-xl py-5 pl-14 pr-5 text-white placeholder:text-white/20 focus:ring-2 focus:ring-accent-purple/50 focus:border-transparent transition-all font-body text-base min-h-[140px] resize-none ${errors.description ? 'ring-2 ring-error/50' : ''}`} 
                placeholder="A brief summary of the overarching plot and themes..." 
                disabled={isLoading}
              />
            </div>
            {errors.description && <p className="text-error text-xs uppercase ml-1 tracking-wider mt-2">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Visual Style */}
            <div className="space-y-3">
              <label className="block font-label text-xs uppercase tracking-widest text-white/60 ml-1">Visual Style Engine</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-white/40 text-xl pointer-events-none">palette</span>
                <select 
                  {...register('visualStyle')}
                  className={`w-full bg-[#1A1A1A] border border-white/10 rounded-xl py-5 pl-14 pr-10 text-white focus:ring-2 focus:ring-accent-purple/50 focus:border-transparent transition-all font-body text-base appearance-none cursor-pointer ${errors.visualStyle ? 'ring-2 ring-error/50' : ''}`}
                  disabled={isLoading}
                  defaultValue=""
                >
                  <option value="" disabled className="bg-neutral-900">Select Visual Style...</option>
                  {STYLE_OPTIONS.map(option => (
                    <option key={option} value={option} className="bg-neutral-900 text-white py-2">{option}</option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-white/40 text-xl pointer-events-none">expand_more</span>
              </div>
              {errors.visualStyle && <p className="text-error text-xs uppercase ml-1 tracking-wider mt-2">{errors.visualStyle.message}</p>}
              
              {selectedStyle === 'Other (Custom Engine)' && (
                <div className="relative mt-3 animate-slide-in-bottom">
                  <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-accent-purple/60 text-xl">auto_fix_high</span>
                  <input 
                    {...register('visualStyleCustom')}
                    className={`w-full bg-white/5 border border-accent-purple/30 rounded-xl py-4 pl-14 pr-5 text-white placeholder:text-white/20 focus:ring-2 focus:ring-accent-purple/50 focus:border-transparent transition-all font-body text-sm`} 
                    placeholder="Enter custom visual style..." 
                    type="text" 
                    autoFocus
                  />
                </div>
              )}
            </div>

            {/* Target Audience */}
            <div className="space-y-3">
              <label className="block font-label text-xs uppercase tracking-widest text-white/60 ml-1">Target Audience</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-white/40 text-xl pointer-events-none">groups</span>
                <select 
                  {...register('targetAudience')}
                  className={`w-full bg-[#1A1A1A] border border-white/10 rounded-xl py-5 pl-14 pr-10 text-white focus:ring-2 focus:ring-accent-purple/50 focus:border-transparent transition-all font-body text-base appearance-none cursor-pointer ${errors.targetAudience ? 'ring-2 ring-error/50' : ''}`}
                  disabled={isLoading}
                  defaultValue=""
                >
                  <option value="" disabled className="bg-neutral-900">Select Target Audience...</option>
                  {AUDIENCE_OPTIONS.map(option => (
                    <option key={option} value={option} className="bg-neutral-900 text-white py-2">{option}</option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-white/40 text-xl pointer-events-none">expand_more</span>
              </div>
              {errors.targetAudience && <p className="text-error text-xs uppercase ml-1 tracking-wider mt-2">{errors.targetAudience.message}</p>}

              {selectedAudience === 'Other (Custom Input)' && (
                <div className="relative mt-3 animate-slide-in-bottom">
                  <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-accent-purple/60 text-xl">edit_note</span>
                  <input 
                    {...register('targetAudienceCustom')}
                    className={`w-full bg-white/5 border border-accent-purple/30 rounded-xl py-4 pl-14 pr-5 text-white placeholder:text-white/20 focus:ring-2 focus:ring-accent-purple/50 focus:border-transparent transition-all font-body text-sm`} 
                    placeholder="E.g. Urban Explorers, 24-29" 
                    type="text" 
                    autoFocus
                  />
                </div>
              )}
            </div>
          </div>

          <div className="pt-6 flex justify-end gap-6 items-center">
            <button 
              type="button"
              onClick={() => navigate('/dashboard/series')}
              className="px-8 py-4 rounded-xl font-bold tracking-widest uppercase text-xs text-white/60 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
              disabled={isLoading}
            >
              Abort Setup
            </button>
            <button 
              type="submit"
              className="px-10 py-4 bg-gradient-to-r from-accent-purple to-purple-600 rounded-xl font-bold tracking-widest uppercase text-xs text-white shadow-lg shadow-accent-purple/25 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-3 hover:shadow-accent-purple/40 transition-all border border-white/10"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-base">autorenew</span>
                  Compiling...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">rocket_launch</span>
                  Initialize Series
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}
