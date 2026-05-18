import { Lookup } from '@/types/api'

// ─── Line Types ───────────────────────────────────────────────────────────────
export interface EnvLine      { id: string; type: 'env';         weather: string; details: string }
export interface CharacterLine { id: string; type: 'character';   characterId: string; status: string; dialogue: string }
export interface DescriptionLine { id: string; type: 'description'; text: string }
export type ScriptLine = EnvLine | CharacterLine | DescriptionLine

export function makeId() { return Math.random().toString(36).slice(2, 9) }

const STATUS_OPTIONS = ['Speaking', 'Whispering', 'Shouting', 'Thinking', 'Narrating', 'Silent']

const WEATHER_CONDITIONS = [
  'Clear Sky', 'Sunny', 'Overcast', 'Foggy', 'Light Rain', 'Heavy Rain',
  'Thunderstorm', 'Drizzle', 'Snowing', 'Blizzard', 'Windy', 'Sandstorm',
  'Acid Rain', 'Neon Haze', 'Ash Fall', 'Aurora',
]

// ─── Props ───────────────────────────────────────────────────────────────────
interface ScriptEditorProps {
  lines: ScriptLine[]
  environment: Lookup | undefined
  characters: Lookup[]
  onChange: (lines: ScriptLine[]) => void
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function patch<T extends ScriptLine>(lines: ScriptLine[], id: string, update: Partial<T>): ScriptLine[] {
  return lines.map(l => l.id === id ? { ...l, ...update } as ScriptLine : l)
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function ScriptEditor({ lines, environment, characters, onChange }: ScriptEditorProps) {

  const envLine = lines.find(l => l.type === 'env') as EnvLine | undefined

  const bodyLines = lines.filter(l => l.type !== 'env')

  const remove = (id: string) => onChange(lines.filter(l => l.id !== id))

  const addDescription = () =>
    onChange([...lines, { id: makeId(), type: 'description', text: '' }])

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const charId = e.dataTransfer.getData('characterId')
    if (!charId) return
    onChange([...lines, { id: makeId(), type: 'character', characterId: charId, status: 'Speaking', dialogue: '' }])
  }

  return (
    <div
      className="flex flex-col min-h-[500px]"
      onDragOver={e => e.preventDefault()}
      onDrop={handleDrop}
    >
      {/* ── ENV LINE (always pinned, non-removable) ─────────────────────── */}
      {environment && (
        <div className="flex items-start gap-4 px-6 py-4 bg-surface-container-low border-l-4 border-accent-cyan/70 sticky top-0 z-10">
          <span className="material-symbols-outlined text-accent-cyan text-xl mt-0.5 flex-shrink-0">landscape</span>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 flex-1">
            {/* Environment label — locked */}
            <span className="font-mono text-accent-cyan font-bold uppercase text-sm tracking-wider">
              {environment.name}
            </span>
            <span className="text-white/20 font-mono text-sm hidden sm:block">·</span>
            {/* Weather select */}
            <select
              value={envLine?.weather ?? ''}
              onChange={e => envLine && onChange(patch(lines, envLine.id, { weather: e.target.value }))}
              className="bg-surface-container-highest text-secondary text-[10px] font-mono uppercase rounded px-2 py-0.5 border-none focus:outline-none cursor-pointer hover:bg-surface-container-high transition-colors"
            >
              <option value="">Weather...</option>
              {WEATHER_CONDITIONS.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
            <span className="text-white/20 font-mono text-sm">|</span>
            {/* Editable atmosphere detail */}
            <input
              value={envLine?.details ?? ''}
              onChange={e => envLine && onChange(patch(lines, envLine.id, { details: e.target.value }))}
              placeholder="Atmosphere / time of day..."
              className="bg-transparent font-mono text-sm text-on-surface/50 placeholder:text-white/20 border-none focus:outline-none flex-1 min-w-[160px]"
            />
          </div>
          <span className="text-[10px] font-mono text-white/20 self-center tracking-widest uppercase flex-shrink-0">ENV</span>
        </div>
      )}

      {/* ── BODY LINES ──────────────────────────────────────────────────── */}
      {bodyLines.map(line => {
        if (line.type === 'character') {
          const char = characters.find(c => c.id === line.characterId)
          return (
            <div
              key={line.id}
              className="flex items-start gap-4 px-6 py-5 border-b border-white/5 hover:bg-surface-container-lowest/30 group transition-colors"
            >
              {/* Avatar */}
              <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden border-2 border-secondary/40">
                {char?.imageUrl
                  ? <img src={char.imageUrl} alt={char.name} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center bg-surface-container-highest">
                      <span className="material-symbols-outlined text-white/20 text-base">person</span>
                    </div>
                }
              </div>

              <div className="flex-1 space-y-2">
                {/* Name + status */}
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-on-surface uppercase tracking-wide">
                    {char?.name ?? 'Unknown'}
                  </span>
                  <select
                    value={line.status}
                    onChange={e => onChange(patch<CharacterLine>(lines, line.id, { status: e.target.value }))}
                    className="bg-surface-container-highest text-secondary text-[10px] font-mono uppercase rounded px-2 py-0.5 border-none focus:outline-none cursor-pointer hover:bg-surface-container-high transition-colors"
                  >
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                {/* Dialogue */}
                <textarea
                  value={line.dialogue}
                  onChange={e => onChange(patch<CharacterLine>(lines, line.id, { dialogue: e.target.value }))}
                  placeholder={`"${char?.name ?? 'Character'} speaks..."`}
                  rows={2}
                  className="w-full bg-transparent font-mono text-base text-on-surface/80 placeholder:text-white/15 border-none focus:outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Remove */}
              <button
                type="button"
                onClick={() => remove(line.id)}
                className="opacity-0 group-hover:opacity-100 material-symbols-outlined text-sm text-on-surface-variant hover:text-error transition-all self-start mt-1 flex-shrink-0"
              >close</button>
            </div>
          )
        }

        if (line.type === 'description') {
          return (
            <div
              key={line.id}
              className="flex items-start gap-4 px-6 py-5 border-b border-white/5 hover:bg-surface-container-lowest/20 group transition-colors"
            >
              <span className="material-symbols-outlined text-on-surface-variant text-xl mt-0.5 flex-shrink-0">videocam</span>
              <textarea
                value={line.text}
                onChange={e => onChange(patch<DescriptionLine>(lines, line.id, { text: e.target.value }))}
                placeholder="[ Action or stage direction... ]"
                rows={2}
                className="flex-1 bg-transparent font-mono text-sm italic text-on-surface-variant/70 placeholder:text-white/15 border-none focus:outline-none resize-none leading-relaxed"
              />
              <button
                type="button"
                onClick={() => remove(line.id)}
                className="opacity-0 group-hover:opacity-100 material-symbols-outlined text-sm text-on-surface-variant hover:text-error transition-all self-start mt-1 flex-shrink-0"
              >close</button>
            </div>
          )
        }

        return null
      })}

      {/* ── DROP ZONE + ADD DESCRIPTION ─────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8 m-4 rounded-xl border-2 border-dashed border-white/[0.06] min-h-[100px] text-center">
        <p className="text-white/20 font-mono text-[10px] uppercase tracking-[0.2em]">
          Drop a character here · or add a direction
        </p>
        <button
          type="button"
          onClick={addDescription}
          className="flex items-center gap-2 text-on-surface-variant hover:text-primary text-[10px] font-mono uppercase tracking-widest transition-colors px-4 py-2 rounded-full hover:bg-surface-container-high"
        >
          <span className="material-symbols-outlined text-base">add</span>
          Add Direction
        </button>
      </div>
    </div>
  )
}
