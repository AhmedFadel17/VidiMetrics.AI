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
import { InputField } from '@/components/ui/Inputs/InputField'
import { TextAreaField } from '@/components/ui/Inputs/TextareaField'
import { Button } from '@/components/ui/Button'

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

  // ─── Guards ──────────────────────────────────────────────────────────────────
  if (isShowLoading) return <LoadingScreen message="Accessing Series Parameters..." accentColor="cyan" />
  if (!show) return <ErrorScreen title="Series Connection Lost" message="Unable to retrieve series data for episode placement." />

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <main className="w-full min-h-screen pb-20 animate-fade-in">

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
      <div className="bg-surface-container-low/60 backdrop-blur-[24px] border-[1px] border-white/10 rounded-2xl overflow-hidden">
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
                <InputField
                  {...register('title')}
                  label="Episode Title"
                  icon="title"
                  placeholder='The Story of...'
                  error={errors.title?.message}
                  disabled={isCreating}
                />
              </div>
            </div>

            {/* ── Plot Summary ── */}
            <div className="space-y-2">
              <TextAreaField
                {...register('plotSummary')}
                label="Narrative Summary"
                icon="auto_stories"
                placeholder='Describe the main events and character arcs for this episode...'
                error={errors.plotSummary?.message}
                disabled={isCreating}
                rows={6}
              />

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
            <Button
              variant="launch"
              size="lg"
              type="submit"
              disabled={isCreating}
              isLoading={isCreating}
              loadingText="Initializing..."
              icon={<span className="material-symbols-outlined text-base">rocket_launch</span>}
            >
              Launch Episode
            </Button>

          </div>
        </form>
      </div>
    </main>
  )
}
