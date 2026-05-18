import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import { useGetShowByIdQuery, useGetEpisodeByIdQuery } from '@/store/apis'
import { useGetCharactersLookupQuery } from '@/store/apis/storyEngine/characters.api'
import { useGetEnvironmentsLookupQuery } from '@/store/apis/storyEngine/storyEnvironments.api'
import { LoadingScreen, ErrorScreen } from '@/components/ui/Feedback/StatusScreens'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import { ScriptLine } from './components/ScriptEditor'

// Wizard Step Components
import StepScriptSetup from './steps/StepScriptSetup'
import StepPromptPreview from './steps/StepPromptPreview'
import StepVideoPreview from './steps/StepVideoPreview'

export default function SceneSetup() {
  const { showId, episodeId } = useParams<{ showId: string; episodeId: string }>()
  const navigate = useNavigate()

  // Master Step Orchestrator State
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)

  // Step 1 to Step 2 Shared State
  const [scriptId, setScriptId] = useState<string>('')
  const [visualPrompt, setVisualPrompt] = useState<string>('')
  const [selectedCharacterIds, setSelectedCharacterIds] = useState<string[]>([])
  const [selectedEnvironmentId, setSelectedEnvironmentId] = useState<string>('')
  const [scriptLines, setScriptLines] = useState<ScriptLine[]>([])

  // Step 2 to Step 3 Shared State
  const [videoId, setVideoId] = useState<string>('')
  const [mood, setMood] = useState<string>('CYBER-NOIR')
  const [order, setOrder] = useState<number>(1)

  // Context Queries
  const { data: showResponse, isLoading: isShowLoading } = useGetShowByIdQuery(showId || '')
  const { data: episodeResponse, isLoading: isEpisodeLoading } = useGetEpisodeByIdQuery(episodeId || '')
  const { data: charactersLookupResponse, isLoading: isCharactersLoading } = useGetCharactersLookupQuery(showId)
  const { data: environmentsLookupResponse, isLoading: isEnvironmentsLoading } = useGetEnvironmentsLookupQuery(showId)

  const show = showResponse?.data
  const episode = episodeResponse?.data
  const charactersLookup = charactersLookupResponse?.data || []
  const environmentsLookup = environmentsLookupResponse?.data || []

  if (isShowLoading || isEpisodeLoading || isCharactersLoading || isEnvironmentsLoading) {
    return <LoadingScreen message="Syncing Scene Parameters..." accentColor="cyan" />
  }

  if (!show || !episode) {
    return <ErrorScreen title="Context Lost" message="Unable to retrieve episode data for scene placement." />
  }

  const selectedEnvironment = environmentsLookup.find(e => e.id === selectedEnvironmentId)
  const selectedCharacters = charactersLookup.filter(c => selectedCharacterIds.includes(c.id))

  const handleStep1Complete = (
    newScriptId: string,
    newVisualPrompt: string,
    charIds: string[],
    envId: string
  ) => {
    setScriptId(newScriptId)
    setVisualPrompt(newVisualPrompt)
    setSelectedCharacterIds(charIds)
    setSelectedEnvironmentId(envId)
    setCurrentStep(2)
  }

  const handleStep2Complete = (newVideoId: string, selectedMood: string, sceneOrder: number) => {
    setVideoId(newVideoId)
    setMood(selectedMood)
    setOrder(sceneOrder)
    setCurrentStep(3)
  }

  return (
    <main className="w-full min-h-screen pb-20 animate-fade-in font-body text-white">
      {/* ── Header & Breadcrumbs ─────────────────────────────────────────── */}
      <div className="space-y-4">
        <Breadcrumbs items={[
          { label: 'Home', path: '/' },
          { label: 'Series Library', path: '/dashboard/series' },
          { label: show.title, path: `/dashboard/series/${show.id}` },
          { label: 'Episodes', path: `/dashboard/series/${show.id}?tab=episodes` },
          { label: `E${episode.episodeNumber}. ${episode.title}`, path: `/dashboard/series/${show.id}/episodes/${episode.id}` },
          { label: 'Scenes', path: `/dashboard/series/${show.id}/episodes/${episode.id}?tab=Scenes` },
          { label: `Scene Setup — Step ${currentStep} of 3` },
        ]} />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-headline text-5xl font-bold tracking-tight text-white flex items-center gap-3">
              <span className="material-symbols-outlined text-accent-cyan text-5xl">add_to_photos</span>
              Scene <span className="text-accent-cyan">Setup</span>
            </h1>
            <p className="text-white/60 text-lg mt-1">Define the sequence, environment, and cast for this narrative segment.</p>
          </div>

          {/* Stepper progress indicator */}
          <div className="flex items-center gap-2 bg-surface-container-low/60 ghost-border px-5 py-3 rounded-full self-start md:self-auto">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-mono text-xs font-bold border transition-all ${currentStep >= 1 ? 'bg-accent-cyan/20 border-accent-cyan text-accent-cyan shadow-[0_0_10px_rgba(34,211,238,0.2)]' : 'border-white/10 text-white/40'}`}>1</div>
            <div className={`w-8 h-0.5 transition-all ${currentStep >= 2 ? 'bg-accent-cyan' : 'bg-white/10'}`} />
            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-mono text-xs font-bold border transition-all ${currentStep >= 2 ? 'bg-accent-cyan/20 border-accent-cyan text-accent-cyan shadow-[0_0_10px_rgba(34,211,238,0.2)]' : 'border-white/10 text-white/40'}`}>2</div>
            <div className={`w-8 h-0.5 transition-all ${currentStep >= 3 ? 'bg-accent-cyan' : 'bg-white/10'}`} />
            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-mono text-xs font-bold border transition-all ${currentStep >= 3 ? 'bg-accent-cyan/20 border-accent-cyan text-accent-cyan shadow-[0_0_10px_rgba(34,211,238,0.2)]' : 'border-white/10 text-white/40'}`}>3</div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        {/* Step 1: Script & Cast & Environment Setup */}
        {currentStep === 1 && (
          <StepScriptSetup
            environmentsLookup={environmentsLookup}
            charactersLookup={charactersLookup}
            onNext={handleStep1Complete}
            initialScriptLines={scriptLines}
            initialEnvironmentId={selectedEnvironmentId}
            initialCharacterIds={selectedCharacterIds}
          />
        )}

        {/* Step 2: Prompt Translation Preview & Generation Trigger */}
        {currentStep === 2 && (
          <StepPromptPreview
            scriptId={scriptId}
            visualPrompt={visualPrompt}
            environmentName={selectedEnvironment?.name}
            environmentAtmosphere={selectedEnvironment?.atmosphere}
            castNames={selectedCharacters.map(c => c.name)}
            initialMood={mood}
            initialOrder={order}
            onBack={() => setCurrentStep(1)}
            onNext={handleStep2Complete}
          />
        )}

        {/* Step 3: Neural Video Rendering & Finalization */}
        {currentStep === 3 && (
          <StepVideoPreview
            videoId={videoId}
            scriptId={scriptId}
            episodeId={episodeId || ''}
            showId={showId || ''}
            characterIds={selectedCharacterIds}
            environmentName={selectedEnvironment?.name}
            mood={mood}
            order={order}
            onBackToPrompt={() => setCurrentStep(2)}
          />
        )}
      </div>
    </main>
  )
}