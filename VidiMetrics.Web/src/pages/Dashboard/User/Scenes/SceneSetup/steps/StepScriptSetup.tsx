import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Lookup } from '@/types/api'
import { useCreateAiScriptMutation } from '@/store/apis/ai/aiScripts.api'
import ScriptEditor, { ScriptLine, makeId } from '../components/ScriptEditor'

interface StepScriptSetupProps {
  environmentsLookup: Lookup[]
  charactersLookup: Lookup[]
  onNext: (scriptId: string, visualPrompt: string, characterIds: string[], environmentId: string) => void
  initialScriptLines?: ScriptLine[]
  initialEnvironmentId?: string
  initialCharacterIds?: string[]
}

export default function StepScriptSetup({
  environmentsLookup,
  charactersLookup,
  onNext,
  initialScriptLines = [],
  initialEnvironmentId = '',
  initialCharacterIds = [],
}: StepScriptSetupProps) {
  const navigate = useNavigate()
  const [createAiScript, { isLoading: isCreating }] = useCreateAiScriptMutation()

  const [scriptLines, setScriptLines] = useState<ScriptLine[]>(initialScriptLines)
  const [selectedEnvironmentId, setSelectedEnvironmentId] = useState<string>(initialEnvironmentId)
  const [selectedCharacterIds, setSelectedCharacterIds] = useState<string[]>(initialCharacterIds)
  const [isCharacterPickerOpen, setIsCharacterPickerOpen] = useState(false)

  const selectedEnvironment = useMemo(
    () => environmentsLookup.find(e => e.id === selectedEnvironmentId),
    [environmentsLookup, selectedEnvironmentId]
  )

  const selectedCharacters = useMemo(
    () => charactersLookup.filter(c => selectedCharacterIds.includes(c.id)),
    [charactersLookup, selectedCharacterIds]
  )

  // Sync env line when environment selection changes
  useEffect(() => {
    if (!selectedEnvironmentId) return
    setScriptLines(prev => {
      const envIdx = prev.findIndex(l => l.type === 'env')
      const envLine = {
        id: envIdx >= 0 ? prev[envIdx].id : makeId(),
        type: 'env' as const,
        weather: envIdx >= 0 ? (prev[envIdx] as any).weather || '' : '',
        details: envIdx >= 0 ? (prev[envIdx] as any).details || '' : '',
      }
      if (envIdx >= 0) {
        const next = [...prev]
        next[envIdx] = envLine
        return next
      }
      return [envLine, ...prev]
    })
  }, [selectedEnvironmentId])

  const toggleCharacter = (charId: string) => {
    if (selectedCharacterIds.includes(charId)) {
      setSelectedCharacterIds(prev => prev.filter(id => id !== charId))
    } else {
      setSelectedCharacterIds(prev => [...prev, charId])
    }
  }

  const handleNext = async () => {
    if (!selectedEnvironmentId) {
      toast.error('Environment Missing', { description: 'Please select a story environment context.' })
      return
    }
    if (selectedCharacterIds.length === 0) {
      toast.error('Cast Missing', { description: 'Please assign at least one character to the scene roster.' })
      return
    }

    const envLine = scriptLines.find(l => l.type === 'env')
    const bodyLines = scriptLines.filter(l => l.type !== 'env')
    if (bodyLines.length === 0) {
      toast.error('Script Empty', { description: 'Add at least one character dialogue or description line.' })
      return
    }

    // Prepare backend-compatible DTO fields
    const weather = envLine && 'weather' in envLine ? envLine.weather : 'Clear Sky'
    const environmentDescription = envLine && 'details' in envLine ? envLine.details : 'Atmospheric'

    const scriptLinesDto = scriptLines
      .filter(l => l.type !== 'env')
      .map((l, idx) => ({
        sequence: idx + 1,
        type: l.type === 'character' ? 0 : 1, // 0: Character (Dialogue), 1: ActionDescription
        characterId: l.type === 'character' ? (l as any).characterId : undefined,
        characterStatus: l.type === 'character' ? (l as any).status || 'Speaking' : '',
        content: l.type === 'character' ? (l as any).dialogue || '' : (l as any).text || '',
      }))

    try {
      const response = await createAiScript({
        storyEnvironmentId: selectedEnvironmentId,
        weather: weather || 'Clear Sky',
        environmentDescription: environmentDescription || 'Atmospheric',
        characterIds: selectedCharacterIds,
        scriptLines: scriptLinesDto,
      }).unwrap()

      if (response?.data) {
        toast.success('Script Saved', { description: 'Your scene script has been compiled and visual prompt is generated.' })
        onNext(response.data.id, response.data.visualPrompt, selectedCharacterIds, selectedEnvironmentId)
      }
    } catch (err: any) {
      toast.error('Script Compilation Failed', { description: err.data?.message || 'Error occurred while validating script backend.' })
    }
  }

  return (
    <div className="grid grid-cols-12 gap-8 animate-fade-in">
      {/* Script Editor Column */}
      <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
        <div className="glass-panel ghost-border rounded-lg overflow-hidden flex flex-col min-h-[600px]">
          {/* Toolbar */}
          <div className="bg-surface-container-low px-6 py-4 flex justify-between items-center border-b border-white/5">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">edit_note</span>
              <span className="font-headline text-lg font-medium">Cinematic Script Editor</span>
            </div>
            <div className="flex gap-3 items-center">
              <span className="px-3 py-1 bg-surface-container-highest rounded text-[10px] font-mono text-secondary">
                FORMAT: V-SCENE 1.0
              </span>
              <span className="px-3 py-1 bg-surface-container-highest rounded text-[10px] font-mono text-on-surface-variant">
                {scriptLines.filter(l => l.type !== 'env').length} LINES
              </span>
            </div>
          </div>

          {/* Script editor body */}
          <ScriptEditor
            lines={scriptLines}
            environment={selectedEnvironment}
            characters={charactersLookup}
            onChange={setScriptLines}
          />
        </div>

        {/* Step Navigation */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 py-4 rounded-lg font-bold tracking-widest uppercase text-[10px] text-white/60 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
          >
            Abort
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={isCreating}
            className="flex-[2] py-4 bg-gradient-to-r from-accent-cyan/80 to-secondary rounded-lg font-bold tracking-widest uppercase text-[10px] text-white shadow-lg flex items-center justify-center gap-3 hover:shadow-secondary/30 transition-all border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? (
              <>
                <span className="material-symbols-outlined animate-spin text-base">autorenew</span>
                Compiling Script Assets...
              </>
            ) : (
              <>
                Next: Preview Prompt <span className="material-symbols-outlined text-base">arrow_forward</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Configuration Panel Column */}
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
        {/* Environment Config */}
        <div className="glass-panel ghost-border rounded-lg p-6">
          <h3 className="font-headline text-label-md uppercase tracking-widest text-on-surface-variant mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">landscape</span>
            Environment Selection
          </h3>
          <div className="relative mb-2 group">
            <div className="w-full h-40 rounded-md overflow-hidden mb-4 ghost-border bg-surface-container-lowest flex items-center justify-center">
              {selectedEnvironment?.imageUrl ? (
                <img src={selectedEnvironment.imageUrl} alt={selectedEnvironment.name} className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-white/10 text-5xl">image</span>
              )}
            </div>
            <div className="relative">
              <select
                value={selectedEnvironmentId}
                onChange={e => setSelectedEnvironmentId(e.target.value)}
                className="w-full bg-surface-container-lowest border-none rounded-md text-on-surface py-3 px-4 ghost-border appearance-none focus:ring-2 focus:ring-secondary/20 cursor-pointer text-sm"
              >
                <option value="" disabled>Select Location...</option>
                {environmentsLookup.map(env => (
                  <option key={env.id} value={env.id}>{env.name}</option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
            </div>
          </div>
        </div>

        {/* Characters Config */}
        <div className="glass-panel ghost-border rounded-lg p-6 flex flex-col gap-4">
          <h3 className="font-headline text-label-md uppercase tracking-widest text-on-surface-variant mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">groups</span>
            Character Roster ({selectedCharacterIds.length}/{charactersLookup.length})
          </h3>

          {/* Selected Characters */}
          <div className="flex flex-col gap-3">
            {selectedCharacters.map(char => (
              <div
                key={char.id}
                draggable
                onDragStart={e => e.dataTransfer.setData('characterId', char.id)}
                className="flex items-center gap-4 bg-surface-container-low p-3 rounded-md ghost-border group hover:bg-surface-container-high transition-colors cursor-grab active:cursor-grabbing"
                title="Drag into the script editor to add a line"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-secondary/50">
                  {char.imageUrl ? (
                    <img src={char.imageUrl} alt={char.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-surface-container-highest">
                      <span className="material-symbols-outlined text-white/20">person</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm text-on-surface">{char.name}</p>
                  <p className="text-[10px] text-secondary uppercase tracking-widest flex items-center gap-1">
                    <span className="material-symbols-outlined text-[10px]">drag_indicator</span>
                    Drag to script
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleCharacter(char.id)}
                  className="material-symbols-outlined text-on-surface-variant hover:text-error transition-colors"
                >
                  remove_circle
                </button>
              </div>
            ))}
          </div>

          {/* Assign characters */}
          <div className="mt-2">
            <button
              type="button"
              onClick={() => setIsCharacterPickerOpen(!isCharacterPickerOpen)}
              className="w-full border-2 border-dashed border-outline-variant/30 py-4 rounded-md text-on-surface-variant hover:border-primary/50 hover:text-primary transition-all flex items-center justify-center gap-2 text-sm font-bold"
            >
              <span className="material-symbols-outlined">{isCharacterPickerOpen ? 'close' : 'add_circle'}</span>
              {isCharacterPickerOpen ? 'Done Selecting' : 'Assign New Character'}
            </button>

            {isCharacterPickerOpen && (
              <div className="grid grid-cols-4 gap-2 mt-4 p-4 bg-surface-container-lowest rounded-lg ghost-border max-h-60 overflow-y-auto">
                {charactersLookup.map(char => {
                  const isSelected = selectedCharacterIds.includes(char.id)
                  return (
                    <button
                      key={char.id}
                      type="button"
                      onClick={() => toggleCharacter(char.id)}
                      title={char.name}
                      className={`relative group aspect-square rounded-lg overflow-hidden border-2 transition-all ${isSelected
                        ? 'border-primary shadow-[0_0_10px_rgba(221,183,255,0.4)]'
                        : 'border-white/5 grayscale hover:grayscale-0'
                        }`}
                    >
                      {char.imageUrl ? (
                        <img src={char.imageUrl} alt={char.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-surface-container-highest">
                          <span className="material-symbols-outlined text-white/20">person</span>
                        </div>
                      )}
                      {isSelected && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <span className="material-symbols-outlined text-white text-lg">check_circle</span>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
