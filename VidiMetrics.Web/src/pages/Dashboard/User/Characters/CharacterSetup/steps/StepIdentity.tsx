import { UseFormRegister, FieldErrors, UseFormWatch } from 'react-hook-form'
import { CharacterFormValues } from '../types'

const IMPORTANCE_OPTIONS = ['Main', 'Supporting', 'Extra']

interface Props {
  register: UseFormRegister<CharacterFormValues>
  errors: FieldErrors<CharacterFormValues>
  watch: UseFormWatch<CharacterFormValues>
}

export default function StepIdentity({ register, errors, watch }: Props) {
  const name = watch('name')
  const role = watch('role')
  const importance = watch('importance')
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
              {...register('importance')}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-10 text-white focus:ring-2 focus:ring-accent-cyan/40 focus:border-accent-cyan/40 focus:outline-none transition-all font-body appearance-none cursor-pointer"
            >
              {IMPORTANCE_OPTIONS.map((opt) => (
                <option key={opt} value={opt} className="bg-[#0b1326] text-white">
                  {opt}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/30 text-xl">
              expand_more
            </span>
          </div>
        </div>
      </div>

      {/* Preview Card */}
      <div className="mt-4 p-5 rounded-xl border border-white/5 bg-white/[0.03]">
        <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2 font-label">Identity Preview</p>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent-cyan/30 to-accent-purple/30 border border-white/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-white/60">person</span>
          </div>
          <div>
            <p className="text-white font-display font-bold text-lg leading-tight">{name || "Orion Thorne"}</p>
            <p className="text-accent-cyan text-xs font-label tracking-widest uppercase">{role || "Rogue Specialist"} · {importance || "Main"}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
