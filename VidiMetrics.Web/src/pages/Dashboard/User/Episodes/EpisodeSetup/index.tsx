import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { useCreateEpisodeMutation } from '@/store/apis/storyEngine/episodes.api'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import { useGetShowByIdQuery } from '@/store/apis'
import { LoadingScreen, ErrorScreen } from '@/components/ui/Feedback/StatusScreens'

// ─── Schema ───────────────────────────────────────────────────────────────────
const episodeSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  plotSummary: z.string().min(10, 'Plot summary must be at least 10 characters'),
})

type EpisodeFormValues = z.infer<typeof episodeSchema>

// ─── Component ────────────────────────────────────────────────────────────────
export default function EpisodeSetup() {
  const { showId } = useParams<{ showId: string }>()
  const navigate = useNavigate()

  const { data: showResponse, isLoading: isShowLoading } = useGetShowByIdQuery(showId ?? '')
  const [createEpisode, { isLoading: isCreating }] = useCreateEpisodeMutation()

  const show = showResponse?.data

  // The next episode number is always totalEpisodes + 1 (readonly)
  const nextEpisodeNumber = (show?.totalEpisodes ?? 0) + 1

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EpisodeFormValues>({
    resolver: zodResolver(episodeSchema),
    defaultValues: { title: '', plotSummary: '' },
    mode: 'onChange',
  })

  // ─── Submit ──────────────────────────────────────────────────────────────────
  const onSubmit = async (values: EpisodeFormValues) => {
    if (!showId) {
      toast.error('Missing Series Context', {
        description: 'Please launch setup from a specific series detail page.',
      })
      return
    }

    try {
      await createEpisode({
        episodeNumber: nextEpisodeNumber,
        title: values.title,
        plotSummary: values.plotSummary,
        showId,
      }).unwrap()

      toast.success('Episode Initialized', {
        description: `Episode ${nextEpisodeNumber} — "${values.title}" has been added to the series.`,
      })

      setTimeout(() => navigate(`/dashboard/series/${showId}`), 1400)
    } catch (error: any) {
      toast.error('Initialization Failed', {
        description: error.data?.message ?? 'System failure during episode creation.',
      })
    }
  }
  const inputClass = (hasError: boolean) =>
    `w-full bg-white/5 border rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/20
     focus:ring-2 focus:ring-accent-cyan/40 focus:border-accent-cyan/40 focus:outline-none
     transition-all font-body ${hasError ? 'border-red-500/60 ring-2 ring-red-500/20' : 'border-white/10'}`

  const textareaClass = (hasError: boolean) =>
    `w-full bg-white/5 border rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/20
     focus:ring-2 focus:ring-accent-cyan/40 focus:border-accent-cyan/40 focus:outline-none
     transition-all font-body resize-none min-h-[100px]
     ${hasError ? 'border-red-500/60 ring-2 ring-red-500/20' : 'border-white/10'}`


  // ─── Guards ──────────────────────────────────────────────────────────────────
  if (isShowLoading) return <LoadingScreen message="Accessing Series Parameters..." accentColor="cyan" />
  if (!show) return <ErrorScreen title="Series Connection Lost" message="Unable to retrieve series data for episode placement." />

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <main className="w-full min-h-screen pb-20 animate-fade-in">
      <style>{`
        .wizard-glass {
          background: rgba(23, 31, 51, 0.6);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255,0.06);
        }
      `}</style>

      {/* ── Breadcrumbs + Header ── */}
      <div className="space-y-3 mb-10">
        <Breadcrumbs items={[
          { label: 'Home', path: '/' },
          { label: 'Series Library', path: '/dashboard/series' },
          { label: show.title, path: `/dashboard/series/${show.id}` },
          { label: 'New Episode' },
        ]} />

        <div className="flex items-end justify-between">
          <div>
            <h1 className="font-display text-4xl font-black tracking-tight text-white">
              Episode <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-secondary">Setup</span>
            </h1>
            <p className="text-white/40 font-body text-sm mt-1">
              Define the narrative parameters for this new episode.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate(`/dashboard/series/${showId}`)}
            className="text-white/30 hover:text-white/70 text-[10px] uppercase tracking-widest font-label flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-base">close</span>
            Cancel
          </button>
        </div>
      </div>

      {/* ── Form Panel ── */}
      <div className="wizard-glass rounded-2xl overflow-hidden">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-8 space-y-8">

            {/* ── Section heading ── */}
            <div>
              <h2 className="font-display text-3xl font-bold text-white mb-1">Episode Parameters</h2>
              <p className="text-white/50 text-sm font-body">
                Set the title and plot for this narrative segment.
              </p>
            </div>

            {/* ── Episode Number (readonly) + Title ── */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

              {/* Episode Number — readonly, auto-computed */}
              <div className="col-span-1 space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-[0.25em] text-white/40">
                  Episode No.
                </label>
                <div className="relative group">
                  {/* Glow ring to signal read-only */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full bg-accent-cyan/5 border border-accent-cyan/20 rounded-xl py-3 px-4
                      text-accent-cyan font-mono font-black text-2xl text-center
                      shadow-[inset_0_0_20px_rgba(34,211,238,0.05)]
                      flex items-center justify-center gap-2 select-none"
                  >
                    <span className="material-symbols-outlined text-accent-cyan/50 text-base">lock</span>
                    {String(nextEpisodeNumber).padStart(2, '0')}
                  </motion.div>
                </div>
                <p className="text-[9px] uppercase tracking-widest text-white/25 font-label text-center">
                  Auto-assigned
                </p>
              </div>

              {/* Title */}
              <div className="col-span-3 space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-[0.25em] text-white/40">
                  Episode Title
                </label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-accent-cyan transition-colors text-xl">
                    title
                  </span>
                  <input
                    {...register('title')}
                    type="text"
                    placeholder="e.g. The Awakening"
                    disabled={isCreating}
                    className={inputClass(!!errors.title)}
                  />
                </div>
                {errors.title && (
                  <p className="text-red-400 text-[10px] uppercase tracking-wider ml-1">{errors.title.message}</p>
                )}
              </div>
            </div>

            {/* ── Plot Summary ── */}
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.25em] text-white/40">
                Narrative Summary
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-4 text-white/30 group-focus-within:text-accent-cyan transition-colors text-xl">
                  auto_stories
                </span>
                <textarea
                  {...register('plotSummary')}
                  placeholder="Describe the main events and character arcs for this episode..."
                  disabled={isCreating}
                  rows={6}
                  className={textareaClass(!!errors.plotSummary)}
                />
              </div>
              {errors.plotSummary && (
                <p className="text-red-400 text-[10px] uppercase tracking-wider ml-1">{errors.plotSummary.message}</p>
              )}
            </div>

            {/* ── Series context badge ── */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <span className="material-symbols-outlined text-secondary text-xl">movie</span>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/30 font-label">Series</p>
                <p className="text-white text-sm font-medium">{show.title}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-[10px] uppercase tracking-widest text-white/30 font-label">Total Episodes</p>
                <p className="text-accent-cyan font-mono font-bold text-sm">{show.totalEpisodes}</p>
              </div>
            </div>

          </div>

          {/* ── Navigation Footer ── */}
          <div className="border-t border-white/[0.06] px-8 py-5 flex justify-between items-center bg-white/[0.02]">
            <button
              type="button"
              onClick={() => navigate(`/dashboard/series/${showId}`)}
              disabled={isCreating}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-label text-sm uppercase tracking-widest
                text-white/40 hover:text-white/80 hover:bg-white/5 border border-transparent
                hover:border-white/10 transition-all disabled:opacity-40 disabled:pointer-events-none"
            >
              <span className="material-symbols-outlined text-base">arrow_back</span>
              Back
            </button>

            {/* Dot indicator (single step) */}
            <div className="flex gap-1.5">
              <div className="w-6 h-2 bg-accent-cyan rounded-full" />
            </div>

            <button
              type="submit"
              disabled={isCreating}
              className="flex items-center gap-2 px-8 py-3 rounded-xl font-headline font-bold text-sm
                bg-gradient-to-r from-accent-cyan/80 to-secondary text-white
                shadow-[0_0_30px_rgba(34,211,238,0.2)] hover:brightness-110
                active:scale-95 transition-all disabled:opacity-60 disabled:pointer-events-none"
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
                  Launch Episode
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
