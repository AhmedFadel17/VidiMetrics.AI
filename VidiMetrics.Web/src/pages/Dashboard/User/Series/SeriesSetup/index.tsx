import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { AnimatePresence, motion, Variants } from 'framer-motion'
import { SeriesFormValues } from '@/types'
import { useCreateShowMutation } from '@/store/apis/storyEngine/shows.api'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import StepSeriesDetails from './steps/StepSeriesDetails'
import StepImagePreview from './steps/StepImagePreview'

// ─── Schema ───────────────────────────────────────────────────────────────────
const schema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().min(5, 'Description is required'),
  visualStyle: z.string().min(2, 'Visual style must be specified'),
  targetAudience: z.string().min(2, 'Target audience must be specified'),
  aiImageId: z.string().optional(),
  referenceImageUrl: z.string().optional(),
})

// ─── Steps config ─────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: 'Series Details', icon: 'edit_note' },
  { id: 2, label: 'Thumbnail Preview', icon: 'image_search' },
]

// ─── Motion variants ──────────────────────────────────────────────────────────
const slideVariants: Variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0, transition: { duration: 0.2 } }),
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function SeriesSetup() {
  const navigate = useNavigate()
  const [createShow, { isLoading: isCreating }] = useCreateShowMutation()

  const [currentStep, setCurrentStep] = useState(1)
  const [direction, setDirection] = useState(1)
  const form = useForm<SeriesFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      visualStyle: '',
      targetAudience: '',
      aiImageId: null as any,
      referenceImageUrl: null as any,
    },
    mode: 'onChange',
  })

  const { register, setValue, watch, formState: { errors } } = form

  // ─── Navigation ──────────────────────────────────────────────────────────────
  const goToStep2 = () => {
    setDirection(1)
    setCurrentStep(2)
  }

  const goBackToStep1 = () => {
    setDirection(-1)
    setCurrentStep(1)
  }

  // ─── Submit ──────────────────────────────────────────────────────────────────
  const onSubmit = async () => {
    const values = form.getValues()
    try {
      const result = await createShow({
        title: values.title,
        description: values.description,
        visualStyle: values.visualStyle,
        targetAudience: values.targetAudience,
        aiImageId: values.aiImageId || undefined,
      }).unwrap()

      toast.success('Series Launched', {
        description: 'Your production series has been initialized and is ready for episodes.',
      })

      const newShowId = result.data?.id
      setTimeout(() => navigate(newShowId ? `/dashboard/series/${newShowId}` : '/dashboard/series'), 1400)
    } catch (error: any) {
      toast.error('Launch Failed', {
        description: error.data?.message ?? 'An error occurred while creating the series.',
      })
    }
  }

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <main className="w-full min-h-screen pb-20 animate-fade-in">
      <style>{`
        
        .step-connector { flex: 1; height: 1px; background: rgba(255,255,255,0.08); }
        .step-connector.done { background: linear-gradient(to right, #22d3ee, #ddb7ff); }
      `}</style>

      {/* ── Breadcrumbs + Header ── */}
      <div className="space-y-3 mb-10">
        <Breadcrumbs items={[
          { label: 'Home', path: '/' },
          { label: 'Series Library', path: '/dashboard/series' },
          { label: 'New Series' },
        ]} />

        <div className="flex items-end justify-between">
          <div>
            <h1 className="font-display text-4xl font-black tracking-tight text-white">
              Series <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-secondary">Setup</span>
            </h1>
            <p className="text-white/40 font-body text-sm mt-1">
              Step {currentStep} of {STEPS.length} — {STEPS[currentStep - 1].label}
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/dashboard/series')}
            className="text-white/30 hover:text-white/70 text-[10px] uppercase tracking-widest font-label flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-base">close</span>
            Cancel
          </button>
        </div>
      </div>

      {/* ── Stepper ── */}
      <div className="flex items-center gap-0 mb-10 select-none">
        {STEPS.map((step, idx) => {
          const done = currentStep > step.id
          const active = currentStep === step.id
          return (
            <div key={step.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-2 flex-shrink-0">
                <motion.div
                  animate={{
                    scale: active ? 1.1 : 1,
                    boxShadow: active ? '0 0 20px rgba(34,211,238,0.35)' : 'none',
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${done
                    ? 'bg-gradient-to-br from-accent-cyan to-secondary border-transparent'
                    : active
                      ? 'border-accent-cyan bg-accent-cyan/10'
                      : 'border-white/15 bg-white/[0.03]'
                    }`}
                >
                  {done ? (
                    <span className="material-symbols-outlined text-[#0b1326] text-base" style={{ fontVariationSettings: "'FILL' 1, 'wght' 700" }}>
                      check
                    </span>
                  ) : (
                    <span className={`material-symbols-outlined text-base ${active ? 'text-accent-cyan' : 'text-white/25'}`}>
                      {step.icon}
                    </span>
                  )}
                </motion.div>
                <span className={`text-[9px] uppercase tracking-widest font-label whitespace-nowrap transition-colors ${active ? 'text-accent-cyan font-bold' : done ? 'text-white/50' : 'text-white/25'
                  }`}>
                  {step.label}
                </span>
              </div>

              {idx < STEPS.length - 1 && (
                <div className={`step-connector mx-3 mb-5 ${done ? 'done' : ''}`} />
              )}
            </div>
          )
        })}
      </div>

      {/* ── Step Panel ── */}
      <div className="bg-surface-container-low/60 backdrop-blur-[24px] border-[1px] border-white/10 rounded-2xl overflow-hidden">
        <div className="p-8 min-h-[480px] relative overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              {currentStep === 1 && (
                <StepSeriesDetails
                  register={register}
                  errors={errors}
                  watch={watch}
                  setValue={setValue}
                  onNext={goToStep2}
                  isSubmitting={isCreating}
                />
              )}
              {currentStep === 2 && (
                <StepImagePreview
                  watch={watch}
                  onBack={goBackToStep1}
                  onSubmit={onSubmit}
                  isSubmitting={isCreating}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </main>
  )
}