import { useState, useRef, useEffect, useCallback } from 'react'
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
import { useNavigate } from 'react-router-dom'
import '@/css/Planner.css'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import { PageHeader } from '@/components/ui/PageHeader'

// ─── Types ────────────────────────────────────────────────────────────────────

interface PlannerEvent {
  id: string
  title: string
  start: string
  end?: string
  allDay?: boolean
  extendedProps: {
    thumbnail: string
    status: 'live' | 'scheduled' | 'draft' | 'processing'
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

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const MOCK_EVENTS: PlannerEvent[] = [
  {
    id: 'evt-1',
    title: 'Neon Shadows - Ep 4',
    start: '2026-06-03T18:00:00',
    extendedProps: {
      thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80',
      status: 'scheduled',
      time: '18:00',
      platforms: ['TikTok', 'Instagram'],
      series: 'Neon Shadows',
      episode: 'Episode 4',
      seriesId: 'series-1',
      episodeId: 'ep-4',
      description: 'A riveting episode where our protagonist discovers the underground neon city beneath the megastructure.',
    },
  },
  {
    id: 'evt-2',
    title: 'Void Theory - Ep 1',
    start: '2026-06-09T12:30:00',
    extendedProps: {
      thumbnail: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&q=80',
      status: 'processing',
      time: '12:30',
      platforms: ['YouTube'],
      series: 'Void Theory',
      episode: 'Episode 1',
      seriesId: 'series-2',
      episodeId: 'ep-1',
      description: 'Pilot episode exploring the theoretical physics of parallel dimensions and what lies beyond the observable universe.',
    },
  },
  {
    id: 'evt-3',
    title: 'Synth Quest - Ep 12',
    start: '2026-06-24T21:00:00',
    extendedProps: {
      thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
      status: 'draft',
      time: '21:00',
      platforms: ['TikTok'],
      series: 'Synth Quest',
      episode: 'Episode 12',
      seriesId: 'series-3',
      episodeId: 'ep-12',
      description: 'The season finale where Aria must choose between the synthetic world and her digital consciousness.',
    },
  },
  {
    id: 'evt-4',
    title: 'Chrome Echoes - Ep 7',
    start: '2026-06-17T14:30:00',
    extendedProps: {
      thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=80',
      status: 'scheduled',
      time: '14:30',
      platforms: ['YouTube', 'TikTok'],
      series: 'Chrome Echoes',
      episode: 'Episode 7',
      seriesId: 'series-4',
      episodeId: 'ep-7',
      description: 'In the chrome cities of tomorrow, our heroes face the AI uprising from within the network.',
    },
  },
]

const MOCK_UNSCHEDULED: UnscheduledAsset[] = [
  {
    id: 'unsch-1',
    title: 'Alien Horizon - Ep 3',
    thumbnail: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=300&q=80',
    series: 'Alien Horizon',
    duration: '12:45',
  },
  {
    id: 'unsch-2',
    title: 'Neural Grid - Ep 8',
    thumbnail: 'https://images.unsplash.com/photo-1527430253228-e93688616381?w=300&q=80',
    series: 'Neural Grid',
    duration: '08:30',
  },
  {
    id: 'unsch-3',
    title: 'Bio Forge - Ep 2',
    thumbnail: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=300&q=80',
    series: 'Bio Forge',
    duration: '15:20',
  },
]

const ALL_SEARCHABLE = [
  ...MOCK_EVENTS.map(e => ({
    id: e.id,
    title: e.title,
    thumbnail: e.extendedProps.thumbnail,
    status: e.extendedProps.status,
    type: 'scheduled' as const,
    event: e,
  })),
  ...MOCK_UNSCHEDULED.map(a => ({
    id: a.id,
    title: a.title,
    thumbnail: a.thumbnail,
    status: 'unscheduled' as const,
    type: 'unscheduled' as const,
    asset: a,
  })),
]

// ─── Helpers ───────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { color: string; label: string; glow: string }> = {
  live: { color: 'bg-green-400', label: 'Live', glow: 'shadow-green-400/40' },
  scheduled: { color: 'bg-primary', label: 'Scheduled', glow: 'shadow-primary/40' },
  draft: { color: 'bg-yellow-400', label: 'Draft', glow: 'shadow-yellow-400/40' },
  processing: { color: 'bg-orange-400', label: 'Processing', glow: 'shadow-orange-400/40' },
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
  const navigate = useNavigate()
  const calendarRef = useRef<FullCalendar>(null)
  const draggableContainerRef = useRef<HTMLDivElement>(null)

  // ── State ──
  const [events, setEvents] = useState<PlannerEvent[]>(MOCK_EVENTS)
  const [unscheduled, setUnscheduled] = useState<UnscheduledAsset[]>(MOCK_UNSCHEDULED)
  const [currentView, setCurrentView] = useState<string>('dayGridMonth')
  const [currentTitle, setCurrentTitle] = useState<string>('')
  const [autoPilot, setAutoPilot] = useState<boolean>(true)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [showDropdown, setShowDropdown] = useState<boolean>(false)
  const [selectedEvent, setSelectedEvent] = useState<PlannerEvent | null>(null)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [showScheduleModal, setShowScheduleModal] = useState<boolean>(false)
  const [pendingDate, setPendingDate] = useState<string>('')

  // ── Search ──
  const filteredSearch = searchQuery.trim().length > 0
    ? ALL_SEARCHABLE.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : []

  // ── Draggable setup for unscheduled assets ──
  useEffect(() => {
    if (!draggableContainerRef.current) return
    const draggable = new Draggable(draggableContainerRef.current, {
      itemSelector: '[data-event]',
      eventData: (el) => ({
        id: `new-${Date.now()}`,
        title: el.getAttribute('data-title') ?? '',
        duration: { hours: 1 },
        extendedProps: {
          thumbnail: el.getAttribute('data-thumbnail') ?? '',
          status: 'draft',
          time: '12:00',
          platforms: ['YouTube'],
          series: el.getAttribute('data-series') ?? '',
          episode: 'Episode 1',
          seriesId: 'series-new',
          episodeId: 'ep-new',
          description: 'Newly scheduled video.',
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
    // Initial title
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

  const handleEventDrop = (arg: EventDropArg) => {
    const newStart = arg.event.startStr
    setEvents(prev => prev.map(e =>
      e.id === arg.event.id
        ? { ...e, start: newStart }
        : e
    ))
  }

  const handleExternalDrop = (info: { dateStr: string; draggedEl: HTMLElement; event: EventInput }) => {
    const assetId = info.draggedEl.getAttribute('data-asset-id')
    if (assetId) {
      const asset = unscheduled.find(a => a.id === assetId)
      if (asset) {
        const newEvt: PlannerEvent = {
          id: `evt-${Date.now()}`,
          title: asset.title,
          start: info.dateStr,
          extendedProps: {
            thumbnail: asset.thumbnail,
            status: 'draft',
            time: '12:00',
            platforms: ['YouTube'],
            series: asset.series,
            episode: 'Episode 1',
            seriesId: 'series-new',
            episodeId: 'ep-new',
            description: 'Newly scheduled from vault.',
          },
        }
        setEvents(prev => [...prev, newEvt])
        setUnscheduled(prev => prev.filter(a => a.id !== assetId))
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
  const fcEvents: EventInput[] = events.map(e => ({
    id: e.id,
    title: e.title,
    start: e.start,
    end: e.end,
    allDay: false,
    extendedProps: e.extendedProps,
  }))

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Breadcrumbs items={[
        { label: 'Home', path: '/dashboard' },
        { label: 'Planner' },
      ]} />
      {/* ── Page Header ── */}
      <div className="pt-2 pb-5 flex flex-col md:flex-row md:items-end justify-between gap-6 shrink-0">
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
                // Handle external draggable drop
                handleExternalDrop({
                  dateStr: info.dateStr,
                  draggedEl: info.dragEl,
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
              <button className="text-[10px] font-bold text-primary hover:underline transition-colors">View All</button>
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
              <button className="aspect-square rounded-xl border-2 border-dashed border-outline-variant/30 flex flex-col items-center justify-center text-on-surface-variant/40 hover:border-primary/50 hover:text-primary/60 transition-all cursor-pointer gap-1">
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
                <button
                  onClick={() => {
                    setShowModal(false)
                    navigate(`/dashboard/series/${selectedEvent.extendedProps.seriesId}/episodes/${selectedEvent.extendedProps.episodeId}`)
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-br from-primary to-secondary text-on-primary font-bold text-xs hover:brightness-110 hover:scale-[1.02] active:scale-95 transition-all duration-200 shadow-lg shadow-primary/20"
                >
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                  View Full Details
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-surface-container text-on-surface-variant font-semibold text-xs hover:text-on-surface hover:bg-surface-container-high transition-all border border-outline-variant/20"
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
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/60 block mb-2">Platform</label>
                  <select
                    id="schedule-platform"
                    className="w-full bg-surface-container border border-outline-variant/20 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  >
                    <option value="YouTube">YouTube</option>
                    <option value="TikTok">TikTok</option>
                    <option value="Instagram">Instagram</option>
                  </select>
                </div>
              </div>

              <button
                onClick={() => {
                  const titleInput = document.getElementById('schedule-title') as HTMLInputElement
                  const timeInput = document.getElementById('schedule-time') as HTMLInputElement
                  const platformInput = document.getElementById('schedule-platform') as HTMLSelectElement
                  const title = titleInput?.value.trim()
                  if (!title) return

                  const newEvt: PlannerEvent = {
                    id: `evt-${Date.now()}`,
                    title,
                    start: `${pendingDate}T${timeInput?.value ?? '12:00'}:00`,
                    extendedProps: {
                      thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80',
                      status: 'scheduled',
                      time: timeInput?.value ?? '12:00',
                      platforms: [platformInput?.value ?? 'YouTube'],
                      series: 'Custom',
                      episode: 'Episode 1',
                      seriesId: 'series-custom',
                      episodeId: 'ep-custom',
                      description: 'Manually scheduled video.',
                    },
                  }
                  setEvents(prev => [...prev, newEvt])
                  setShowScheduleModal(false)
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-br from-primary to-secondary text-on-primary font-bold text-sm hover:brightness-110 hover:scale-[1.02] active:scale-95 transition-all duration-200 shadow-lg shadow-primary/20"
              >
                <span className="material-symbols-outlined text-sm">event_available</span>
                Add to Calendar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
