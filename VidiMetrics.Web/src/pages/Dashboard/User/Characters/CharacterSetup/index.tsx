import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { AnimatePresence, motion } from 'framer-motion'
import { useCreateCharacterMutation } from '@/store/apis/storyEngine/characters.api'
import { useGetShowByIdQuery } from '@/store/apis'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import { LoadingScreen, ErrorScreen } from '@/components/ui/Feedback/StatusScreens'
import { CharacterFormValues } from './types'
import StepIdentity from './steps/StepIdentity'
import StepPersonality from './steps/StepPersonality'
import StepVisuals from './steps/StepVisuals'
import StepVoice from './steps/StepVoice'

// ─── Schema ───────────────────────────────────────────────────────────────────
const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.string().min(2, 'Role must be defined'),
  importance: z.enum(['Main', 'Supporting', 'Extra']),
  personalityTraits: z.string().min(5, 'Personality traits must be specified'),
  insightLevel: z.number().min(1).max(100),
  physicalDescription: z.string().min(10, 'Description must be detailed'),
  clothingStyle: z.string().min(5, 'Clothing style must be specified'),
  voiceProfileId: z.string().optional(),
  aiImageId: z.string().optional(),
  referenceImageUrl: z.string().optional(),
})

// ─── Step definitions ─────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: 'Identity', icon: 'fingerprint', fields: ['name', 'role', 'importance'] as const },
  { id: 2, label: 'Personality', icon: 'psychology', fields: ['personalityTraits', 'insightLevel'] as const },
  { id: 3, label: 'Visuals', icon: 'visibility', fields: ['physicalDescription', 'clothingStyle'] as const },
  { id: 4, label: 'Voice', icon: 'settings_voice', fields: [] as const },
]

