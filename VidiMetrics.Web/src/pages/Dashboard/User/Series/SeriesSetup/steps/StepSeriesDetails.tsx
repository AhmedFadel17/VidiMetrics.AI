import { useState } from 'react'
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form'
import { SeriesFormValues } from '@/types'
import { useCreateSeriesImageMutation } from '@/store/apis/ai/aiImages.api'
import { toast } from 'sonner'

interface StepSeriesDetailsProps {
  register: UseFormRegister<SeriesFormValues>
  errors: FieldErrors<SeriesFormValues>
  watch: UseFormWatch<SeriesFormValues>
  setValue: UseFormSetValue<SeriesFormValues>
  onNext: () => void
  isSubmitting: boolean
}

export default function StepSeriesDetails({
  register,
  errors,
  watch,
  setValue,
  onNext,
  isSubmitting,
}: StepSeriesDetailsProps) {
  const [createSeriesImage, { isLoading: isGenerating }] = useCreateSeriesImageMutation()

  const title = watch('title')
  const description = watch('description')
  const visualStyle = watch('visualStyle')
  const targetAudience = watch('targetAudience')

  const canGenerate =
    title?.trim().length >= 2 &&
    description?.trim().length >= 5 &&
    visualStyle?.trim().length >= 2 &&
    targetAudience?.trim().length >= 2

  const handleGenerate = async () => {
    try {
      const result = await createSeriesImage({
        title,
        description,
        visualStyle,
        targetAudience,
      }).unwrap()

      if (result.data?.imageUrl && result.data?.id) {
        setValue('referenceImageUrl', result.data.imageUrl)
        setValue('aiImageId', result.data.id)
        toast.success('Thumbnail Generated', {
          description: 'AI has synthesized a visual identity for your series.',
        })
        onNext()
      }
    } catch (error: any) {
      toast.error('Generation Failed', {
        description: error.data?.message ?? 'Could not generate series thumbnail.',
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

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Section heading */}
      <div>
        <h2 className="font-display text-3xl font-bold text-white mb-1">Series Parameters</h2>
        <p className="text-white/50 text-sm font-body">
          Define the identity and audience of your new production.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="md:col-span-2 space-y-2">
          <label className="block text-[10px] font-black uppercase tracking-[0.25em] text-white/40">
            Series Title
          </label>
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-accent-cyan transition-colors text-xl">
              local_movies
            </span>
            <input
              {...register('title')}
              type="text"
              placeholder="e.g. The Orion Chronicles"
              className={inputClass(!!errors.title)}
            />
          </div>
          {errors.title && (
            <p className="text-red-400 text-[10px] uppercase tracking-wider ml-1">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="md:col-span-2 space-y-2">
          <label className="block text-[10px] font-black uppercase tracking-[0.25em] text-white/40">
            Description
          </label>
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-4 text-white/30 group-focus-within:text-accent-cyan transition-colors text-xl">
              info
            </span>
            <textarea
              {...register('description')}
              placeholder="A brief synopsis of what this series is about..."
              className={textareaClass(!!errors.description)}
            />
          </div>
          {errors.description && (
            <p className="text-red-400 text-[10px] uppercase tracking-wider ml-1">{errors.description.message}</p>
          )}
        </div>

        {/* Visual Style */}
        <div className="space-y-2">
          <label className="block text-[10px] font-black uppercase tracking-[0.25em] text-white/40">
            Visual Style
          </label>
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-accent-cyan transition-colors text-xl">
              palette
            </span>
            <input
              {...register('visualStyle')}
              type="text"
              placeholder="e.g. Cyberpunk noir, anime, cinematic..."
              className={inputClass(!!errors.visualStyle)}
            />
          </div>
          {errors.visualStyle && (
            <p className="text-red-400 text-[10px] uppercase tracking-wider ml-1">{errors.visualStyle.message}</p>
          )}
        </div>

        {/* Target Audience */}
        <div className="space-y-2">
          <label className="block text-[10px] font-black uppercase tracking-[0.25em] text-white/40">
            Target Audience
          </label>
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-accent-cyan transition-colors text-xl">
              people
            </span>
            <input
              {...register('targetAudience')}
              type="text"
              placeholder="e.g. Young adults 18–25, sci-fi fans..."
              className={inputClass(!!errors.targetAudience)}
            />
          </div>
          {errors.targetAudience && (
            <p className="text-red-400 text-[10px] uppercase tracking-wider ml-1">{errors.targetAudience.message}</p>
          )}
        </div>
      </div>

      {/* Generate CTA */}
      <button
        type="button"
        onClick={handleGenerate}
        disabled={!canGenerate || isGenerating || isSubmitting}
        className={`w-full py-5 rounded-2xl font-headline font-bold text-sm uppercase tracking-widest
          flex items-center justify-center gap-3 transition-all border
          ${canGenerate && !isGenerating
            ? 'bg-gradient-to-r from-accent-cyan/20 to-secondary/20 border-accent-cyan/40 text-accent-cyan hover:brightness-110 active:scale-[0.99] shadow-[0_0_40px_rgba(34,211,238,0.1)]'
            : 'bg-white/5 border-white/10 text-white/30 cursor-not-allowed'
          }`}
      >
        {isGenerating ? (
          <>
            <span className="material-symbols-outlined text-lg animate-spin">autorenew</span>
            Synthesizing Visual Identity...
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </span>
            Generate Series Thumbnail &amp; Continue
          </>
        )}
      </button>

      {!canGenerate && (
        <p className="text-center text-white/25 text-[10px] uppercase tracking-widest font-label">
          Fill all fields above to unlock thumbnail generation
        </p>
      )}
    </div>
  )
}
