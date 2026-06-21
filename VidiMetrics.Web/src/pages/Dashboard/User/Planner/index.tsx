import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin, { Draggable } from '@fullcalendar/interaction'
import type {
  EventClickArg,
  DateSelectArg,
  EventDropArg,
  EventContentArg,
  EventInput,
} from '@fullcalendar/core'
import '@/css/Planner.css'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import { PageHeader } from '@/components/ui/PageHeader'
import { ErrorScreen, LoadingScreen } from '@/components/ui/Feedback/StatusScreens'
import {
  useGetChannelPostsQuery,
  useSchedulePostMutation,
  useCreateChannelPostMutation,
  usePublishPostMutation,
  useDeleteChannelPostMutation,
} from '@/store/apis/core/channelPosts.api'
import { useGetMyChannelsQuery } from '@/store/apis/core/channels.api'
import { ChannelPlatform, ChannelPostStatus } from '@/types/enums'
import { Channel, ChannelPost } from '@/types/models/core'
import { toast } from 'sonner'

// ─── Types ────────────────────────────────────────────────────────────────────

interface PlannerEvent {
  id: string
  title: string
  start: string
  end?: string
  allDay?: boolean
  extendedProps: {
    thumbnail: string
    status: 'live' | 'scheduled' | 'draft' | 'processing' | 'failed'
    time: string
    platforms: string[]
    series: string
    episode: string
    seriesId: string
    episodeId: string
    description: string
  }
}