// ─── Framer Motion variants ───────────────────────────────────────────────────
const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0, transition: { duration: 0.25 } }),
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function CharacterSetup() {
  const { showId } = useParams<{ showId: string }>()
  const navigate = useNavigate()
  const { data: showResponse, isLoading: isShowLoading } = useGetShowByIdQuery(showId ?? '')
  const [createCharacter, { isLoading: isCreating }] = useCreateCharacterMutation()

  const [currentStep, setCurrentStep] = useState(1)
  const [direction, setDirection] = useState(1)

  const show = showResponse?.data

  const form = useForm<CharacterFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      importance: 'Main',
      insightLevel: 60,
      voiceProfileId: '',
      aiImageId: '',
      referenceImageUrl: '',
    },
    mode: 'onChange',
  })

  const { register, handleSubmit, setValue, watch, trigger, formState: { errors } } = form

  // ─── Navigation ─────────────────────────────────────────────────────────────
  const goNext = async () => {
    if (isLastStep) return;

    const step = STEPS[currentStep - 1]
    const valid = step.fields.length === 0 || await trigger(step.fields as any)
    if (!valid) return

    // Step 3 specific validation: Must have generated an image
    if (currentStep === 3) {
      const aiImageId = watch('aiImageId')
      if (!aiImageId) {
        toast.error('Image Required', {
          description: 'You must generate a character preview before proceeding.',
        })
        return
      }
    }

    setDirection(1)
    setCurrentStep(s => Math.min(s + 1, STEPS.length))
  }

  const goBack = () => {
    setDirection(-1)
    setCurrentStep(s => Math.max(s - 1, 1))
  }

  // ─── Submit ──────────────────────────────────────────────────────────────────
  const onSubmit = async (values: CharacterFormValues) => {
    if (!showId) return
    try {
      const { referenceImageUrl, ...submitData } = values
      await createCharacter({
        ...submitData,
        showId,
      }).unwrap()

      toast.success('Character Initialized', {
        description: 'Archetype accepted. Neural engine is compiling visual references...',
      })
      setTimeout(() => navigate(`/dashboard/series/${showId}`), 1500)
    } catch (error: any) {
      toast.error('Initialization Failed', {
        description: error.data?.message ?? 'System failure during character creation.',
      })
    }
  }

  // ─── Guards ──────────────────────────────────────────────────────────────────
  if (isShowLoading) return <LoadingScreen message="Accessing Show Parameters..." accentColor="purple" />
  if (!show) return <ErrorScreen title="Series Connection Lost" message="Unable to retrieve show details for character placement." />

  const isLastStep = currentStep === STEPS.length

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
          { label: 'Characters', path: `/dashboard/series/${show.id}?tab=Characters` },
          { label: 'New Character' },
        ]} />
        <div className="flex items-end justify-between">
          <div>
            <h1 className="font-display text-4xl font-black tracking-tight text-white">
              Character <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Creator</span>
            </h1>
            <p className="text-white/40 font-body text-sm mt-1">
              Step {currentStep} of {STEPS.length} — {STEPS[currentStep - 1].label}
            </p>
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

      {/* ── Stepper ── */}
      <div className="flex items-center gap-0 mb-10 select-none">
        {STEPS.map((step, idx) => {
          const done = currentStep > step.id
          const active = currentStep === step.id
          return (
            <div key={step.id} className="flex items-center flex-1 last:flex-none">
              {/* Node */}
              <div className="flex flex-col items-center gap-2 flex-shrink-0">
                <motion.div
                  animate={{
                    scale: active ? 1.1 : 1,
                    boxShadow: active ? '0 0 20px rgba(76,215,246,0.4)' : 'none',
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${done
                      ? 'bg-gradient-to-br from-primary to-secondary border-transparent'
                      : active
                        ? 'border-secondary bg-secondary/10'
                        : 'border-white/15 bg-white/[0.03]'
                    }`}
                >
                  {done ? (
                    <span className="material-symbols-outlined text-[#0b1326] text-base" style={{ fontVariationSettings: "'FILL' 1, 'wght' 700" }}>
                      check
                    </span>
                  ) : (
                    <span className={`material-symbols-outlined text-base ${active ? 'text-secondary' : 'text-white/25'}`}>
                      {step.icon}
                    </span>
                  )}
                </motion.div>
                <span className={`text-[9px] uppercase tracking-widest font-label whitespace-nowrap transition-colors ${active ? 'text-secondary font-bold' : done ? 'text-white/50' : 'text-white/25'
                  }`}>
                  {step.label}
                </span>
              </div>

              {/* Connector */}
              {idx < STEPS.length - 1 && (
                <div className={`step-connector mx-3 mb-5 ${done ? 'done' : ''}`} />
              )}
            </div>
          )
        })}
      </div>

      {/* ── Step Panel ── */}
      <div className="wizard-glass rounded-2xl overflow-hidden">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-8 min-h-[480px] overflow-hidden relative">
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
                  <StepIdentity register={register} errors={errors} watch={watch} />
                )}
                {currentStep === 2 && (
                  <StepPersonality register={register} errors={errors} setValue={setValue} watch={watch} />
                )}
                {currentStep === 3 && (
                  <StepVisuals register={register} errors={errors} watch={watch} setValue={setValue} />
                )}
                {currentStep === 4 && (
                  <StepVoice setValue={setValue} watch={watch} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── Navigation Footer ── */}
          <div className="border-t border-white/[0.06] px-8 py-5 flex justify-between items-center bg-white/[0.02]">
            {/* Back */}
            <button
              type="button"
              onClick={goBack}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-label text-sm uppercase tracking-widest text-white/40 hover:text-white/80 hover:bg-white/5 border border-transparent hover:border-white/10 transition-all disabled:opacity-0 disabled:pointer-events-none"
            >
              <span className="material-symbols-outlined text-base">arrow_back</span>
              Back
            </button>

            {/* Step dots (mobile indicator) */}
            <div className="flex gap-1.5">
              {STEPS.map(s => (
                <div
                  key={s.id}
                  className={`rounded-full transition-all duration-300 ${s.id === currentStep
                      ? 'w-6 h-2 bg-secondary'
                      : s.id < currentStep
                        ? 'w-2 h-2 bg-primary/60'
                        : 'w-2 h-2 bg-white/15'
                    }`}
                />
              ))}
            </div>

            {/* Next / Finish */}
            {isLastStep ? (
              <button
                key="btn-submit"
                type="submit"
                disabled={isCreating}
                className="flex items-center gap-2 px-8 py-3 rounded-xl font-headline font-bold text-sm bg-gradient-to-r from-primary to-secondary text-[#0b1326] shadow-[0_0_30px_rgba(76,215,246,0.25)] hover:brightness-110 active:scale-95 transition-all disabled:opacity-60 disabled:pointer-events-none"
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
                    Launch Character
                  </>
                )}
              </button>
            ) : (
              <button
                key="btn-next"
                type="button"
                onClick={goNext}
                className="flex items-center gap-2 px-8 py-3 rounded-xl font-headline font-bold text-sm bg-white/10 border border-white/15 text-white hover:bg-white/15 hover:border-secondary/40 hover:text-secondary active:scale-95 transition-all"
              >
                Next
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </main>
  )
}
