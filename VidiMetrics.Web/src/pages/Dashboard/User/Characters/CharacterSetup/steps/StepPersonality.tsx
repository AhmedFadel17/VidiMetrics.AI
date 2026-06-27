import { useState, useEffect } from 'react'
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
  const [inputValue, setInputValue] = useState('')
  const insightValue = watch('insightLevel') ?? 60
  
  // Watch personalityTraits from React Hook Form (default to empty array if not set)
  const currentTraits = watch('personalityTraits') || []

  // Register the field manually for React Hook Form tracking
  useEffect(() => {
    register('personalityTraits')
  }, [register])

  const addTrait = (trait: string) => {
    const trimmed = trait.trim()
    if (trimmed && !currentTraits.includes(trimmed)) {
      const nextTraits = [...currentTraits, trimmed]
      setValue('personalityTraits', nextTraits, { shouldValidate: true })
    }
    setInputValue('')
  }

  const removeTrait = (trait: string) => {
    const nextTraits = currentTraits.filter(t => t !== trait)
    setValue('personalityTraits', nextTraits, { shouldValidate: true })
  }

  const toggleTrait = (trait: string) => {
    const nextTraits = currentTraits.includes(trait)
      ? currentTraits.filter(t => t !== trait)
      : [...currentTraits, trait]
    setValue('personalityTraits', nextTraits, { shouldValidate: true })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const val = inputValue.trim().replace(/,$/, '')
      if (val) {
        addTrait(val)
      }
    }
  }

  const handleBlur = () => {
    const val = inputValue.trim()
    if (val) {
      addTrait(val)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-3xl font-bold text-white mb-1">Psychological Profile</h2>
        <p className="text-white/50 text-sm font-body">Shape the inner world that drives every decision.</p>
      </div>

      {/* Core Personality Multi-Select / Tag Input */}
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-[0.25em] text-white/40">
          Personality Traits (Select at least 3)
        </label>
        
        <div className={`w-full bg-white/5 border rounded-xl p-3 min-h-[100px] flex flex-wrap gap-2 items-center transition-all ${
          errors.personalityTraits ? 'border-red-500/60 ring-2 ring-red-500/20' : 'border-white/10 focus-within:border-accent-purple/40 focus-within:ring-2 focus-within:ring-accent-purple/40'
        }`}>
          {/* Render Badges */}
          {currentTraits.map((trait) => (
            <span 
              key={trait} 
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-accent-purple/20 border border-accent-purple/30 text-white shadow-[0_0_8px_rgba(138,43,226,0.15)] animate-fade-in"
            >
              {trait}
              <button
                type="button"
                onClick={() => removeTrait(trait)}
                className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-white/20 text-white/60 hover:text-white transition-colors focus:outline-none"
              >
                <span className="material-symbols-outlined text-[12px]">close</span>
              </button>
            </span>
          ))}

          {/* Inline Input for custom traits */}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            placeholder={currentTraits.length === 0 ? "Select from the cloud below, or type custom traits & press Enter..." : "Add custom..."}
            className="flex-1 min-w-[200px] bg-transparent border-none outline-none text-white text-sm font-body placeholder:text-white/25 focus:ring-0 focus:outline-none"
          />
        </div>
        
        {errors.personalityTraits && (
          <p className="text-red-400 text-[10px] uppercase tracking-wider ml-1">{errors.personalityTraits.message}</p>
        )}
      </div>

      {/* Traits Cloud */}
      <div className="space-y-3">
        <label className="block text-[10px] font-black uppercase tracking-[0.25em] text-white/40">
          Trait Cloud — click to toggle
        </label>
        <div className="flex flex-wrap gap-2">
          {TRAIT_TAGS.map(trait => (
            <button
              key={trait}
              type="button"
              onClick={() => toggleTrait(trait)}
              className={`px-4 py-1.5 rounded-full text-xs font-label font-semibold border transition-all duration-200 ${currentTraits.includes(trait)
                  ? 'bg-accent-purple/20 border-accent-purple text-accent-purple shadow-[0_0_12px_rgba(138,43,226,0.3)]'
                  : 'bg-white/5 border-white/10 text-white/50 hover:border-accent-purple/40 hover:text-white/80'
                }`}
            >
              {currentTraits.includes(trait) && (
                <span className="mr-1 text-accent-purple font-bold">✓</span>
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
