import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { useCreateLocationMutation, useGetShowByIdQuery } from '@/store/apis'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import { LoadingScreen, ErrorScreen } from '@/components/ui/Feedback/StatusScreens'
import { LocationFormValues } from '@/types'
import { useCreateLocationImageMutation } from '@/store/apis/ai/aiImages.api'


// ─── Schema ───────────────────────────────────────────────────────────────────
const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  visualDescription: z.string().min(10, 'Description must be detailed'),
  atmosphere: z.string().min(5, 'Atmosphere must be specified'),
  aiImageId: z.string().optional(),
  referenceImageUrl: z.string().url().optional(),
})


// ─── Component ────────────────────────────────────────────────────────────────
export default function LocationSetup() {
  const { showId } = useParams<{ showId: string }>()
  const navigate = useNavigate()
  const { data: showResponse, isLoading: isShowLoading } = useGetShowByIdQuery(showId ?? '')
  const [createLocation, { isLoading: isCreating }] = useCreateLocationMutation()
  const [createLocationImage, { isLoading: isGenerating }] = useCreateLocationImageMutation()


  const show = showResponse?.data

  const form = useForm<LocationFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      visualDescription: '',
      atmosphere: '',
      aiImageId: null as any,
      referenceImageUrl: null as any,
    },
    mode: 'onChange',
  })

  const { register, handleSubmit, setValue, watch, formState: { errors } } = form

  const locationName = watch('name')
  const visualDescription = watch('visualDescription')
  const atmosphere = watch('atmosphere')
  const referenceImageUrl = watch('referenceImageUrl')
  const previewVisible = !!referenceImageUrl
  const canGenerate = visualDescription?.length >= 10 && atmosphere?.length >= 5
  // ─── Submit ──────────────────────────────────────────────────────────────────
  const onSubmit = async (values: LocationFormValues) => {
    if (!showId) return
    try {
      await createLocation({
        ...values,
        showId,
      }).unwrap()

      toast.success('Location Initialized', {
        description: 'Archetype accepted. Neural engine is compiling visual references...',
      })
      setTimeout(() => navigate(`/dashboard/series/${showId}?tab=Locations`), 1500)
    } catch (error: any) {
      toast.error('Initialization Failed', {
        description: error.data?.message ?? 'System failure during location creation.',
      })
    }
  }


  const handleGenerate = async () => {
    try {
      const result = await createLocationImage({
        name: locationName,
        visualDescription: visualDescription,
        atmosphere: atmosphere,
      }).unwrap()

      if (result.data?.imageUrl && result.data?.id) {
        setValue('referenceImageUrl', result.data.imageUrl)
        setValue('aiImageId', result.data.id)
        toast.success('Visual Reference Compiled', {
          description: 'Neural core has successfully synthesized the location appearance.'
        })
      }
    } catch (error: any) {
      toast.error('Synthesis Failed', {
        description: error.data?.message ?? 'Failed to generate location visual reference.'
      })
    }
  }

  // ─── Guards ──────────────────────────────────────────────────────────────────
  if (isShowLoading) return <LoadingScreen message="Accessing Show Parameters..." accentColor="purple" />
  if (!show) return <ErrorScreen title="Series Connection Lost" message="Unable to retrieve show details for location placement." />


  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <main className="w-full min-h-screen pb-20 animate-fade-in">
      <style>{`
        .wizard-glass {
          background: rgba(23, 31, 51, 0.6);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255,0.06);
        }
        .step-connector { flex: 1; height: 1px; background: rgba(255,255,255,0.08); }
        .step-connector.done { background: linear-gradient(to right,#ddb7ff,#4cd7f6); }
      `}</style>

      {/* ── Breadcrumbs + header ── */}
      <div className="space-y-3 mb-10">
        <Breadcrumbs items={[
          { label: 'Home', path: '/' },
          { label: 'Series Library', path: '/dashboard/series' },
          { label: show.title, path: `/dashboard/series/${show.id}` },
          { label: 'Locations', path: `/dashboard/series/${show.id}?tab=Locations` },
          { label: 'New Location' },
        ]} />
        <div className="flex items-end justify-between">
          <div>
            <h1 className="font-display text-4xl font-black tracking-tight text-white">
              Location <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Creator</span>
            </h1>
          </div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-white/30 hover:text-white/70 text-[10px] uppercase tracking-widest font-label flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-base">close</span>
            Abort
          </button>
        </div>
      </div>


      {/* ── Step Panel ── */}
      <div className="wizard-glass rounded-2xl overflow-hidden">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-8 min-h-[480px] overflow-hidden relative">
            <div className="space-y-8">
              <div>
                <h2 className="font-display text-3xl font-bold text-white mb-1">Location Identity</h2>
                <p className="text-white/50 text-sm font-body">Define how the viewers perceives your location.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                {/* Left: Textareas */}
                <div className="space-y-6 flex flex-col h-full">

                  {/* Location Name */}
                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-[0.25em] text-white/40">
                      Location Name
                    </label>
                    <div className="relative group">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-accent-cyan transition-colors text-xl">
                        forest
                      </span>
                      <input
                        {...register('name')}
                        type="text"
                        placeholder="e.g. The Forbidden Forest"
                        className={`w-full bg-white/5 border rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:ring-2 focus:ring-accent-cyan/40 focus:border-accent-cyan/40 focus:outline-none transition-all font-body ${errors.name ? 'border-red-500/60 ring-2 ring-red-500/20' : 'border-white/10'
                          }`}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-red-400 text-[10px] uppercase tracking-wider ml-1">{errors.name.message}</p>
                    )}
                  </div>
                  {/* Physical Description */}
                  <div className="space-y-2 flex-1 flex flex-col">
                    <label className="block text-[10px] font-black uppercase tracking-[0.25em] text-white/40">
                      Visual Description
                    </label>
                    <div className="relative group flex-1">
                      <span className="material-symbols-outlined absolute left-4 top-4 text-white/30 group-focus-within:text-primary transition-colors text-xl">
                        architecture
                      </span>
                      <textarea
                        {...register('visualDescription')}
                        className={`w-full h-full min-h-[160px] bg-white/5 border rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:ring-2 focus:ring-primary/40 focus:border-primary/40 focus:outline-none transition-all font-body resize-none ${errors.visualDescription ? 'border-red-500/60' : 'border-white/10'
                          }`}
                        placeholder="Describe the geography, structures, colors, and unique features..."
                      />
                    </div>
                    {errors.visualDescription && (
                      <p className="text-red-400 text-[10px] uppercase tracking-wider ml-1">{errors.visualDescription.message}</p>
                    )}
                  </div>

                  {/* Atmosphere */}
                  <div className="space-y-2 flex-1 flex flex-col">
                    <label className="block text-[10px] font-black uppercase tracking-[0.25em] text-white/40">
                      Atmosphere
                    </label>
                    <div className="relative group flex-1">
                      <span className="material-symbols-outlined absolute left-4 top-4 text-white/30 group-focus-within:text-secondary transition-colors text-xl">
                        mood
                      </span>
                      <textarea
                        {...register('atmosphere')}
                        className={`w-full h-full min-h-[160px] bg-white/5 border rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:ring-2 focus:ring-secondary/40 focus:border-secondary/40 focus:outline-none transition-all font-body resize-none ${errors.atmosphere ? 'border-red-500/60' : 'border-white/10'
                          }`}
                        placeholder="Describe the lighting, weather, mood, and sensory details..."
                      />
                    </div>
                    {errors.atmosphere && (
                      <p className="text-red-400 text-[10px] uppercase tracking-wider ml-1">{errors.atmosphere.message}</p>
                    )}
                  </div>


                  {/* Generate Button */}
                  <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={!canGenerate || isGenerating}
                    className={`w-full py-4 rounded-xl font-headline font-bold text-base flex items-center justify-center gap-3 transition-all border ${canGenerate && !isGenerating
                      ? 'bg-gradient-to-r from-primary/20 to-secondary/20 border-primary/40 text-primary hover:brightness-110 active:scale-95 shadow-[0_0_30px_rgba(221,183,255,0.15)]'
                      : 'bg-white/5 border-white/10 text-white/30 cursor-not-allowed'
                      }`}
                  >
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                      auto_fix_high
                    </span>
                    {isGenerating ? 'Neural Core Processing...' : '✨ Generate Location Preview'}
                  </button>
                </div>

                {/* Right: Image Preview */}
                <div className="flex flex-col h-full min-h-[400px]">
                  <div className={`flex-1 rounded-xl border overflow-hidden relative transition-all duration-500 ${previewVisible || isGenerating ? 'border-primary/20' : 'border-white/10 border-dashed'
                    }`}>
                    {/* Empty state */}
                    {!previewVisible && !isGenerating && (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-8 bg-white/[0.02]">
                        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                          <span className="material-symbols-outlined text-white/20 text-3xl">image_search</span>
                        </div>
                        <p className="text-white/25 text-xs font-label uppercase tracking-widest text-center">
                          Fill descriptions above then<br />generate your location preview
                        </p>
                      </div>
                    )}

                    {/* Loading shimmer */}
                    {isGenerating && (
                      <div className="w-full h-full bg-surface-container-high animate-pulse">
                        <div className="w-full h-full bg-gradient-to-br from-primary/10 via-secondary/5 to-transparent flex items-center justify-center">
                          <div className="space-y-2 text-center">
                            <div className="w-10 h-10 border-2 border-primary/40 border-t-primary rounded-full animate-spin mx-auto" />
                            <p className="text-primary/60 text-xs font-label uppercase tracking-widest">Synthesizing...</p>
                          </div>
                        </div>
                        {/* Shimmer bars */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
                          <div className="h-3 bg-white/10 rounded animate-pulse w-3/4" />
                          <div className="h-3 bg-white/10 rounded animate-pulse w-1/2" />
                        </div>
                      </div>
                    )}

                    {/* Generated image */}
                    {previewVisible && !isGenerating && (
                      <div className="relative w-full h-full group cursor-pointer" onClick={() => { setValue('referenceImageUrl', ''); setValue('aiImageId', ''); }}>
                        <img
                          src={referenceImageUrl}
                          alt="Generated location preview"
                          className="w-full h-full object-cover brightness-80 group-hover:brightness-90 transition-all duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <span className="text-[10px] uppercase tracking-widest text-white/50 font-label">
                            AI Generated · Click to regenerate
                          </span>
                        </div>
                        <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                          <span className="text-green-400 text-[10px] uppercase tracking-widest font-label">Synced</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Navigation Footer ── */}
          <div className="border-t border-white/[0.06] px-8 py-5 flex justify-between items-center bg-white/[0.02]">
            <button
              key="btn-submit"
              type="submit"
              disabled={isCreating || !watch('aiImageId')}
              className="flex items-center gap-2 px-8 py-3 rounded-xl font-headline font-bold text-sm bg-gradient-to-r from-primary to-secondary text-[#0b1326] shadow-[0_0_30px_rgba(76,215,246,0.25)] hover:brightness-110 active:scale-95 transition-all disabled:opacity-40 disabled:grayscale disabled:cursor-not-allowed"
            >

              {isCreating ? (
                <>
                  <span className="material-symbols-outlined text-base animate-spin">autorenew</span>
                  Initializing...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                    rocket_launch
                  </span>
                  Launch Location
                </>
              )}
            </button>

          </div>
        </form>
      </div>
    </main>
  )
}
