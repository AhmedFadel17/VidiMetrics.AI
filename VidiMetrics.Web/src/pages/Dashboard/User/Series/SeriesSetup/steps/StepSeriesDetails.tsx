import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form'
import { SeriesFormValues } from '@/types'
import { useCreateSeriesImageMutation } from '@/store/apis/ai/aiImages.api'
import { toast } from 'sonner'
import { InputField } from '@/components/ui/Inputs/InputField'
import { TextAreaField } from '@/components/ui/Inputs/TextareaField'
import { Button } from '@/components/ui/Button'

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
          <InputField
            label="Series Title"
            {...register('title')}
            type="text"
            placeholder="e.g. The Orion Chronicles"
            icon='local_movies'
            error={errors.title?.message}
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2 space-y-2">
          <TextAreaField
            label="Description"
            {...register('description')}
            placeholder="A brief synopsis of what this series is about..."
            icon='info'
            rows={6}
            error={errors.description?.message}
          />
        </div>

        {/* Visual Style */}
        <div className="space-y-2">
          <TextAreaField
            label="Visual Style"
            {...register('visualStyle')}
            rows={2}
            placeholder="e.g. Cyberpunk noir, anime, cinematic..."
            icon='palette'
            error={errors.visualStyle?.message}
          />
        </div>

        {/* Target Audience */}
        <div className="space-y-2">
          <TextAreaField
            label="Target Audience"
            {...register('targetAudience')}
            rows={2}
            placeholder="e.g. Young adults 18–25, sci-fi fans..."
            icon='people'
            error={errors.targetAudience?.message}
          />

        </div>
      </div>

      {/* Generate CTA */}
      <Button
        variant="launch"
        size="xl"
        type="button"
        fullWidth
        onClick={handleGenerate}
        disabled={!canGenerate || isGenerating || isSubmitting}
        isLoading={isGenerating}
        loadingText="Generating..."
        icon={<span className="material-symbols-outlined text-base">auto_awesome</span>}
      >
        Generate Thumbnail &amp; Continue
      </Button>

      {!canGenerate && (
        <p className="text-center text-white/25 text-[10px] uppercase tracking-widest font-label">
          Fill all fields above to unlock thumbnail generation
        </p>
      )}
    </div>
  )
}
