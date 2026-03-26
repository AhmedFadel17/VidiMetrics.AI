import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import { getChannels } from '../api/channels.service'
import { getVideos } from '../api/videos.service'
import type { Channel, Video } from '../api/types'

export default function Dashboard() {
  const [channels, setChannels] = useState<Channel[]>([])
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ch, vids] = await Promise.all([getChannels(), getVideos()])
        setChannels(ch)
        setVideos(vids)
      } catch (err) {
        setError('Failed to connect to the API. Make sure the backend project is running.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="flex min-h-screen bg-background text-on-surface">
      <Sidebar />
      
      <main className="ml-64 p-8 flex-1 flex flex-col">
        {/* Header */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-5xl font-headline font-bold tracking-tight leading-none mb-2">Creator Hub</h2>
            <p className="text-on-surface-variant text-lg">Your cinematic data narrative for today.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              <div className="w-8 h-8 rounded-full border-2 border-background bg-secondary/20 flex items-center justify-center text-[10px] font-bold">YT</div>
              <div className="w-8 h-8 rounded-full border-2 border-background bg-tertiary/20 flex items-center justify-center text-[10px] font-bold">IG</div>
              <div className="w-8 h-8 rounded-full border-2 border-background bg-primary/20 flex items-center justify-center text-[10px] font-bold">TK</div>
            </div>
            <button className="px-5 py-2.5 rounded-lg border border-outline-variant/30 glass-panel text-sm font-medium hover:bg-surface-variant/50 transition-colors">
              Export Report
            </button>
          </div>
        </header>

        {error && (
          <div className="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-lg mb-8 flex items-center gap-3">
            <span className="material-symbols-outlined">warning</span>
            {error}
          </div>
        )}

        {/* Metrics Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          {/* Channels Count */}
          <div className="lg:col-span-2 bg-surface-container-low rounded-xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 blur-[60px] rounded-full -mr-10 -mt-10"></div>
            <div className="relative z-10">
              <header className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-secondary">Active Channels</span>
                <span className="text-secondary flex items-center text-xs bg-secondary/10 px-2 py-0.5 rounded-full font-bold">
                  API Connected <span className="material-symbols-outlined text-xs ml-1">sync</span>
                </span>
              </header>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-headline font-bold">{loading ? '...' : channels.length}</span>
              </div>
              {/* Mock visualization */}
              <div className="h-24 w-full flex items-end gap-1">
                {[40, 60, 35, 75, 90, 55, 85].map((h, i) => (
                  <div key={i} className="flex-1 bg-secondary/20 rounded-t-sm group-hover:bg-secondary/40 transition-all duration-500" style={{ height: `${h}%` }}></div>
                ))}
              </div>
            </div>
          </div>

          {/* Videos Count */}
          <div className="bg-surface-container-high rounded-xl p-6 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Library</span>
              <h3 className="text-3xl font-headline font-bold mt-2">{loading ? '...' : videos.length} Videos</h3>
            </div>
            <div className="mt-4 pt-4 border-t border-outline-variant/10">
              <div className="flex justify-between text-[10px] text-on-surface-variant mb-1 uppercase tracking-widest font-bold">
                Synced Content
              </div>
              <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[100%] shadow-[0_0_12px_rgba(221,183,255,0.5)]"></div>
              </div>
            </div>
          </div>

          {/* Engagement Placeholder */}
          <div className="bg-surface-container-high rounded-xl p-6 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-on-tertiary-container">Engagement</span>
              <h3 className="text-3xl font-headline font-bold mt-2">Active</h3>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full border-2 border-surface-container-high bg-tertiary-container"></div>
                <div className="w-6 h-6 rounded-full border-2 border-surface-container-high bg-primary-container"></div>
                <div className="w-6 h-6 rounded-full border-2 border-surface-container-high bg-secondary-container"></div>
              </div>
              <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Real-time stats</span>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Linked Channels Column */}
          <section className="lg:col-span-4 space-y-6">
            <h3 className="text-xl font-headline font-bold flex items-center gap-2">
              Recent Channels
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            </h3>
            <div className="space-y-4">
              {channels.slice(0, 3).map(ch => (
                <div key={ch.id} className="bg-surface-container-low p-5 rounded-xl flex items-center justify-between group cursor-pointer hover:bg-surface-container-high transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary">smart_display</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{ch.name}</h4>
                      <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Connected</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">chevron_right</span>
                </div>
              ))}
              <button className="w-full py-6 border-2 border-dashed border-outline-variant/20 rounded-xl flex flex-col items-center justify-center gap-2 text-on-surface-variant hover:border-primary/40 hover:text-primary transition-all group">
                <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <span className="material-symbols-outlined">add</span>
                </div>
                <span className="text-xs font-bold uppercase tracking-widest">Connect YouTube Channel</span>
              </button>
            </div>
          </section>

          {/* Videos Feed Column */}
          <section className="lg:col-span-8 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-headline font-bold">Recent Content</h3>
              <a className="text-primary text-xs font-bold uppercase tracking-widest hover:underline" href="#">View All</a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {videos.length === 0 && <p className="text-on-surface-variant text-sm italic">No videos currently indexed.</p>}
              {videos.slice(0, 4).map(v => (
                <div key={v.id} className="bg-surface-container-low rounded-xl overflow-hidden group border border-transparent hover:border-primary/20 transition-all">
                  <div className="h-40 overflow-hidden relative bg-surface-container-highest">
                    {v.thumbnailUrl ? (
                      <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src={v.thumbnailUrl} alt={v.title} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-on-surface-variant/20 italic text-xs">No Preview</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low to-transparent opacity-80"></div>
                  </div>
                  <div className="p-5">
                    <h4 className="font-bold text-lg truncate mb-1">{v.title}</h4>
                    <p className="text-sm text-on-surface-variant line-clamp-1 mb-4">{v.description || 'No description available.'}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-xs text-secondary">history</span>
                        <span className="text-[10px] font-bold uppercase text-secondary">Analyzed</span>
                      </div>
                      <button className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center hover:bg-primary transition-colors hover:text-on-primary">
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
        
        <footer className="mt-auto pt-16 border-t border-on-surface-variant/5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col gap-2">
              <span className="font-headline text-primary font-bold text-lg tracking-tight">VidiMetrics.Ai</span>
              <span className="text-xs uppercase tracking-widest text-on-surface-variant/40">© 2024 VidiMetrics.Ai. The Cinematic Observer.</span>
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              <a className="text-xs uppercase tracking-widest text-on-surface-variant/40 hover:text-primary transition-colors" href="#">Terms</a>
              <a className="text-xs uppercase tracking-widest text-on-surface-variant/40 hover:text-primary transition-colors" href="#">Privacy</a>
              <a className="text-xs uppercase tracking-widest text-on-surface-variant/40 hover:text-primary transition-colors" href="#">Support</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
