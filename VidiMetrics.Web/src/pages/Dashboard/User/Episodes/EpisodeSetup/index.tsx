import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { useCreateEpisodeMutation } from '@/store/apis/storyEngine/episodes.api'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import { useGetShowByIdQuery } from '@/store/apis'

const episodeSchema = z.object({
  episodeNumber: z.number().min(1, 'Episode number must be at least 1'),
  title: z.string().min(2, 'Title must be at least 2 characters'),
  plotSummary: z.string().min(10, 'Plot summary must be at least 10 characters'),
})

type EpisodeFormValues = z.infer<typeof episodeSchema>

export default function EpisodeSetup() {
  const { showId, id } = useParams<{ showId: string, id: string }>();
  const { data: showResponse, isLoading: isShowLoading } = useGetShowByIdQuery(showId || '');

  const show = showResponse?.data;

  const navigate = useNavigate()
  const [createEpisode, { isLoading }] = useCreateEpisodeMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EpisodeFormValues>({
    resolver: zodResolver(episodeSchema),
    defaultValues: {
      episodeNumber: 1,
    }
  })

  const onSubmit = async (values: EpisodeFormValues) => {
    if (!showId) {
      toast.error('Missing Series Context', {
        description: 'Please launch setup from a specific series detail page.',
      })
      return
    }

    try {
      await createEpisode({
        ...values,
        showId: showId,
        videoId: "", // Initialized as empty
      }).unwrap()

      toast.success('Episode Initialized', {
        description: 'Parameters accepted. Neural engine is now generating the narrative...',
      })

      setTimeout(() => {
        navigate(`/dashboard/series/${showId}`)
      }, 1500)

    } catch (error: any) {
      toast.error('Initialization Failed', {
        description: error.data?.message || 'System failure during episode creation.',
      })
    }
  }

  if (isShowLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="w-16 h-16 border-4 border-accent-cyan/30 border-t-accent-cyan rounded-full animate-spin"></div>
        <p className="text-white/40 font-label text-xs uppercase tracking-widest animate-pulse">Accessing Neural Archives...</p>
      </div>
    );
  }

  if (!show) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 glass-card rounded-[3rem] border border-error/20 p-12">
        <span className="material-symbols-outlined text-6xl text-error">warning</span>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-headline font-bold text-white tracking-tight">Signal Interrupted</h2>
          <p className="text-white/40">Unable to establish connection with episode parameters. Please verify the uplink.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in-up pb-20">
      <div className="flex justify-between items-end">
        <div className="space-y-4">
          <Breadcrumbs
            items={[
              { label: 'Series Library', path: '/dashboard/series', icon: 'shelves' },
              { label: show.title, path: `/dashboard/series/${show.id}`, icon: 'movie' },
              { label: 'Episode Setup', icon: 'movie_filter' }
            ]}
          />
          <h1 className="font-headline text-5xl font-bold tracking-tight text-white flex items-center gap-3">
            <span className="material-symbols-outlined text-accent-cyan text-5xl">movie_filter</span>
            Episode <span className="text-accent-cyan">Setup</span>
          </h1>
          <p className="text-white/60 font-body text-lg">Define the narrative parameters and sequence for this new episode.</p>
        </div>
      </div>

      <div className="glass-panel p-8 lg:p-12 rounded-[3rem] border border-white/10 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-cyan/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 relative z-10">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Episode Number */}
            <div className="space-y-3 col-span-1">
              <label className="block font-label text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Episode No.</label>
              <div className="relative">
                <input
                  {...register('episodeNumber', { valueAsNumber: true })}
                  className={`w-full bg-white/5 border border-white/10 rounded-xl py-5 px-6 text-white placeholder:text-white/20 focus:ring-2 focus:ring-accent-cyan/50 focus:border-transparent transition-all font-bold text-center ${errors.episodeNumber ? 'ring-2 ring-error/50' : ''}`}
                  type="number"
                  disabled={isLoading}
                />
              </div>
              {errors.episodeNumber && <p className="text-error text-[10px] uppercase ml-1 tracking-wider mt-2">{errors.episodeNumber.message}</p>}
            </div>

            {/* Title */}
            <div className="space-y-3 col-span-3">
              <label className="block font-label text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Episode Title</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-white/40 text-xl">title</span>
                <input
                  {...register('title')}
                  className={`w-full bg-white/5 border border-white/10 rounded-xl py-5 pl-14 pr-5 text-white placeholder:text-white/20 focus:ring-2 focus:ring-accent-cyan/50 focus:border-transparent transition-all font-body text-base ${errors.title ? 'ring-2 ring-error/50' : ''}`}
                  placeholder="E.g. The Awakening"
                  type="text"
                  disabled={isLoading}
                />
              </div>
              {errors.title && <p className="text-error text-[10px] uppercase ml-1 tracking-wider mt-2">{errors.title.message}</p>}
            </div>
          </div>

          {/* Plot Summary */}
          <div className="space-y-3">
            <label className="block font-label text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Narrative Summary (Plot)</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-5 top-5 text-white/40 text-xl">auto_stories</span>
              <textarea
                {...register('plotSummary')}
                className={`w-full bg-white/5 border border-white/10 rounded-xl py-5 pl-14 pr-5 text-white placeholder:text-white/20 focus:ring-2 focus:ring-accent-cyan/50 focus:border-transparent transition-all font-body text-base min-h-[180px] resize-none ${errors.plotSummary ? 'ring-2 ring-error/50' : ''}`}
                placeholder="Describe the main events and character arcs for this episode..."
                disabled={isLoading}
              />
            </div>
            {errors.plotSummary && <p className="text-error text-[10px] uppercase ml-1 tracking-wider mt-2">{errors.plotSummary.message}</p>}
          </div>

          <div className="pt-6 flex justify-end gap-6 items-center">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-8 py-4 rounded-xl font-bold tracking-widest uppercase text-[10px] text-white/60 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
              disabled={isLoading}
            >
              Abort Setup
            </button>
            <button
              type="submit"
              className="px-10 py-4 bg-gradient-to-r from-accent-cyan to-blue-600 rounded-xl font-bold tracking-widest uppercase text-[10px] text-on-surface shadow-lg shadow-accent-cyan/25 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-3 hover:shadow-accent-cyan/40 transition-all border border-white/10"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-base">autorenew</span>
                  Processing...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">rocket_launch</span>
                  Initialize Episode
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}
