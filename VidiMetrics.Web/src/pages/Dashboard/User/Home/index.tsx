import { useEffect, useState } from 'react'
import { getChannels } from '@/api/channels.service'
import { getVideos } from '@/api/videos.service'
import type { Channel, Video } from '@/api/types'
import ActiveSeries from './components/ActiveSeries'
import GrowthEngine from './components/GrowthEngine'
import AutomatedDistribution from './components/AutomatedDistribution'
import SocialPulse from './components/SocialPulse'
import EngineControls from './components/EngineControls'

export default function UserHome() {
  const [channels, setChannels] = useState<Channel[]>([])
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ch, vids] = await Promise.all([getChannels(), getVideos()])
        setChannels(ch)
        setVideos(vids)
      } catch (err) {
        console.error('Failed to fetch initial data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="space-y-12 pb-20">
      {/* Hero Section */}
      <section className="relative">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse shadow-[0_0_10px_#00f2ff]"></div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent-cyan">System Online</span>
        </div>
        <div className='flex items-center justify-between'>
          <h1 className="text-7xl font-headline font-bold tracking-tight text-white flex items-baseline gap-4">
            Command <span className="text-gradient-purple">Center</span>
          </h1>
          {/* Top Right Status Badges */}
          <div className=" flex gap-4 capitalize">
            <div className="glass-card px-4 py-2 rounded-xl flex items-center gap-3 border border-white/10">
              <div className="w-8 h-8  flex items-center justify-center">
                <span className="material-symbols-outlined text-accent-cyan text-2xl">cloud_done</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black tracking-widest text-white/40">Cloud Nodes</span>
                <span className="text-xs font-bold text-accent-cyan">Active (12)</span>
              </div>
            </div>
            <div className="glass-card px-4 py-2 rounded-xl flex items-center gap-3 border border-white/10">
              <div className="w-8 h-8 flex items-center justify-center">
                <span className="material-symbols-outlined text-accent-pink text-2xl">memory</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black tracking-widest text-white/40">AI Engine</span>
                <span className="text-xs font-bold text-accent-pink">V3.4 Synth</span>
              </div>
            </div>
          </div>
        </div>



      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-8 space-y-12">
          <ActiveSeries />
          <AutomatedDistribution />

        </div>
        <div className="col-span-4 space-y-8">
          <GrowthEngine />
          <SocialPulse />
          <EngineControls />
        </div>
      </div>


    </div>
  )
}
