import { useMemo, useRef, useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import type { EventContentArg, EventInput } from '@fullcalendar/core';
import { useNavigate } from 'react-router-dom';
import { useGetChannelPostsQuery } from '@/store/apis/core/channelPosts.api';
import { useGetMyChannelsQuery } from '@/store/apis/core/channels.api';
import { ChannelPlatform, ChannelPostStatus } from '@/types/enums';
import { Channel, ChannelPost } from '@/types/models/core';
import { LoadingScreen, ErrorScreen } from '@/components/ui/Feedback/StatusScreens';
import '@/css/Planner.css';

// ─── Data Schemas & Configurations ──────────────────────────────────────────

interface SimplifiedEvent {
    id: string;
    title: string;
    start: string;
    extendedProps: {
        thumbnail: string;
        status: 'live' | 'scheduled' | 'draft' | 'processing' | 'failed';
        time: string;
        platforms: string[];
    };
}

const STATUS_CONFIG: Record<string, { color: string; border: string }> = {
    live: { color: 'bg-green-400', border: 'border-l-green-400' },
    scheduled: { color: 'bg-primary', border: 'border-l-primary' },
    draft: { color: 'bg-yellow-400', border: 'border-l-yellow-400' },
    processing: { color: 'bg-orange-400', border: 'border-l-orange-400' },
    failed: { color: 'bg-red-400', border: 'border-l-red-400' },
};

const PLATFORM_ICONS: Record<string, string> = {
    YouTube: 'Y',
    TikTok: 'T',
    Instagram: 'I',
    Twitter: 'X',
};

const mapPostToEvent = (post: ChannelPost, channelMap: Record<string, Channel>): SimplifiedEvent => {
    const channel = channelMap[post.channelId];
    const platformName = channel?.platform !== undefined ? ChannelPlatform[channel.platform] : 'YouTube';

    let status: 'live' | 'scheduled' | 'draft' | 'processing' | 'failed' = 'draft';
    if (post.status === ChannelPostStatus.Published) status = 'live';
    else if (post.status === ChannelPostStatus.Queued) status = 'scheduled';
    else if (post.status === ChannelPostStatus.Failed) status = 'failed';

    const dateStr = post.scheduledAt || post.publishedAt || post.createdAt || '';
    const dateObj = dateStr ? new Date(dateStr) : new Date();
    const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

    return {
        id: post.id,
        title: post.title,
        start: dateStr,
        extendedProps: {
            thumbnail: post.thumbnailUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80',
            status,
            time: timeStr,
            platforms: [platformName],
        }
    };
};

// ─── Internal Weekly Event Strip Card ────────────────────────────────────────

function WeeklyEventCard({ info }: { info: EventContentArg }) {
    const ep = info.event.extendedProps as SimplifiedEvent['extendedProps'];
    const status = STATUS_CONFIG[ep.status] ?? STATUS_CONFIG.draft;

    return (
        <div className={`glass-panel h-full rounded-md border-l-2 ${status.border} p-1 flex flex-col justify-between overflow-hidden group cursor-pointer hover:bg-white/[0.02]`}>
            <div className="flex items-center gap-1 min-w-0">
                <div className={`w-1 h-1 rounded-full ${status.color} shrink-0`} />
                <p className="text-[9px] font-bold truncate text-on-surface leading-tight flex-1">
                    {info.event.title}
                </p>
            </div>

            <div className="flex justify-between items-center text-[7px] text-on-surface-variant mt-1">
                <span className="font-medium">{ep.time}</span>
                <div className="flex -space-x-0.5">
                    {ep.platforms.slice(0, 1).map(p => (
                        <div key={p} className="w-3 h-3 rounded-full bg-surface-container-highest flex items-center justify-center font-black text-[5px] border border-surface-container-low text-on-surface">
                            {PLATFORM_ICONS[p] ?? p[0]}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─── Main View-Only Weekly Component ─────────────────────────────────────────

export default function HomeWeeklyCalendarView() {
    const navigate = useNavigate();
    const calendarRef = useRef<FullCalendar>(null);
    const [currentTitle, setCurrentTitle] = useState<string>('');

    const { data: postsRes, isLoading: postsLoading, error: postsError } = useGetChannelPostsQuery({ pageSize: 1000 });
    const { data: channelsRes, isLoading: channelsLoading, error: channelsError } = useGetMyChannelsQuery();

    const channelMap = useMemo(() => {
        const map: Record<string, Channel> = {};
        if (channelsRes?.data) {
            channelsRes.data.forEach(c => { map[c.id] = c; });
        }
        return map;
    }, [channelsRes]);

    const fcEvents: EventInput[] = useMemo(() => {
        const posts = postsRes?.data?.items || [];
        return posts
            .filter(p => p.scheduledAt)
            .map(p => {
                const mapped = mapPostToEvent(p, channelMap);
                return {
                    id: mapped.id,
                    title: mapped.title,
                    start: mapped.start,
                    allDay: false,
                    extendedProps: mapped.extendedProps,
                };
            });
    }, [postsRes, channelMap]);

    const updateTitle = () => {
        const api = calendarRef.current?.getApi();
        if (api) setCurrentTitle(api.view.title);
    };

    useEffect(() => {
        setTimeout(updateTitle, 100);
    }, [fcEvents]);

    if (postsLoading || channelsLoading) return <LoadingScreen message="Loading weekly timeline..." />;
    if (postsError || channelsError) return <ErrorScreen message="Weekly schedule overview unavailable." />;

    return (
        <div className="glass-card rounded-3xl p-6 border border-white/5 bg-surface-container-lowest/40 flex flex-col h-[24rem]">
            {/* Control Header Area */}
            <div className="flex justify-between items-center mb-4 shrink-0">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-accent-cyan">view_week</span>
                    <h3 className="font-headline font-bold text-base text-on-surface">Weekly Queue</h3>
                    <span className="text-xs text-on-surface-variant/60">{currentTitle}</span>
                </div>

                <div className="flex items-center gap-1 bg-surface-container-low rounded-xl p-0.5 border border-outline-variant/10">
                    <button
                        onClick={() => { calendarRef.current?.getApi().prev(); updateTitle(); }}
                        className="p-1.5 text-on-surface-variant hover:text-primary rounded-lg transition-colors material-symbols-outlined text-xs"
                    >
                        chevron_left
                    </button>
                    <button
                        onClick={() => { calendarRef.current?.getApi().today(); updateTitle(); }}
                        className="px-2 py-0.5 text-[11px] font-semibold text-on-surface hover:text-secondary transition-colors"
                    >
                        This Week
                    </button>
                    <button
                        onClick={() => { calendarRef.current?.getApi().next(); updateTitle(); }}
                        className="p-1.5 text-on-surface-variant hover:text-primary rounded-lg transition-colors material-symbols-outlined text-xs"
                    >
                        chevron_right
                    </button>
                </div>
            </div>

            {/* Week Timeline View Grid */}
            <div className="flex-1 min-h-0 overflow-hidden text-xs custom-mini-weekly-calendar">
                <FullCalendar
                    ref={calendarRef}
                    plugins={[timeGridPlugin]}
                    initialView="timeGridWeek"
                    headerToolbar={false}
                    allDaySlot={false}
                    slotMinTime="06:00:00" // Caps view space to normal active hours to maximize UI room
                    slotMaxTime="24:00:00"
                    events={fcEvents}
                    editable={false}
                    selectable={false}
                    weekends={true}
                    height="100%"
                    eventContent={(info) => <WeeklyEventCard info={info} />}
                    eventClick={() => navigate('/dashboard/planner')}
                    datesSet={updateTitle}
                    dayHeaderContent={(arg) => (
                        <div className="py-1 flex flex-col items-center">
                            <span className="text-[9px] font-black uppercase tracking-wider text-on-surface-variant/40">
                                {arg.date.toLocaleDateString('en-US', { weekday: 'short' })}
                            </span>
                            <span className={`text-xs font-headline font-bold mt-0.5 w-6 h-6 flex items-center justify-center rounded-full ${arg.isToday ? 'bg-accent-cyan text-black font-black' : 'text-on-surface'}`}>
                                {arg.date.getDate()}
                            </span>
                        </div>
                    )}
                />
            </div>
        </div>
    );
}