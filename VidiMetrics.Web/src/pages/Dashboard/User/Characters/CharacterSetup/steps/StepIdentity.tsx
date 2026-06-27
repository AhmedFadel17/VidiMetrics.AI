import { CharacterFormValues } from '@/types'
import { UseFormRegister, FieldErrors } from 'react-hook-form'
import { CharacterImportance } from '@/types'

const IMPORTANCE_OPTIONS = [
  { key: CharacterImportance.Main, label: 'Main' },
  { key: CharacterImportance.Supporting, label: 'Supporting' },
  { key: CharacterImportance.Minor, label: 'Minor' }]

interface Props {
  register: UseFormRegister<CharacterFormValues>
  errors: FieldErrors<CharacterFormValues>
}

export default function StepIdentity({ register, errors }: Props) {

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-3xl font-bold text-white mb-1">Identity Matrix</h2>
        <p className="text-white/50 text-sm font-body">Establish the foundational parameters of your digital entity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Character Name */}
        <div className="md:col-span-2 space-y-2">
          <label className="block text-[10px] font-black uppercase tracking-[0.25em] text-white/40">
            Character Name
          </label>
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-accent-cyan transition-colors text-xl">
              fingerprint
            </span>
            <input
              {...register('name')}
              type="text"
              placeholder="e.g. Orion Thorne"
              className={`w-full bg-white/5 border rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:ring-2 focus:ring-accent-cyan/40 focus:border-accent-cyan/40 focus:outline-none transition-all font-body ${errors.name ? 'border-red-500/60 ring-2 ring-red-500/20' : 'border-white/10'
                }`}
            />
          </div>
          {errors.name && (
            <p className="text-red-400 text-[10px] uppercase tracking-wider ml-1">{errors.name.message}</p>
          )}
        </div>

        {/* Role */}
        <div className="space-y-2">
          <label className="block text-[10px] font-black uppercase tracking-[0.25em] text-white/40">
            Narrative Role
          </label>
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-accent-cyan transition-colors text-xl">
              manage_accounts
            </span>
            <input
              {...register('role')}
              type="text"
              placeholder="e.g. Rogue Specialist"
              className={`w-full bg-white/5 border rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:ring-2 focus:ring-accent-cyan/40 focus:border-accent-cyan/40 focus:outline-none transition-all font-body ${errors.role ? 'border-red-500/60 ring-2 ring-red-500/20' : 'border-white/10'
                }`}
            />
          </div>
          {errors.role && (
            <p className="text-red-400 text-[10px] uppercase tracking-wider ml-1">{errors.role.message}</p>
          )}
        </div>

        {/* Importance */}
        <div className="space-y-2">
          <label className="block text-[10px] font-black uppercase tracking-[0.25em] text-white/40">
            Character Importance
          </label>
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-accent-cyan transition-colors text-xl">
              star_rate
            </span>
            <select
              {...register('importance', { valueAsNumber: true })}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-10 text-white focus:ring-2 focus:ring-accent-cyan/40 focus:border-accent-cyan/40 focus:outline-none transition-all font-body appearance-none cursor-pointer"
            >
              {IMPORTANCE_OPTIONS.map((opt) => (
                <option key={opt.key} value={opt.key} className="bg-[#0b1326] text-white">
                  {opt.label}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/30 text-xl">
              expand_more
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
