import { useState } from "react";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { NotificationType, type Notification } from "@/types";
import { useGetMyNotificationsQuery, useMarkAllNotificationsAsReadMutation, useMarkNotificationAsReadMutation } from "@/store/apis";
import { ErrorScreen, LoadingScreen } from "@/components/ui/Feedback/StatusScreens";


export default function NotificationsPage() {
    const [activeFilter, setActiveFilter] = useState<"all" | "unread" | "success" | "warning">("all");
    const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
    const { data: notificationsData, isLoading, error, refetch } = useGetMyNotificationsQuery();
    const [markAllAsRead] = useMarkAllNotificationsAsReadMutation();
    const [markAsRead] = useMarkNotificationAsReadMutation();

    const notifications = notificationsData?.data ?? [];
    // Handle Filtering Data
    const filteredNotifications = notifications.filter(n => {
        if (activeFilter === "unread") return !n.isRead;
        if (activeFilter === "success") return n.type === NotificationType.Success;
        if (activeFilter === "warning") return n.type === NotificationType.Warning;
        return true;
    });


    const handleMarkAllAsRead = async () => {
        try {
            await markAllAsRead().unwrap();
            refetch();
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    const getTypeStyles = (type: NotificationType) => {
        switch (type) {
            case NotificationType.Success: return { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", icon: "check_circle" };
            case NotificationType.Warning: return { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20", icon: "warning" };
            case NotificationType.Critical: return { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/20", icon: "danger" };
            default: return { bg: "bg-sky-500/10", text: "text-sky-400", border: "border-sky-500/20", icon: "info" };
        }
    };

    if (isLoading) return <LoadingScreen message="Loading Notifications..." />;
    if (error) return <ErrorScreen title="Error" message="Failed to fetch notifications" />;

    return (
        <div className="min-h-screen text-white bg-gradient-to-b from-dashboard-bg to-[#0b0c10]">
            <div className="space-y-6 max-w-[1600px] mx-auto px-4 sm:px-8 py-6">

                {/* Header Block */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
                    <div className="space-y-2">
                        <Breadcrumbs items={[{ label: "Home", path: "/" }, { label: "Notifications" }]} />
                        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                            Notifications <span className="text-gradient-purple">Hub</span>
                        </h1>
                        <p className="text-white/50 text-sm max-w-xl">
                            Monitor systems execution logs, engine processes, and direct messages in real time.
                        </p>
                    </div>

                    {/* Quick Action Group Buttons */}
                    <div className="flex items-center gap-2 self-start md:self-auto">
                        <button
                            onClick={() => handleMarkAllAsRead()}
                            className="px-4 py-2 text-xs font-semibold bg-white/5 hover:bg-white/10 rounded-lg transition-all border border-white/10 flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-sm">done_all</span>
                            Mark All Read
                        </button>
                    </div>
                </div>

                {/* Dashboard Layout Main Splitting Area */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                    {/* LEFT: Feed Control Area & List (7 Columns) */}
                    <div className="lg:col-span-7 space-y-4">

                        {/* Filter Pill Badges Bar */}
                        <div className="flex items-center gap-2 bg-white/[0.02] p-1.5 rounded-xl border border-white/5 overflow-x-auto">
                            {(["all", "unread", "success", "warning"] as const).map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setActiveFilter(filter)}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${activeFilter === filter
                                        ? "bg-primary text-black shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]"
                                        : "text-white/40 hover:text-white hover:bg-white/5"
                                        }`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>

                        {/* Notifications Scroller Card Feed */}
                        <div className="space-y-3 max-h-[650px] overflow-y-auto pr-2 custom-scrollbar">
                            {filteredNotifications.length === 0 ? (
                                <div className="glass-card border border-white/5 rounded-2xl p-12 text-center flex flex-col items-center gap-3">
                                    <span className="material-symbols-outlined text-4xl text-white/10">notifications_none</span>
                                    <p className="text-white/40 text-sm">No notification records match this filter parameter.</p>
                                </div>
                            ) : (
                                filteredNotifications.map((item) => {
                                    const style = getTypeStyles(item.type);
                                    const isSelected = selectedNotification?.id === item.id;

                                    return (
                                        <div
                                            key={item.id}
                                            onClick={() => {
                                                setSelectedNotification(item);
                                                if (!item.isRead) markAsRead(item.id!);
                                            }}
                                            className={`group relative p-4 rounded-xl border transition-all duration-300 cursor-pointer flex gap-4 items-start ${isSelected
                                                ? "bg-white/5 border-primary/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                                                : "bg-[#12131a]/40 border-white/5 hover:border-white/10 hover:bg-[#12131a]/80"
                                                }`}
                                        >
                                            {/* Unread Glowing Active Left Border Indicator */}
                                            {!item.isRead && (
                                                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-8 bg-primary rounded-r-full shadow-[0_0_10px_rgba(var(--primary-rgb),0.8)]"></span>
                                            )}

                                            {/* Icon Container */}
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${style.bg} ${style.border} ${style.text}`}>
                                                <span className="material-symbols-outlined text-xl">{style.icon}</span>
                                            </div>

                                            {/* Dynamic Content Columns */}
                                            <div className="space-y-1 flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-4">
                                                    <h3 className={`text-sm font-semibold truncate ${!item.isRead ? "text-white font-bold" : "text-white/80"}`}>
                                                        {item.title}
                                                    </h3>
                                                    <span className="text-[10px] text-white/30 whitespace-nowrap">
                                                        {item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-white/50 line-clamp-2 leading-relaxed">
                                                    {item.message}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* RIGHT: Dynamic Details Inspector Panel Component Container (5 Columns) */}
                    <div className="lg:col-span-5 sticky top-24">
                        {selectedNotification ? (
                            <div className="glass-card bg-[#12131a]/60 border border-white/10 rounded-2xl p-6 space-y-6 backdrop-blur-md shadow-2xl relative overflow-hidden group">

                                {/* Subtle visual ambient background glow corresponding to message severity type */}
                                <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] opacity-20 pointer-events-none ${getTypeStyles(selectedNotification.type).bg}`} />

                                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase border ${getTypeStyles(selectedNotification.type).bg} ${getTypeStyles(selectedNotification.type).border} ${getTypeStyles(selectedNotification.type).text}`}>
                                            {selectedNotification.type}
                                        </span>
                                        {!selectedNotification.isRead && (
                                            <span className="w-2 h-2 rounded-full bg-primary" />
                                        )}
                                    </div>


                                </div>

                                {/* Main Expanded Text Fields */}
                                <div className="space-y-3">
                                    <h2 className="text-xl font-bold tracking-tight text-white leading-snug">
                                        {selectedNotification.title}
                                    </h2>
                                    <p className="text-sm text-white/70 leading-relaxed bg-white/[0.01] p-4 rounded-xl border border-white/[0.03] shadow-inner font-mono text-justify whitespace-pre-wrap">
                                        {selectedNotification.message}
                                    </p>
                                </div>

                                {/* Metadata Tracking Fields Grid */}
                                <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 text-xs">
                                    <div>
                                        <span className="text-white/30 block mb-0.5">Dispatched Date</span>
                                        <span className="font-medium text-white/80">
                                            {selectedNotification.createdAt ? new Date(selectedNotification.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-white/30 block mb-0.5">Exact Dispatch Time</span>
                                        <span className="font-medium text-white/80">
                                            {selectedNotification.createdAt ? new Date(selectedNotification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'N/A'}
                                        </span>
                                    </div>
                                </div>

                            </div>
                        ) : (
                            <div className="border border-white/5 border-dashed rounded-2xl p-12 text-center flex flex-col items-center justify-center bg-white/[0.01] text-white/30 min-h-[350px]">
                                <span className="material-symbols-outlined text-3xl mb-2 animate-pulse">fullscreen</span>
                                <p className="text-xs">Select a notification event card to open the metadata verification pane.</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}