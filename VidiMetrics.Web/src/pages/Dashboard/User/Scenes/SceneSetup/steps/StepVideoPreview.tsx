import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useGetAiVideoByIdQuery } from '@/store/apis/ai/aiVideos.api'
import { useCreateSceneMutation } from '@/store/apis/storyEngine/scenes.api'

interface StepVideoPreviewProps {
  videoId: string
  scriptId: string
  episodeId: string
  showId: string
  characterIds: string[]
  environmentName?: string
  name: string
  order: number
  onBackToPrompt: () => void
}

export default function StepVideoPreview({
  videoId,
  scriptId,
  episodeId,
  showId,
  characterIds,
  environmentName = 'unknown',
  name,
  order,
  onBackToPrompt,
}: StepVideoPreviewProps) {
  const navigate = useNavigate()
  const { data: videoResponse, isLoading: isVideoLoading } = useGetAiVideoByIdQuery(videoId)
  const [createScene, { isLoading: isCreatingScene }] = useCreateSceneMutation()

  const [renderProgress, setRenderProgress] = useState(0)
  const [renderStage, setRenderStage] = useState('Initializing neural feed...')

  const video = videoResponse?.data

  // Simulate rendering progress
  useEffect(() => {
    setRenderProgress(0)
    setRenderStage('Deconstructing narrative script...')

    const interval = setInterval(() => {
      setRenderProgress(prev => {
        const next = prev + Math.floor(Math.random() * 15) + 5
        if (next >= 100) {
          clearInterval(interval)
          setRenderStage('Cinematic sequence ready.')
          return 100
        }

        if (next < 25) setRenderStage('Deconstructing narrative script...')
        else if (next < 50) setRenderStage('Synthesizing environment geometry...')
        else if (next < 75) setRenderStage('Generating character neural behaviors...')
        else setRenderStage('Compiling cinematic frame buffer...')

        return next
      })
    }, 300)

    return () => clearInterval(interval)
  }, [videoId])

  const handleApproveSave = async () => {
    try {
      await createScene({
        order: order,
        name: name,
        episodeId: episodeId,
        characterIds: characterIds,
        aiScriptId: scriptId,
        aiVideoId: videoId,
      }).unwrap()

      toast.success('Scene Registered Successfully', {
        description: 'Visual scene has been locked and appended to the cinematic sequence.',
      })

      // Redirect back to the episode page with scenes tab selected
      navigate(`/dashboard/series/${showId}/episodes/${episodeId}?tab=Scenes`)
    } catch (err: any) {
      toast.error('Failed to Save Scene', {
        description: err.data?.message || 'Error occurred while saving finalized scene.',
      })
    }
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {renderProgress < 100 || isVideoLoading ? (
        /* Simulated Rendering Loader Screen */
        <div className="glass-panel ghost-border rounded-xl p-12 text-center flex flex-col items-center justify-center min-h-[450px] relative overflow-hidden">
          {/* Neon backdrop effects */}
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-accent-cyan/10 blur-[100px] animate-pulse pointer-events-none" />
          <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-secondary/10 blur-[100px] animate-pulse pointer-events-none" />

          <div className="relative mb-8">
            <div className="w-24 h-24 rounded-full border-4 border-dashed border-accent-cyan animate-spin flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.2)]">
              <span className="material-symbols-outlined text-4xl text-accent-cyan animate-pulse">auto_awesome</span>
            </div>
          </div>

          <h2 className="font-headline text-2xl font-bold uppercase tracking-widest text-white mb-2">
            Rendering Neural Sequence
          </h2>
          <p className="text-secondary font-mono text-sm tracking-widest uppercase mb-8">
            {renderStage}
          </p>

          {/* Progress bar */}
          <div className="w-full max-w-md bg-surface-container-lowest h-2.5 rounded-full overflow-hidden ghost-border p-[2px]">
            <div
              className="h-full bg-gradient-to-r from-accent-cyan via-primary to-secondary rounded-full shadow-[0_0_12px_rgba(221,183,255,0.4)] transition-all duration-300"
              style={{ width: `${renderProgress}%` }}
            />
          </div>
          <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest mt-3">
            {renderProgress}% COMPLETED
          </span>
        </div>
      ) : (
        /* Final Rendered Video Player and actions */
        <div className="space-y-8 animate-scale-up">
          <div className="glass-panel ghost-border rounded-xl overflow-hidden shadow-2xl relative">
            {/* Cyberpunk Video frame backdrop */}
            <div className="aspect-video w-full bg-surface-container-lowest flex items-center justify-center relative group">
              <video
                autoPlay
                loop
                muted
                controls
                playsInline
                className="w-full h-full object-cover transition-opacity duration-500 hover:opacity-90"
                src={video?.videoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-cyberpunk-computer-hacker-screen-40742-large.mp4'}
              />
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded border border-accent-cyan/30 text-[10px] font-mono text-accent-cyan tracking-wider flex items-center gap-1.5 uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-ping" />
                Neural Sequence Rendered
              </div>
            </div>

            {/* Scene properties overlay */}
            <div className="p-6 bg-surface-container-low border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-headline text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">movie</span>
                  Scene Sequence #{order}
                </h3>
                <p className="text-white/60 text-xs mt-1 italic font-mono max-w-md line-clamp-1">
                  Video UUID: {video?.id}
                </p>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1.5 bg-secondary/15 rounded text-[10px] font-mono font-bold text-secondary uppercase border border-secondary/20">
                  {name}
                </span>
                <span className="px-3 py-1.5 bg-accent-cyan/15 rounded text-[10px] font-mono font-bold text-accent-cyan uppercase border border-accent-cyan/20">
                  {environmentName}
                </span>
              </div>
            </div>
          </div>

          {/* Final step navigation options */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={onBackToPrompt}
              className="flex-1 py-4 bg-surface-container-high/40 hover:bg-surface-container-high/70 border border-white/10 rounded-lg font-bold tracking-widest uppercase text-[10px] text-white/80 hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">autorenew</span> Remake / Adjust Prompt
            </button>
            <button
              type="button"
              onClick={handleApproveSave}
              disabled={isCreatingScene}
              className="flex-[2] py-4 bg-gradient-to-r from-accent-cyan/80 to-secondary rounded-lg font-bold tracking-widest uppercase text-[10px] text-white shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 hover:shadow-secondary/30 transition-all border border-white/10"
            >
              {isCreatingScene ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-base">autorenew</span>
                  Saving Scene Context...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">check_circle</span> Approve & Save Scene
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
