import { useEffect, useState } from 'react'
import { getChannels } from '../api/channels.service'
import { getVideos } from '../api/videos.service'
import type { Channel, Video } from '../api/types'
import styles from './Dashboard.module.css'

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
        setError('Failed to connect to the API. Make sure the backend is running.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className={styles.layout}>
      {/* ── Sidebar ──────────────────────────────── */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>▶</span>
          <span className={styles.logoText}>VidiMetrics<span>.AI</span></span>
        </div>
        <nav className={styles.nav}>
          <a href="/" className={`${styles.navItem} ${styles.active}`}>
            <span>⊞</span> Dashboard
          </a>
          <a href="/channels" className={styles.navItem}>
            <span>📡</span> Channels
          </a>
          <a href="/videos" className={styles.navItem}>
            <span>🎬</span> Videos
          </a>
          <a href="/playlists" className={styles.navItem}>
            <span>📋</span> Playlists
          </a>
        </nav>
      </aside>

      {/* ── Main ─────────────────────────────────── */}
      <main className={styles.main}>
        {/* Header */}
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Dashboard</h1>
            <p className={styles.subtitle}>Overview of your video analytics</p>
          </div>
          <div className={styles.badge}>
            <span className={styles.dot} />
            API Connected
          </div>
        </header>

        {/* Loading / Error */}
        {loading && (
          <div className={styles.center}>
            <div className={styles.spinner} />
            <p className={styles.loadingText}>Fetching data from API…</p>
          </div>
        )}

        {error && (
          <div className={styles.errorBanner}>
            <span>⚠</span> {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Stat cards */}
            <div className={styles.stats}>
              <div className={styles.statCard}>
                <p className={styles.statLabel}>Total Channels</p>
                <p className={styles.statValue}>{channels.length}</p>
                <div className={`${styles.statBar} ${styles.barPrimary}`} />
              </div>
              <div className={styles.statCard}>
                <p className={styles.statLabel}>Total Videos</p>
                <p className={styles.statValue}>{videos.length}</p>
                <div className={`${styles.statBar} ${styles.barAccent}`} />
              </div>
              <div className={styles.statCard}>
                <p className={styles.statLabel}>API Status</p>
                <p className={`${styles.statValue} ${styles.statusOk}`}>Online</p>
                <div className={`${styles.statBar} ${styles.barSuccess}`} />
              </div>
            </div>

            {/* Channels list */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Channels</h2>
                <span className={styles.count}>{channels.length}</span>
              </div>
              {channels.length === 0 ? (
                <p className={styles.empty}>No channels found. Add one via the API.</p>
              ) : (
                <div className={styles.grid}>
                  {channels.map((ch) => (
                    <div key={ch.id} className={styles.card}>
                      <div className={styles.cardIcon}>📡</div>
                      <div className={styles.cardBody}>
                        <h3 className={styles.cardTitle}>{ch.name}</h3>
                        <p className={styles.cardDesc}>{ch.description || 'No description'}</p>
                        {ch.youTubeChannelId && (
                          <span className={styles.tag}>YT: {ch.youTubeChannelId}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Videos list */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Videos</h2>
                <span className={styles.count}>{videos.length}</span>
              </div>
              {videos.length === 0 ? (
                <p className={styles.empty}>No videos found. Add one via the API.</p>
              ) : (
                <div className={styles.grid}>
                  {videos.map((v) => (
                    <div key={v.id} className={styles.card}>
                      <div className={styles.cardIcon}>🎬</div>
                      <div className={styles.cardBody}>
                        <h3 className={styles.cardTitle}>{v.title}</h3>
                        <p className={styles.cardDesc}>{v.description || 'No description'}</p>
                        {v.duration != null && (
                          <span className={styles.tag}>{Math.floor(v.duration / 60)}m {v.duration % 60}s</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  )
}
