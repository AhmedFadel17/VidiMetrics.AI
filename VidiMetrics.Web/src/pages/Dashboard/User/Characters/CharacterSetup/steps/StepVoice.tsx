import { UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { CharacterFormValues } from '../types'

const VOICE_PROFILES = [
  {
    id: 'command',
    name: 'Command Center',
    archetype: 'Standard Archetype',
    description: 'Deep, authoritative. Projects dominance and tactical precision.',
    icon: 'military_tech',
    color: 'text-primary',
    glow: 'shadow-[0_0_20px_rgba(221,183,255,0.2)]',
  },
  {
    id: 'gritty',
    name: 'Gritty Specialist',
    archetype: 'Standard Archetype',
    description: 'Raspy, world-weary. Carries the weight of a thousand missions.',
    icon: 'construction',
    color: 'text-orange-400',
    glow: 'shadow-[0_0_20px_rgba(251,146,60,0.2)]',
  },
  {
    id: 'serene',
    name: 'Serene Observer',
    archetype: 'Neural Core',
    description: 'Calm, melodic. Hypnotic clarity that commands without force.',
    icon: 'self_improvement',
    color: 'text-secondary',
    glow: 'shadow-[0_0_20px_rgba(76,215,246,0.2)]',
  },
  {
    id: 'energetic',
    name: 'Energetic Protagonist',
    archetype: 'Neural Core',
    description: 'Bright, dynamic. Radiates enthusiasm and unbridled momentum.',
    icon: 'bolt',
    color: 'text-yellow-400',
    glow: 'shadow-[0_0_20px_rgba(250,204,21,0.2)]',
  },
]

interface Props {
  setValue: UseFormSetValue<CharacterFormValues>
  watch: UseFormWatch<CharacterFormValues>
}

export default function StepVoice({ setValue, watch }: Props) {
  const selectedVoiceId = watch('voiceProfileId')

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-3xl font-bold text-white mb-1">Voice Synthesis</h2>
        <p className="text-white/50 text-sm font-body">Select the vocal signature that will carry your character's essence.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {VOICE_PROFILES.map((voice) => {
          const isSelected = selectedVoiceId === voice.id
          return (
            <div
              key={voice.id}
              onClick={() => setValue('voiceProfileId', voice.id)}
              className={`relative flex items-center gap-5 p-5 rounded-xl border cursor-pointer transition-all duration-300 group ${
                isSelected
                  ? `border-white/20 bg-white/5 ${voice.glow}`
                  : 'border-white/10 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]'
              }`}
            >
              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                isSelected ? 'bg-white/10' : 'bg-white/5'
              }`}>
                <span className={`material-symbols-outlined text-2xl ${isSelected ? voice.color : 'text-white/30'}`}
                  style={{ fontVariationSettings: "'FILL' 1" }}>
                  {voice.icon}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-white/30 font-label">
                    {voice.archetype}
                  </span>
                  {isSelected && (
                    <span className="text-[9px] uppercase tracking-[0.1em] text-green-400 font-label bg-green-400/10 px-2 py-0.5 rounded-full">
                      Selected
                    </span>
                  )}
                </div>
                <p className={`font-display font-bold text-base ${isSelected ? 'text-white' : 'text-white/60'}`}>
                  {voice.name}
                </p>
                <p className="text-white/40 text-xs font-body mt-0.5 leading-relaxed">{voice.description}</p>
              </div>

              {/* Play Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  // TODO: wire to actual audio preview
                }}
                className={`flex-shrink-0 w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                  isSelected
                    ? `border-white/20 text-white hover:bg-white/10 ${voice.glow}`
                    : 'border-white/10 text-white/30 hover:border-white/20 hover:text-white/60'
                }`}
                title="Preview voice"
              >
                <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                  play_arrow
                </span>
              </button>

              {/* Selection indicator */}
              <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full transition-all duration-300 ${
                isSelected ? voice.color.replace('text-', 'bg-') : 'bg-transparent'
              }`} />
            </div>
          )
        })}
      </div>

      {selectedVoiceId && (
        <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] flex items-center gap-3">
          <span className="material-symbols-outlined text-secondary text-xl">check_circle</span>
          <p className="text-white/60 text-sm font-body">
            Voice profile <span className="text-white font-semibold">
              {VOICE_PROFILES.find(v => v.id === selectedVoiceId)?.name}
            </span> will be used for AI narration and synthesis.
          </p>
        </div>
      )}
    </div>
  )
}
