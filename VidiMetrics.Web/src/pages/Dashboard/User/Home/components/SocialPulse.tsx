import DashboardStatCard from "@/components/ui/Cards/DashboardStatCard";
import { ErrorScreen, LoadingScreen } from "@/components/ui/Feedback/StatusScreens";
import { useGetMyChannelsQuery } from "@/store/apis"
import { ChannelPlatform } from "@/types";
import { useNavigate } from "react-router-dom";

export default function SocialPulse() {
    const navigate = useNavigate();
    const { data: response, isLoading, error } = useGetMyChannelsQuery();
    function getChannelIcon(platform: ChannelPlatform) {
        switch (platform) {
            case ChannelPlatform.YouTube:
                return "youtube_activity";
            case ChannelPlatform.TikTok:
                return "music_note";
            case ChannelPlatform.Instagram:
                return "camera_alt";
            case ChannelPlatform.X:
                return "twitter";
            case ChannelPlatform.Facebook:
                return "facebook";
            case ChannelPlatform.LinkedIn:
                return "linkedin";
            default:
                return "public";
        }
    }
    if (isLoading) return <LoadingScreen message="Loading shows..." />
    if (error) return <ErrorScreen message="Failed to load shows" />
    const connectedChannels = response?.data?.filter((channel) => channel.isConnected) || [];
    const totalFollowers = connectedChannels.reduce((acc, channel) => acc + (channel?.channelStat?.totalFollowers ?? 0), 0);
    const totalViews = connectedChannels.reduce((acc, channel) => acc + (channel?.channelStat?.totalViews ?? 0), 0);
    const totalLikes = connectedChannels.reduce((acc, channel) => acc + (channel?.channelStat?.totalLikes ?? 0), 0);
    return (
        <div className="space-y-8">

            <div className="space-y-6">
                <div className="flex justify-between items-end">
                    <div
                        onClick={() => navigate("/dashboard/social-links")}
                        className="flex items-center gap-3 cursor-pointer hover:scale-105 transition-all duration-300">
                        <span className="material-symbols-outlined text-accent-cyan">sensors</span>
                        <h2 className="text-xl font-bold text-white tracking-wide">Social Pulse</h2>
                    </div>
                </div>
                <div className="glass-card rounded-3xl p-8 border border-white/5">

                    <div className="grid grid-cols-2 gap-4">
                        {connectedChannels.map((channel) => (
                            <DashboardStatCard
                                key={channel.id}
                                label="Connected"
                                value={channel.name}
                                icon={getChannelIcon(channel.platform ?? 0)}
                                accent="cyan"
                                size="sm"
                                onClick={() => navigate(`/dashboard/social-links/${channel.id}`)}
                            />

                        ))}

                    </div>


                    <div className="relative overflow-hidden mt-3 p-2">
                        <div className="space-y-4">
                            <DashboardStatCard
                                label="Total Views"
                                value={totalViews}
                                icon="visibility"
                                variant="row-strip"
                                size="md"
                                accent="cyan"
                            />
                            <DashboardStatCard
                                label="Total Likes"
                                value={totalLikes}
                                icon="thumb_up"
                                variant="row-strip"
                                size="md"
                                accent="purple"
                            />
                            <DashboardStatCard
                                label="Total Subscribers"
                                value={totalFollowers}
                                icon="groups"
                                variant="row-strip"
                                size="md"
                                accent="cyan"
                            />
                        </div>
                    </div>

                </div>
            </div>
        </div>

    )
}
