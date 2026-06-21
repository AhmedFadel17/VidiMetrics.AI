import { useState } from 'react'
import { CharacterFormValues } from '@/types'
import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form'

const TRAIT_TAGS = [
  'Stoic', 'Impulsive', 'Analytical', 'Empathetic', 'Ruthless',
  'Cunning', 'Loyal', 'Charismatic', 'Haunted', 'Brilliant',
  'Reckless', 'Disciplined', 'Mysterious', 'Optimistic', 'Cynical',
  'Courageous', 'Deceptive', 'Honorable', 'Volatile', 'Calculating',
]

interface Props {
  register: UseFormRegister<CharacterFormValues>
  errors: FieldErrors<CharacterFormValues>
  setValue: UseFormSetValue<CharacterFormValues>
  watch: UseFormWatch<CharacterFormValues>
}

export default function StepPersonality({ register, errors, setValue, watch }: Props) {
  const [selectedTraits, setSelectedTraits] = useState<string[]>([])
  const insightValue = watch('insightLevel') ?? 60

  const toggleTrait = (trait: string) => {
    setSelectedTraits(prev => {
      const next = prev.includes(trait)
        ? prev.filter(t => t !== trait)
        : [...prev, trait]
      // append selected traits to the textarea
      const current = (document.getElementById('personalityTraits') as HTMLTextAreaElement)?.value ?? ''
      const base = current.split('·')[0].trim()
      const tagsStr = next.length > 0 ? ' · ' + next.join(', ') : ''
      setValue('personalityTraits', base + tagsStr)
      return next
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-3xl font-bold text-white mb-1">Psychological Profile</h2>
        <p className="text-white/50 text-sm font-body">Shape the inner world that drives every decision.</p>
      </div>

      {/* Core Personality Textarea */}
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-[0.25em] text-white/40">
          Core Personality Description
        </label>
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-4 top-4 text-white/30 group-focus-within:text-accent-purple transition-colors text-xl">
            psychology
          </span>
          <textarea
            id="personalityTraits"
            {...register('personalityTraits')}
            rows={5}
            placeholder="Describe their temper, motivations, and internal conflicts..."
            className={`w-full bg-white/5 border rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:ring-2 focus:ring-accent-purple/40 focus:border-accent-purple/40 focus:outline-none transition-all font-body resize-none ${errors.personalityTraits ? 'border-red-500/60' : 'border-white/10'
              }`}
          />
        </div>
        {errors.personalityTraits && (
          <p className="text-red-400 text-[10px] uppercase tracking-wider ml-1">{errors.personalityTraits.message}</p>
        )}
      </div>

      {/* Traits Cloud */}
      <div className="space-y-3">
        <label className="block text-[10px] font-black uppercase tracking-[0.25em] text-white/40">
          Trait Cloud — click to append
        </label>
        <div className="flex flex-wrap gap-2">
          {TRAIT_TAGS.map(trait => (
            <button
              key={trait}
              type="button"
              onClick={() => toggleTrait(trait)}
              className={`px-4 py-1.5 rounded-full text-xs font-label font-semibold border transition-all duration-200 ${selectedTraits.includes(trait)
                  ? 'bg-accent-purple/20 border-accent-purple text-accent-purple shadow-[0_0_12px_rgba(138,43,226,0.3)]'
                  : 'bg-white/5 border-white/10 text-white/50 hover:border-accent-purple/40 hover:text-white/80'
                }`}
            >
              {selectedTraits.includes(trait) && (
                <span className="mr-1 text-accent-purple">✓</span>
              )}
              {trait}
            </button>
          ))}
        </div>
      </div>

      {/* Insight Level Slider */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40">
            Narrative Insight Level
          </label>
          <span className="text-accent-cyan font-bold font-headline text-lg tabular-nums">
            {insightValue}%
          </span>
        </div>
        <div className="relative">
          <input
            type="range"
            min={1}
            max={100}
            {...register('insightLevel', { valueAsNumber: true })}
            className="w-full h-1 rounded-full appearance-none cursor-pointer accent-accent-cyan"
            style={{
              background: `linear-gradient(to right, #00f2ff ${insightValue}%, rgba(255,255,255,0.1) ${insightValue}%)`
            }}
          />
        </div>
        <p className="text-[10px] text-white/25 uppercase tracking-tighter">
          Higher levels unlock deeper AI-driven narrative complexity.
        </p>
      </div>
    </div>
  )
}