interface UnscheduledAsset {
  id: string
  title: string
  thumbnail: string
  series: string
  duration: string
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { color: string; label: string; glow: string }> = {
  live: { color: 'bg-green-400', label: 'Live', glow: 'shadow-green-400/40' },
  scheduled: { color: 'bg-primary', label: 'Scheduled', glow: 'shadow-primary/40' },
  draft: { color: 'bg-yellow-400', label: 'Draft', glow: 'shadow-yellow-400/40' },
  processing: { color: 'bg-orange-400', label: 'Processing', glow: 'shadow-orange-400/40' },
  failed: { color: 'bg-red-400', label: 'Failed', glow: 'shadow-red-400/40' },
  unscheduled: { color: 'bg-white/40', label: 'Unscheduled', glow: '' },
}

const PLATFORM_ICONS: Record<string, string> = {
  YouTube: 'Y',
  TikTok: 'T',
  Instagram: 'I',
  Twitter: 'X',
}

const VIEW_LABELS: Record<string, string> = {
  dayGridMonth: 'Month',
  timeGridWeek: 'Week',
  timeGridDay: 'Day',
}

const mapPostToEvent = (post: ChannelPost, channelMap: Record<string, Channel>): PlannerEvent => {
  const channel = channelMap[post.channelId];
  const platformName = channel?.platform !== undefined ? ChannelPlatform[channel.platform] : 'YouTube';

  let status: 'live' | 'scheduled' | 'draft' | 'processing' | 'failed' = 'draft';
  if (post.status === ChannelPostStatus.Published) {
    status = 'live';
  } else if (post.status === ChannelPostStatus.Queued) {
    status = 'scheduled';
  } else if (post.status === ChannelPostStatus.Failed) {
    status = 'failed';
  }

  const dateStr = post.scheduledAt || post.publishedAt || post.createdAt || '';
  const dateObj = dateStr ? new Date(dateStr) : new Date();
  const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

  let series = 'Custom';
  if (post.sourceEntityType === 2) {
    series = 'Episode';
  } else if (post.sourceEntityType === 3) {
    series = 'Scene';
  } else if (post.sourceEntityType === 1) {
    series = 'Show';
  }

  return {
    id: post.id,
    title: post.title,
    start: dateStr,
    extendedProps: {
      thumbnail: post.thumbnailUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80',
      status,
      time: timeStr,
      platforms: [platformName],
      series: series,
      episode: post.description ? (post.description.length > 50 ? post.description.substring(0, 50) + '...' : post.description) : 'Channel Post',
      seriesId: post.sourceEntityId || '',
      episodeId: post.sourceEntityId || '',
      description: post.description || 'No description provided.',
    }
  };
};

const mapPostToUnscheduled = (post: ChannelPost): UnscheduledAsset => {
  return {
    id: post.id,
    title: post.title,
    thumbnail: post.thumbnailUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&q=80',
    series: post.sourceEntityType === 2 ? 'Episode' : post.sourceEntityType === 3 ? 'Scene' : 'Custom Draft',
    duration: '00:00'
  };
};

// ─── Sub-components ────────────────────────────────────────────────────────────

function EventCard({ info }: { info: EventContentArg }) {
  const ep = info.event.extendedProps as PlannerEvent['extendedProps']
  const status = STATUS_CONFIG[ep.status] ?? STATUS_CONFIG.draft

  return (
    <div className="glass-panel rounded-xl border-l-2 border-primary hover:border-secondary transition-all cursor-pointer w-full overflow-hidden group">
      <img
        src={ep.thumbnail}
        alt={info.event.title}
        className="w-full h-14 object-cover"
        onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80' }}
      />
      <div className="p-1.5">
        <div className="flex items-center gap-1 mb-1">
          <div className={`w-1.5 h-1.5 rounded-full ${status.color} shrink-0`} />
          <span className="text-[9px] font-bold truncate text-on-surface leading-tight">{info.event.title}</span>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex -space-x-1">
            {ep.platforms.slice(0, 3).map(p => (
              <div
                key={p}
                className="w-4 h-4 rounded-full bg-surface-container-highest flex items-center justify-center text-[7px] font-bold text-on-surface border border-surface-container-low"
              >
                {PLATFORM_ICONS[p] ?? p[0]}
              </div>
            ))}
          </div>
          <span className="text-[8px] text-on-surface-variant">{ep.time}</span>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function Planner() {
  const calendarRef = useRef<FullCalendar>(null)
  const draggableContainerRef = useRef<HTMLDivElement>(null)

  // ── Queries & Mutations ──
  const { data: postsRes, isLoading: postsLoading, error: postsError } = useGetChannelPostsQuery({ pageSize: 1000 })
  const { data: channelsRes, isLoading: channelsLoading, error: channelsError } = useGetMyChannelsQuery()

  const [schedulePost] = useSchedulePostMutation()
  const [createChannelPost, { isLoading: isCreating }] = useCreateChannelPostMutation()
  const [publishPost, { isLoading: isPublishing }] = usePublishPostMutation()
  const [deleteChannelPost] = useDeleteChannelPostMutation()

  // ── State ──
  const [currentView, setCurrentView] = useState<string>('dayGridMonth')
  const [currentTitle, setCurrentTitle] = useState<string>('')
  const [autoPilot, setAutoPilot] = useState<boolean>(true)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [showDropdown, setShowDropdown] = useState<boolean>(false)
  const [selectedEvent, setSelectedEvent] = useState<PlannerEvent | null>(null)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [showScheduleModal, setShowScheduleModal] = useState<boolean>(false)
  const [pendingDate, setPendingDate] = useState<string>('')
  const [selectedChannelId, setSelectedChannelId] = useState<string>('')

  // ── Data Processing ──
  const channels = useMemo(() => channelsRes?.data || [], [channelsRes])
  const channelMap = useMemo(() => {
    const map: Record<string, Channel> = {}
    channels.forEach(c => {
      map[c.id] = c
    })
    return map
  }, [channels])

  const posts = useMemo(() => postsRes?.data?.items || [], [postsRes])

  const events = useMemo(() => {
    return posts
      .filter(p => p.scheduledAt)
      .map(p => mapPostToEvent(p, channelMap))
  }, [posts, channelMap])

  const unscheduled = useMemo(() => {
    return posts
      .filter(p => !p.scheduledAt)
      .map(p => mapPostToUnscheduled(p))
  }, [posts])

  // Set default channel when channels load
  useEffect(() => {
    if (channels.length > 0 && !selectedChannelId) {
      setSelectedChannelId(channels[0].id)
    }
  }, [channels, selectedChannelId])

  // ── Search ──
  const allSearchable = useMemo(() => {
    return [
      ...events.map(e => ({
        id: e.id,
        title: e.title,
        thumbnail: e.extendedProps.thumbnail,
        status: e.extendedProps.status,
        type: 'scheduled' as const,
        event: e,
      })),
      ...unscheduled.map(a => ({
        id: a.id,
        title: a.title,
        thumbnail: a.thumbnail,
        status: 'unscheduled' as const,
        type: 'unscheduled' as const,
        asset: a,
      })),
    ]
  }, [events, unscheduled])

  const filteredSearch = searchQuery.trim().length > 0
    ? allSearchable.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : []

  // ── Draggable setup for unscheduled assets ──
  useEffect(() => {
    if (!draggableContainerRef.current) return
    const draggable = new Draggable(draggableContainerRef.current, {
      itemSelector: '[data-event]',
      eventData: (el) => ({
        id: el.getAttribute('data-asset-id') ?? `new-${Date.now()}`,
        title: el.getAttribute('data-title') ?? '',
        duration: { hours: 1 },
        extendedProps: {
          thumbnail: el.getAttribute('data-thumbnail') ?? '',
          status: 'draft',
          time: '12:00',
          platforms: [],
          series: el.getAttribute('data-series') ?? '',
          episode: 'Draft Video',
          seriesId: '',
          episodeId: '',
          description: 'Ready to schedule.',
        },
      }),
    })
    return () => draggable.destroy()
  }, [unscheduled])

  // ── Calendar update helpers ──
  const updateTitle = useCallback(() => {
    const api = calendarRef.current?.getApi()
    if (api) setCurrentTitle(api.view.title)
  }, [])

  useEffect(() => {
    setTimeout(updateTitle, 100)
  }, [updateTitle])

  const handlePrev = () => { calendarRef.current?.getApi().prev(); updateTitle() }
  const handleNext = () => { calendarRef.current?.getApi().next(); updateTitle() }
  const handleToday = () => { calendarRef.current?.getApi().today(); updateTitle() }

  const changeView = (view: string) => {
    calendarRef.current?.getApi().changeView(view)
    setCurrentView(view)
    updateTitle()
  }

  // ── Calendar event interactions ──
  const handleEventClick = (arg: EventClickArg) => {
    const ev = events.find(e => e.id === arg.event.id)
    if (ev) {
      setSelectedEvent(ev)
      setShowModal(true)
    }
  }

  const handleDateSelect = (arg: DateSelectArg) => {
    setPendingDate(arg.startStr)
    setShowScheduleModal(true)
    calendarRef.current?.getApi().unselect()
  }

  const handleEventDrop = async (arg: EventDropArg) => {
    const newStart = arg.event.startStr
    try {
      await schedulePost({ id: arg.event.id, scheduledAt: newStart }).unwrap()
      toast.success('Post rescheduled successfully.')
    } catch (err) {
      console.error('Failed to reschedule post:', err)
      toast.error('Failed to reschedule post.')
      arg.revert()
    }
  }

  const handleExternalDrop = async (info: { dateStr: string; draggedEl: HTMLElement; event: EventInput }) => {
    const assetId = info.draggedEl.getAttribute('data-asset-id')
    if (assetId) {
      try {
        await schedulePost({ id: assetId, scheduledAt: info.dateStr }).unwrap()
        toast.success('Post scheduled successfully.')
      } catch (err) {
        console.error('Failed to schedule asset:', err)
        toast.error('Failed to schedule post.')
      }
    }
  }

  const handlePublishNow = async () => {
    if (!selectedEvent) return
    try {
      await publishPost(selectedEvent.id).unwrap()
      toast.success('Post published successfully.')
      setShowModal(false)
    } catch (err) {
      console.error('Failed to publish post:', err)
      toast.error('Failed to publish post.')
    }
  }

  const handleDeletePost = async () => {
    if (!selectedEvent) return
    if (confirm('Are you sure you want to cancel and delete this channel post?')) {
      try {
        await deleteChannelPost(selectedEvent.id).unwrap()
        toast.success('Post deleted successfully.')
        setShowModal(false)
      } catch (err) {
        console.error('Failed to delete post:', err)
        toast.error('Failed to delete post.')
      }
    }
  }

  // ── Close modal / dropdown on outside click ──
  const searchRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // ── Full calendar events ──
  const fcEvents: EventInput[] = useMemo(() => {
    return events.map(e => ({
      id: e.id,
      title: e.title,
      start: e.start,
      end: e.end,
      allDay: false,
      extendedProps: e.extendedProps,
    }))
  }, [events])

  if (postsLoading || channelsLoading) {
    return <LoadingScreen message="Accessing Content Planner..." accentColor="purple" />
  }

  if (postsError || channelsError) {
    return <ErrorScreen title="Planner Offline" message="Unable to load scheduled posts or channels. Please check your connection." />
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Breadcrumbs items={[
        { label: 'Home', path: '/dashboard' },
        { label: 'Planner' },
      ]} />
      {/* ── Page Header ── */}
      <div className="py-5 flex justify-between gap-6">
        <PageHeader
          chipText="Content Planner"
          titlePrefix="Schedule "
          gradientText="Studio"
          description="Schedule and automate your AI-generated episodes across platforms."
        />
        <div>
          <div className="flex items-center gap-3 flex-wrap mb-3">

            {/* ── Calendar Navigation ── */}
            <div className="flex items-center bg-surface-container-low rounded-xl p-1 border border-outline-variant/10">
              <button
                onClick={handlePrev}
                className="p-2 hover:text-primary hover:bg-white/5 rounded-lg transition-all material-symbols-outlined text-lg"
              >chevron_left</button>
              <button
                onClick={handleToday}
                className="px-3 font-headline font-semibold text-sm min-w-[130px] text-center hover:text-secondary transition-colors"
              >{currentTitle || 'Today'}</button>
              <button
                onClick={handleNext}
                className="p-2 hover:text-primary hover:bg-white/5 rounded-lg transition-all material-symbols-outlined text-lg"
              >chevron_right</button>
            </div>

            {/* ── View Switcher ── */}
            <div className="flex items-center bg-surface-container-low rounded-xl p-1 border border-outline-variant/10">
              {(['dayGridMonth', 'timeGridWeek', 'timeGridDay'] as const).map(view => (
                <button
                  key={view}
                  onClick={() => changeView(view)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${currentView === view
                    ? 'bg-surface-container-high text-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                >{VIEW_LABELS[view]}</button>
              ))}
            </div>

            {/* ── Schedule Video Button ── */}
            <button
              onClick={() => { setPendingDate(new Date().toISOString().split('T')[0]); setShowScheduleModal(true) }}
              className="px-5 py-2 rounded-xl bg-gradient-to-br from-primary to-secondary text-on-primary font-bold text-sm shadow-lg shadow-primary/20 flex items-center gap-2 hover:brightness-110 hover:scale-[1.02] active:scale-95 transition-all duration-200"
            >
              <span className="material-symbols-outlined text-sm">videocam</span>
              Schedule Video
            </button>
          </div>
          <div className="flex justify-between items-center">
            {/* ── Search Bar ── */}
            <div className="relative w-full" ref={searchRef}>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-lg">search</span>
                <input
                  type="text"
                  placeholder="Search cinematic assets..."
                  value={searchQuery}
                  onChange={e => { setSearchQuery(e.target.value); setShowDropdown(true) }}
                  onFocus={() => { if (searchQuery.trim()) setShowDropdown(true) }}
                  className="w-full bg-surface-container-low/80 border border-outline-variant/20 rounded-full pl-10 pr-4 py-2 text-sm text-on-surface placeholder-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary/30 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => { setSearchQuery(''); setShowDropdown(false) }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 hover:text-on-surface transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">close</span>
                  </button>
                )}
              </div>

              {/* Search Dropdown */}
              {showDropdown && filteredSearch.length > 0 && (
                <div className="absolute top-full mt-2 left-0 w-80 z-50 glass-card rounded-2xl border border-outline-variant/20 shadow-2xl shadow-surface-container-lowest/80 overflow-hidden">
                  <div className="p-2 border-b border-outline-variant/10 bg-surface-container/50">
                    <span className="text-[9px] uppercase tracking-widest font-bold text-on-surface-variant/60 px-2">
                      {filteredSearch.length} result{filteredSearch.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {filteredSearch.map(item => (
                      <button
                        key={item.id}
                        className="w-full flex items-center gap-3 p-3 hover:bg-white/5 transition-colors text-left group"
                        onClick={() => {
                          setShowDropdown(false)
                          setSearchQuery('')
                          if (item.type === 'scheduled' && item.event) {
                            setSelectedEvent(item.event as PlannerEvent)
                            setShowModal(true)
                          }
                        }}
                      >
                        <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-outline-variant/20">
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&q=60' }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-on-surface truncate group-hover:text-primary transition-colors">{item.title}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[item.status]?.color ?? 'bg-white/40'}`} />
                            <span className="text-[10px] text-on-surface-variant capitalize">{STATUS_CONFIG[item.status]?.label ?? item.status}</span>
                          </div>
                        </div>
                        <span className="material-symbols-outlined text-sm text-on-surface-variant/40 group-hover:text-primary transition-colors">arrow_forward</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {showDropdown && searchQuery.trim() && filteredSearch.length === 0 && (
                <div className="absolute top-full mt-2 left-0 w-72 z-50 glass-card rounded-2xl border border-outline-variant/20 shadow-2xl p-6 text-center">
                  <span className="material-symbols-outlined text-3xl text-on-surface-variant/30 block mb-2">search_off</span>
                  <p className="text-xs text-on-surface-variant/60">No assets found for "{searchQuery}"</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* ── Main Grid ── */}
      <div className="flex flex-1 overflow-hidden gap-6 min-h-0">

        {/* ── Calendar ── */}
        <div className="flex-1 flex flex-col min-w-0 bg-surface-container-lowest rounded-3xl border border-outline-variant/10 shadow-2xl overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={false}
              events={fcEvents}
              editable={true}
              selectable={true}
              selectMirror={true}
              droppable={true}
              dayMaxEvents={3}
              weekends={true}
              height="100%"
              eventContent={(info) => <EventCard info={info} />}
              eventClick={handleEventClick}
              select={handleDateSelect}
              eventDrop={handleEventDrop}
              drop={(info) => {
                handleExternalDrop({
                  dateStr: info.dateStr,
                  draggedEl: info.draggedEl,
                  event: {},
                })
              }}
              datesSet={updateTitle}
              dayCellClassNames={(arg) =>
                arg.isToday ? 'fc-day-today' : ''
              }
              dayHeaderContent={(arg) => (
                <div className="py-3 text-center text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                  {arg.text}
                </div>
              )}
            />
          </div>
        </div>

        {/* ── Right Sidebar ── */}
        <aside className="w-72 shrink-0 flex flex-col gap-5 overflow-y-auto no-scrollbar">

          {/* Unscheduled Renders */}
          <div className="glass-card rounded-3xl p-5 border border-outline-variant/10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-headline font-bold text-base text-on-surface">Unscheduled</h3>
            </div>

            <div ref={draggableContainerRef} className="grid grid-cols-2 gap-3">
              {unscheduled.map(asset => (
                <div
                  key={asset.id}
                  data-event
                  data-asset-id={asset.id}
                  data-title={asset.title}
                  data-thumbnail={asset.thumbnail}
                  data-series={asset.series}
                  className="aspect-square rounded-xl overflow-hidden relative group cursor-grab active:cursor-grabbing border border-outline-variant/10"
                >
                  <img
                    src={asset.thumbnail}
                    alt={asset.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&q=60' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface/90 via-surface/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-start justify-end p-2">
                    <span className="text-[7px] font-black uppercase tracking-widest text-secondary">Drag to Plan</span>
                    <span className="text-[8px] font-bold text-white/90 truncate w-full">{asset.title}</span>
                  </div>
                </div>
              ))}
              <button
                onClick={() => { setPendingDate(new Date().toISOString().split('T')[0]); setShowScheduleModal(true) }}
                className="aspect-square rounded-xl border-2 border-dashed border-outline-variant/30 flex flex-col items-center justify-center text-on-surface-variant/40 hover:border-primary/50 hover:text-primary/60 transition-all cursor-pointer gap-1"
              >
                <span className="material-symbols-outlined text-xl">add</span>
                <span className="text-[8px] font-bold uppercase tracking-wide">New</span>
              </button>
            </div>
          </div>

          {/* Upcoming Queue */}
          <div className="glass-card rounded-3xl p-5 border border-outline-variant/10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-headline font-bold text-base text-on-surface">Upcoming Queue</h3>
              <div className="px-2 py-0.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[9px] font-black tracking-wider">
                {events.filter(e => e.extendedProps.status === 'scheduled').length} READY
              </div>
            </div>

            <div className="space-y-3">
              {events
                .filter(e => new Date(e.start) >= new Date())
                .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
                .slice(0, 4)
                .map(evt => (
                  <button
                    key={evt.id}
                    onClick={() => { setSelectedEvent(evt); setShowModal(true) }}
                    className="flex items-center gap-3 w-full group text-left"
                  >
                    <div className="w-11 h-11 rounded-xl bg-surface-container-highest overflow-hidden shrink-0 border border-outline-variant/10">
                      <img
                        src={evt.extendedProps.thumbnail}
                        alt={evt.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&q=60' }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold truncate group-hover:text-primary transition-colors text-on-surface">{evt.title}</p>
                      <p className="text-[9px] text-on-surface-variant mt-0.5">
                        {new Date(evt.start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {evt.extendedProps.time}
                      </p>
                    </div>
                    <span className="material-symbols-outlined text-sm text-on-surface-variant/40 group-hover:text-primary transition-colors">drag_indicator</span>
                  </button>
                ))}
            </div>

            {/* Queue Health */}
            <div className="mt-5 pt-4 border-t border-outline-variant/10 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/60">Queue Health</span>
                <span className="text-[10px] font-bold text-secondary">85%</span>
              </div>
              <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-1000"
                  style={{ width: '85%' }}
                />
              </div>
            </div>
          </div>

          {/* AI Auto-Pilot */}
          <div className="glass-card rounded-3xl p-5 border border-outline-variant/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${autoPilot ? 'bg-primary/15 shadow-[0_0_15px_rgba(221,183,255,0.3)]' : 'bg-white/5'}`}>
                <span className="material-symbols-outlined text-primary text-xl">bolt</span>
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface">AI Auto-Pilot</p>
                <p className="text-[9px] text-on-surface-variant mt-0.5">
                  {autoPilot ? 'Intelligent scheduling active' : 'Manual mode'}
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoPilot}
                onChange={e => setAutoPilot(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-on-surface-variant after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary peer-checked:after:bg-on-primary transition-all duration-300 shadow-inner" />
            </label>
          </div>

        </aside>
      </div>

      {/* ── Event Details Modal ── */}
      {showModal && selectedEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-surface-container-lowest/70 backdrop-blur-md" />

          {/* Modal */}
          <div
            className="relative z-10 w-full max-w-lg glass-card rounded-3xl border border-outline-variant/20 shadow-2xl overflow-hidden animate-[fadeInScale_0.2s_ease]"
            onClick={e => e.stopPropagation()}
          >
            {/* Thumbnail Header */}
            <div className="relative h-52 overflow-hidden">
              <img
                src={selectedEvent.extendedProps.thumbnail}
                alt={selectedEvent.title}
                className="w-full h-full object-cover"
                onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/30 to-transparent" />

              {/* Close button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 w-8 h-8 bg-surface-container-highest/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>

              {/* Status badge */}
              <div className="absolute top-4 left-4">
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full backdrop-blur-sm border text-[10px] font-black uppercase tracking-widest
                  ${selectedEvent.extendedProps.status === 'scheduled' ? 'bg-primary/20 border-primary/30 text-primary' :
                    selectedEvent.extendedProps.status === 'live' ? 'bg-green-400/20 border-green-400/30 text-green-400' :
                      selectedEvent.extendedProps.status === 'processing' ? 'bg-orange-400/20 border-orange-400/30 text-orange-400' :
                        selectedEvent.extendedProps.status === 'failed' ? 'bg-red-400/20 border-red-400/30 text-red-400' :
                          'bg-yellow-400/20 border-yellow-400/30 text-yellow-400'}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[selectedEvent.extendedProps.status]?.color}`} />
                  {STATUS_CONFIG[selectedEvent.extendedProps.status]?.label}
                </div>
              </div>

              {/* Title overlay */}
              <div className="absolute bottom-4 left-5 right-5">
                <h2 className="font-headline font-bold text-2xl text-white leading-tight">{selectedEvent.title}</h2>
                <p className="text-on-surface-variant text-xs mt-0.5">{selectedEvent.extendedProps.series}</p>
              </div>
            </div>

            {/* Details Body */}
            <div className="p-5 space-y-4">

              {/* Meta grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-surface-container/60 rounded-xl p-3 text-center">
                  <span className="material-symbols-outlined text-secondary text-lg block mb-1">calendar_month</span>
                  <p className="text-[9px] text-on-surface-variant uppercase tracking-widest font-bold">Date</p>
                  <p className="text-xs font-bold text-on-surface mt-0.5">
                    {new Date(selectedEvent.start).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <div className="bg-surface-container/60 rounded-xl p-3 text-center">
                  <span className="material-symbols-outlined text-primary text-lg block mb-1">schedule</span>
                  <p className="text-[9px] text-on-surface-variant uppercase tracking-widest font-bold">Time</p>
                  <p className="text-xs font-bold text-on-surface mt-0.5">{selectedEvent.extendedProps.time}</p>
                </div>
                <div className="bg-surface-container/60 rounded-xl p-3 text-center">
                  <span className="material-symbols-outlined text-tertiary text-lg block mb-1">broadcast_on_personal</span>
                  <p className="text-[9px] text-on-surface-variant uppercase tracking-widest font-bold">Platforms</p>
                  <p className="text-xs font-bold text-on-surface mt-0.5">{selectedEvent.extendedProps.platforms.length}</p>
                </div>
              </div>

              {/* Platforms */}
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/60 mb-2">Publishing Platforms</p>
                <div className="flex flex-wrap gap-2">
                  {selectedEvent.extendedProps.platforms.map(p => (
                    <span
                      key={p}
                      className="px-3 py-1 rounded-full bg-surface-container text-on-surface text-[10px] font-bold border border-outline-variant/20 flex items-center gap-1.5"
                    >
                      <span className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[8px] font-black">{PLATFORM_ICONS[p] ?? p[0]}</span>
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/60 mb-2">Synopsis</p>
                <p className="text-xs text-on-surface-variant leading-relaxed">{selectedEvent.extendedProps.description}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                {selectedEvent.extendedProps.status !== 'live' && (
                  <button
                    onClick={handlePublishNow}
                    disabled={isPublishing}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white font-bold text-xs hover:brightness-110 hover:scale-[1.02] active:scale-95 transition-all duration-200 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-sm">publish</span>
                    {isPublishing ? 'Publishing...' : 'Publish Now'}
                  </button>
                )}

                <button
                  onClick={handleDeletePost}
                  className="px-4 py-2.5 rounded-xl bg-red-500/10 text-red-400 font-semibold text-xs hover:text-red-300 hover:bg-red-500/25 transition-all border border-red-500/20"
                >
                  Delete Post
                </button>

                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-surface-container text-on-surface-variant font-semibold text-xs hover:text-on-surface hover:bg-surface-container-high transition-all border border-outline-variant/20 ml-auto"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Schedule Video Modal (quick create) ── */}
      {showScheduleModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setShowScheduleModal(false)}
        >
          <div className="absolute inset-0 bg-surface-container-lowest/70 backdrop-blur-md" />
          <div
            className="relative z-10 w-full max-w-md glass-card rounded-3xl border border-outline-variant/20 shadow-2xl p-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-headline font-bold text-xl text-on-surface">Schedule Video</h2>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Adding to {new Date(pendingDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="w-8 h-8 bg-surface-container rounded-full flex items-center justify-center hover:bg-surface-container-high transition-colors"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/60 block mb-2">Video Title</label>
                <input
                  type="text"
                  id="schedule-title"
                  placeholder="e.g. Neon Shadows - Ep 5"
                  className="w-full bg-surface-container border border-outline-variant/20 rounded-xl px-4 py-2.5 text-sm text-on-surface placeholder-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all"
                />
              </div>

              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/60 block mb-2">Publishing Channel</label>
                {channels.length === 0 ? (
                  <p className="text-xs text-red-400">No channels connected. Please connect a channel first.</p>
                ) : (
                  <select
                    value={selectedChannelId}
                    onChange={e => setSelectedChannelId(e.target.value)}
                    className="w-full bg-surface-container border border-outline-variant/20 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  >
                    {channels.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.platform !== undefined ? ChannelPlatform[c.platform] : 'YouTube'})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/60 block mb-2">Description</label>
                <textarea
                  id="schedule-description"
                  placeholder="Enter video description..."
                  rows={3}
                  className="w-full bg-surface-container border border-outline-variant/20 rounded-xl px-4 py-2.5 text-sm text-on-surface placeholder-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/60 block mb-2">Time</label>
                  <input
                    type="time"
                    id="schedule-time"
                    defaultValue="12:00"
                    className="w-full bg-surface-container border border-outline-variant/20 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  />
                </div>
              </div>

              <button
                disabled={channels.length === 0 || isCreating}
                onClick={async () => {
                  const titleInput = document.getElementById('schedule-title') as HTMLInputElement
                  const timeInput = document.getElementById('schedule-time') as HTMLInputElement
                  const descInput = document.getElementById('schedule-description') as HTMLTextAreaElement
                  const title = titleInput?.value.trim()
                  if (!title || !selectedChannelId) return

                  const time = timeInput?.value ?? '12:00'
                  const desc = descInput?.value.trim()
                  const scheduledAt = `${pendingDate}T${time}:00`

                  try {
                    await createChannelPost({
                      title,
                      description: desc || undefined,
                      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                      thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80',
                      channelId: selectedChannelId,
                      scheduledAt,
                      status: ChannelPostStatus.Queued,
                    }).unwrap()
                    toast.success('Post scheduled successfully.')
                    setShowScheduleModal(false)
                  } catch (err) {
                    console.error('Failed to create channel post:', err)
                    toast.error('Failed to schedule post.')
                  }
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-br from-primary to-secondary text-on-primary font-bold text-sm hover:brightness-110 hover:scale-[1.02] active:scale-95 transition-all duration-200 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:scale-100 disabled:pointer-events-none"
              >
                {isCreating ? (
                  <span>Scheduling...</span>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">event_available</span>
                    Add to Calendar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
