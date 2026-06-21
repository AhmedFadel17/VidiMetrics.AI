import { CharacterFormValues } from '@/types'
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form'
import { useCreateCharacterImageMutation } from '@/store/apis/ai/aiImages.api'
import { toast } from 'sonner'

interface Props {
  register: UseFormRegister<CharacterFormValues>
  errors: FieldErrors<CharacterFormValues>
  watch: UseFormWatch<CharacterFormValues>
  setValue: UseFormSetValue<CharacterFormValues>
}

export default function StepVisuals({ register, errors, watch, setValue }: Props) {
  const [createCharacterImage, { isLoading: isGenerating }] = useCreateCharacterImageMutation()

  const physicalDesc = watch('physicalDescription')
  const clothingStyle = watch('clothingStyle')
  const characterName = watch('name')
  const characterRole = watch('role')
  const personalityTraits = watch('personalityTraits')
  const referenceImageUrl = watch('referenceImageUrl')

  const previewVisible = !!referenceImageUrl
  const canGenerate = physicalDesc?.length >= 10 && clothingStyle?.length >= 5

  const handleGenerate = async () => {
    try {
      const result = await createCharacterImage({
        name: characterName,
        physicalDescription: physicalDesc,
        clothingStyle: clothingStyle,
        personalityTraits: personalityTraits,
        role: characterRole
      }).unwrap()

      if (result.data?.imageUrl && result.data?.id) {
        setValue('referenceImageUrl', result.data.imageUrl)
        setValue('aiImageId', result.data.id)
        toast.success('Visual Reference Compiled', {
          description: 'Neural core has successfully synthesized the character appearance.'
        })
      }
    } catch (error: any) {
      toast.error('Synthesis Failed', {
        description: error.data?.message ?? 'Failed to generate character visual reference.'
      })
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-3xl font-bold text-white mb-1">Visual Identity</h2>
        <p className="text-white/50 text-sm font-body">Define how the world perceives your character.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* Left: Textareas */}
        <div className="space-y-6 flex flex-col h-full">
          {/* Physical Description */}
          <div className="space-y-2 flex-1 flex flex-col">
            <label className="block text-[10px] font-black uppercase tracking-[0.25em] text-white/40">
              Physical Description
            </label>
            <div className="relative group flex-1">
              <span className="material-symbols-outlined absolute left-4 top-4 text-white/30 group-focus-within:text-primary transition-colors text-xl">
                accessibility_new
              </span>
              <textarea
                {...register('physicalDescription')}
                className={`w-full h-full min-h-[160px] bg-white/5 border rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:ring-2 focus:ring-primary/40 focus:border-primary/40 focus:outline-none transition-all font-body resize-none ${errors.physicalDescription ? 'border-red-500/60' : 'border-white/10'
                  }`}
                placeholder="Detail height, build, eye color, unique markings..."
              />
            </div>
            {errors.physicalDescription && (
              <p className="text-red-400 text-[10px] uppercase tracking-wider ml-1">{errors.physicalDescription.message}</p>
            )}
          </div>

          {/* Clothing Style */}
          <div className="space-y-2 flex-1 flex flex-col">
            <label className="block text-[10px] font-black uppercase tracking-[0.25em] text-white/40">
              Clothing Style
            </label>
            <div className="relative group flex-1">
              <span className="material-symbols-outlined absolute left-4 top-4 text-white/30 group-focus-within:text-secondary transition-colors text-xl">
                checkroom
              </span>
              <textarea
                {...register('clothingStyle')}
                className={`w-full h-full min-h-[160px] bg-white/5 border rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:ring-2 focus:ring-secondary/40 focus:border-secondary/40 focus:outline-none transition-all font-body resize-none ${errors.clothingStyle ? 'border-red-500/60' : 'border-white/10'
                  }`}
                placeholder="Wardrobe, material preferences, color palette..."
              />
            </div>
            {errors.clothingStyle && (
              <p className="text-red-400 text-[10px] uppercase tracking-wider ml-1">{errors.clothingStyle.message}</p>
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
            {isGenerating ? 'Neural Core Processing...' : '✨ Generate Character Preview'}
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
                  Fill descriptions above then<br />generate your character preview
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
                  alt="Generated character preview"
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
  )
}
