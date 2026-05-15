import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { useCreateSceneMutation } from '@/store/apis/storyEngine/scenes.api'
import { useGetShowByIdQuery, useGetEpisodeByIdQuery } from '@/store/apis'
import { useGetCharactersLookupQuery } from '@/store/apis/storyEngine/characters.api'
import { useGetEnvironmentsLookupQuery } from '@/store/apis/storyEngine/storyEnvironments.api'
import { LoadingScreen, ErrorScreen } from '@/components/ui/Feedback/StatusScreens'
import { useState, useMemo, useEffect } from 'react'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import ScriptEditor, { ScriptLine, makeId } from './ScriptEditor'

const sceneSchema = z.object({
  order: z.number().min(1, 'Order must be at least 1'),
  visualPrompt: z.string().min(10, 'Visual prompt must be detailed'),
  storyEnvironmentId: z.string().min(1, 'Please select an environment'),
  characterIds: z.array(z.string()).min(1, 'Please select at least one character'),
  mood: z.string().optional(),
})

type SceneFormValues = z.infer<typeof sceneSchema>

const MOODS = ['CYBER-NOIR', 'NEON-RETRO', 'BIO-GLITCH', 'VOID-SILENCE', 'TECHNO-DREAM', 'DUST-WAVE']

export default function SceneSetup() {
  const { showId, episodeId } = useParams<{ showId: string; episodeId: string }>()
  const navigate = useNavigate()
  const [isCharacterPickerOpen, setIsCharacterPickerOpen] = useState(false)
  const [scriptLines, setScriptLines] = useState<ScriptLine[]>([])

  const { data: showResponse, isLoading: isShowLoading } = useGetShowByIdQuery(showId || '')
  const { data: episodeResponse, isLoading: isEpisodeLoading } = useGetEpisodeByIdQuery(episodeId || '')
  const { data: charactersLookupResponse, isLoading: isCharactersLoading } = useGetCharactersLookupQuery(showId)
  const { data: environmentsLookupResponse, isLoading: isEnvironmentsLoading } = useGetEnvironmentsLookupQuery(showId)
  const [createScene, { isLoading: isCreating }] = useCreateSceneMutation()

  const show = showResponse?.data
  const episode = episodeResponse?.data
  const charactersLookup = charactersLookupResponse?.data || []
  const environmentsLookup = environmentsLookupResponse?.data || []

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SceneFormValues>({
    resolver: zodResolver(sceneSchema),
    defaultValues: {
      order: (episode?.scenes?.length || 0) + 1,
      characterIds: [],
      mood: 'CYBER-NOIR',
      visualPrompt: '',
    },
  })

  const selectedEnvironmentId = watch('storyEnvironmentId')
  const selectedCharacterIds = watch('characterIds')
  const selectedMood = watch('mood')

  const selectedEnvironment = useMemo(
    () => environmentsLookup.find(e => e.id === selectedEnvironmentId),
    [environmentsLookup, selectedEnvironmentId]
  )
  const selectedCharacters = useMemo(
    () => charactersLookup.filter(c => selectedCharacterIds.includes(c.id)),
    [charactersLookup, selectedCharacterIds]
  )

  // Sync env line whenever selected environment changes
  useEffect(() => {
    if (!selectedEnvironment) return
    setScriptLines(prev => {
      const envIdx = prev.findIndex(l => l.type === 'env')
      const envLine = { id: envIdx >= 0 ? prev[envIdx].id : makeId(), type: 'env' as const, weather: (prev[envIdx] as any)?.weather ?? '', details: (prev[envIdx] as any)?.details ?? '' }
      if (envIdx >= 0) {
        const next = [...prev]
        next[envIdx] = envLine
        return next
      }
      return [envLine, ...prev]
    })
  }, [selectedEnvironmentId])

  const toggleCharacter = (charId: string) => {
    const current = selectedCharacterIds || []
    if (current.includes(charId)) {
      setValue('characterIds', current.filter(id => id !== charId), { shouldValidate: true })
    } else {
      setValue('characterIds', [...current, charId], { shouldValidate: true })
    }
  }

  const onSubmit = async (values: SceneFormValues) => {
    if (!episodeId) return

    // Validate that at least some script content exists
    const bodyLines = scriptLines.filter(l => l.type !== 'env')
    if (bodyLines.length === 0) {
      toast.error('Script Empty', { description: 'Add at least one character line or direction.' })
      return
    }

    try {
      await createScene({
        ...values,
        episodeId,
        script: JSON.stringify(scriptLines),
      }).unwrap()

      toast.success('Scene Initialized', {
        description: 'Parameters accepted. Neural engine is rendering the storyboard...',
      })

      setTimeout(() => {
        navigate(`/dashboard/series/${showId}/episodes/${episodeId}?tab=Scenes`)
      }, 1500)
    } catch (error: any) {
      toast.error('Initialization Failed', {
        description: error.data?.message || 'System failure during scene creation.',
      })
    }
  }

  if (isShowLoading || isEpisodeLoading || isCharactersLoading || isEnvironmentsLoading)
    return <LoadingScreen message="Syncing Scene Parameters..." accentColor="cyan" />

  if (!show || !episode)
    return <ErrorScreen title="Context Lost" message="Unable to retrieve episode data for scene placement." />

  return (
    <main className="w-full min-h-screen pb-20 animate-fade-in">
      {/* ── Header & Breadcrumbs ─────────────────────────────────────────── */}
      <div className="space-y-4">
        <Breadcrumbs items={[
          { label: 'Home', path: '/' },
          { label: 'Series Library', path: '/dashboard/series' },
          { label: show.title, path: `/dashboard/series/${show.id}` },
          { label: 'Episodes', path: `/dashboard/series/${show.id}?tab=episodes` },
          { label: `E${episode.episodeNumber}. ${episode.title}`, path: `/dashboard/series/${show.id}/episodes/${episode.id}` },
          { label: 'Scenes', path: `/dashboard/series/${show.id}/episodes/${episode.id}?tab=Scenes` },
          { label: 'Scene Setup' },
        ]} />
        <h1 className="font-headline text-5xl font-bold tracking-tight text-white flex items-center gap-3">
          <span className="material-symbols-outlined text-accent-cyan text-5xl">add_to_photos</span>
          Scene <span className="text-accent-cyan">Setup</span>
        </h1>
        <p className="text-white/60 font-body text-lg">Define the sequence, environment, and cast for this narrative segment.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-12 gap-8 mt-8">

        {/* ── Script Editor Column ─────────────────────────────────────────── */}
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

          {/* AI Prompt Translation */}
          <section className="glass-panel ghost-border rounded-lg p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 h-full light-beam opacity-30" />
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              <h2 className="font-headline text-xl font-bold uppercase tracking-widest">AI Prompt Translation</h2>
            </div>
            <div className="bg-surface-container-lowest/50 p-6 rounded-md ghost-border">
              <textarea
                {...register('visualPrompt')}
                className="w-full bg-transparent border-none focus:ring-0 font-mono text-sm leading-relaxed text-secondary/80 resize-none min-h-[100px] placeholder:text-white/10"
                placeholder="Cinematic wide shot, Neo-Kyoto rooftop at night, torrential hyper-realistic rain..."
              />
            </div>
            {errors.visualPrompt && <p className="mt-2 text-error text-[10px] uppercase tracking-wider">{errors.visualPrompt.message}</p>}
          </section>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 py-4 rounded-lg font-bold tracking-widest uppercase text-[10px] text-white/60 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
              disabled={isCreating}
            >
              Abort
            </button>
            <button
              type="submit"
              className="flex-[2] py-4 bg-gradient-to-r from-accent-cyan/80 to-secondary rounded-lg font-bold tracking-widest uppercase text-[10px] text-white shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 hover:shadow-secondary/30 transition-all border border-white/10"
              disabled={isCreating}
            >
              {isCreating ? (
                <><span className="material-symbols-outlined animate-spin text-base">autorenew</span> Processing...</>
              ) : (
                <><span className="material-symbols-outlined text-base">rocket_launch</span> Initialize Scene</>
              )}
            </button>
          </div>
        </div>

        {/* ── Configuration Panel Column ───────────────────────────────────── */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">

          {/* Environment Config */}
          <div className="glass-panel ghost-border rounded-lg p-6">
            <h3 className="font-headline text-label-md uppercase tracking-widest text-on-surface-variant mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">landscape</span>
              Environment Selection
            </h3>
            <div className="relative mb-2 group">
              <div className="w-full h-40 rounded-md overflow-hidden mb-4 ghost-border bg-surface-container-lowest flex items-center justify-center">
                {selectedEnvironment?.imageUrl
                  ? <img src={selectedEnvironment.imageUrl} alt={selectedEnvironment.name} className="w-full h-full object-cover" />
                  : <span className="material-symbols-outlined text-white/10 text-5xl">image</span>
                }
              </div>
              <div className="relative">
                <select
                  {...register('storyEnvironmentId')}
                  className="w-full bg-surface-container-lowest border-none rounded-md text-on-surface py-3 px-4 ghost-border appearance-none focus:ring-2 focus:ring-secondary/20 cursor-pointer"
                >
                  <option value="" disabled>Select Location...</option>
                  {environmentsLookup.map(env => (
                    <option key={env.id} value={env.id}>{env.name}</option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
              </div>
            </div>
            {errors.storyEnvironmentId && <p className="text-error text-[10px] uppercase tracking-wider mt-2">{errors.storyEnvironmentId.message}</p>}
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
                    {char.imageUrl
                      ? <img src={char.imageUrl} alt={char.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center bg-surface-container-highest">
                        <span className="material-symbols-outlined text-white/20">person</span>
                      </div>
                    }
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-on-surface">{char.name}</p>
                    <p className="text-[10px] text-secondary uppercase tracking-widest flex items-center gap-1">
                      <span className="material-symbols-outlined text-[10px]">drag_indicator</span>
                      Drag to script
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleCharacter(char.id)}
                    className="material-symbols-outlined text-on-surface-variant hover:text-error transition-colors"
                  >remove_circle</button>
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
                        className={`relative group aspect-square rounded-lg overflow-hidden border-2 transition-all ${isSelected ? 'border-primary shadow-[0_0_10px_rgba(221,183,255,0.4)]' : 'border-white/5 grayscale hover:grayscale-0'}`}
                      >
                        {char.imageUrl
                          ? <img src={char.imageUrl} alt={char.name} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center bg-surface-container-highest">
                            <span className="material-symbols-outlined text-white/20">person</span>
                          </div>
                        }
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
            {errors.characterIds && <p className="text-error text-[10px] uppercase tracking-wider">{errors.characterIds.message}</p>}
          </div>




        </div>

      </form>
    </main>
  )
}
