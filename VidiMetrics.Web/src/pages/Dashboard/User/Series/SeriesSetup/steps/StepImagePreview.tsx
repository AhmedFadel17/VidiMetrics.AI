import { UseFormWatch } from 'react-hook-form'
import { SeriesFormValues } from '@/types'

interface StepImagePreviewProps {
  watch: UseFormWatch<SeriesFormValues>
  onBack: () => void
  onSubmit: () => void
  isSubmitting: boolean
}

export default function StepImagePreview({
  watch,
  onBack,
  onSubmit,
  isSubmitting,
}: StepImagePreviewProps) {
  const imageUrl = watch('referenceImageUrl')
  const title = watch('title')
  const visualStyle = watch('visualStyle')
  const targetAudience = watch('targetAudience')
  const aiImageId = watch('aiImageId')

  return (
    <div className="max-w-4xl mx-auto animate-fade-in space-y-8">
      {/* ── Section Heading ── */}
      <div>
        <h2 className="font-display text-3xl font-bold text-white mb-1">Thumbnail Preview</h2>
        <p className="text-white/50 text-sm font-body">
          Review the AI-generated cover art before launching your series.
        </p>
      </div>

      {/* ── Image + Metadata Card ── */}
      <div className="glass-panel ghost-border rounded-2xl overflow-hidden shadow-2xl">
        {/* Image */}
        <div className="relative aspect-video w-full bg-surface-container-lowest overflow-hidden group">
          {imageUrl ? (
            <>
              <img
                src={imageUrl}
                alt={`${title} series thumbnail`}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Synced badge */}
              <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-accent-cyan/30 text-[10px] font-mono text-accent-cyan tracking-wider flex items-center gap-1.5 uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
                AI Generated
              </div>

              {/* Image ID badge */}
              {aiImageId && (
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-[10px] font-mono text-white/50 tracking-wider">
                  ID: {aiImageId.slice(0, 8)}…
                </div>
              )}

              {/* Bottom title overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-headline text-2xl font-bold text-white tracking-wide">{title}</h3>
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <span className="px-2.5 py-1 bg-accent-cyan/15 border border-accent-cyan/20 rounded text-[10px] font-mono font-bold text-accent-cyan uppercase tracking-wider">
                    {visualStyle}
                  </span>
                  <span className="px-2.5 py-1 bg-secondary/15 border border-secondary/20 rounded text-[10px] font-mono font-bold text-secondary uppercase tracking-wider">
                    {targetAudience}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-surface-container-low">
              <span className="material-symbols-outlined text-white/20 text-6xl">broken_image</span>
            </div>
          )}
        </div>

        {/* ── Metadata row ── */}
        <div className="p-5 bg-surface-container-low/40 border-t border-white/[0.06] flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2 text-white/40">
            <span className="material-symbols-outlined text-base">image</span>
            <span className="text-[10px] font-mono uppercase tracking-widest">Series Thumbnail</span>
          </div>
          <div className="ml-auto flex items-center gap-1.5 text-green-400">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-widest">Ready to Proceed</span>
          </div>
        </div>
      </div>

      {/* ── Actions ── */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Back / Edit */}
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="flex-1 py-4 bg-surface-container-high/40 hover:bg-surface-container-high/70
            border border-white/10 rounded-xl font-bold tracking-widest uppercase text-[10px]
            text-white/70 hover:text-white transition-all flex items-center justify-center gap-2
            disabled:opacity-40 disabled:pointer-events-none"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Back &amp; Edit Details
        </button>

        {/* Process / Submit */}
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="flex-[2] py-4 bg-gradient-to-r from-accent-cyan/80 to-secondary rounded-xl
            font-bold tracking-widest uppercase text-[10px] text-white shadow-lg
            disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3
            hover:shadow-secondary/30 transition-all border border-white/10 active:scale-[0.99]"
        >
          {isSubmitting ? (
            <>
              <span className="material-symbols-outlined animate-spin text-base">autorenew</span>
              Launching Series...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                rocket_launch
              </span>
              Process &amp; Launch Series
            </>
          )}
        </button>
      </div>
    </div>
  )
}
