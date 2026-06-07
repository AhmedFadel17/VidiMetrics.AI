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
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-accent-cyan">monitoring</span>
                        <h2 className="text-xl font-bold text-white tracking-wide">Growth Engine</h2>
                    </div>
                </div>

                <div className="glass-card rounded-3xl p-8 border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent-cyan/5 blur-3xl -mr-10 -mt-10"></div>


                    <div className="space-y-10">
                        {/* Stat 1 */}
                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Total Views</span>
                                {/* <span className="text-accent-cyan text-xs font-bold">+12.5%</span> */}
                            </div>
                            <div className="text-3xl font-headline font-bold text-white mb-4">{totalViews}</div>
                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-accent-cyan w-[65%] shadow-[0_0_10px_#00f2ff]"></div>
                            </div>
                        </div>

                        {/* Stat 2 */}
                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Total Likes</span>
                                {/* <span className="text-accent-purple text-xs font-bold">+4.2%</span> */}
                            </div>
                            <div className="text-3xl font-headline font-bold text-white mb-4">{totalLikes}</div>
                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-accent-purple w-[48%] shadow-[0_0_10px_#8a2be2]"></div>
                            </div>
                        </div>

                        {/* Stat 3 */}
                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Total Subscribers</span>
                                {/* <span className="text-accent-pink text-xs font-bold">+824</span> */}
                            </div>
                            <div className="text-3xl font-headline font-bold text-white mb-4">{totalFollowers}</div>
                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-accent-pink w-[82%] shadow-[0_0_10px_#ff007f]"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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
                            <div
                                onClick={() => navigate(`/dashboard/social-links/${channel.id}`)}
                                key={channel.id} className="glass-card cursor-pointer hover:scale-105 transition-all duration-300 p-4 rounded-2xl border border-white/5 flex flex-col items-center gap-2 group hover:border-accent-cyan/30 transition-colors">
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                                    <span className="material-symbols-outlined  text-lg italic">{getChannelIcon(channel.platform ?? 0)}</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{channel.name}</span>
                                    <span className="text-[9px] font-bold text-green-300 uppercase">Connected</span>
                                </div>
                            </div>
                        ))}

                    </div>
                </div>
            </div>
        </div>
    )
}