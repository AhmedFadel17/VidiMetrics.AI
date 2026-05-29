import { useState } from "react";
import ChannelManageDeck from "./ChannelManage";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import {
  useGetMyChannelsQuery,
  useUpdateChannelMutation,
  useDeleteChannelMutation,
} from "@/store/apis";
import { ErrorScreen, LoadingScreen } from "@/components/ui/Feedback/StatusScreens";
import { Channel, ChannelPlatform } from "@/types";
import { toast } from "sonner";
import { useAuth } from "react-oidc-context";
import { getChannelAuthUrl, isPlatformAuthImplemented } from "@/utils/channelAuth";

export interface ChannelData {
  id: string;
  name: string;
  isConnected: boolean;
  handleOrChannelName?: string;
  statsMetric?: string;
  avatarUrl?: string;
  iconName: string;
  iconColorClass: string;
  autoPost: boolean;
  syncAnalytics: boolean;
}

interface PlatformConfig {
  platform: ChannelPlatform;
  name: string;
  iconName: string;
  iconColorClass: string;
  bgGradient: string;
  placeholderText: string;
  defaultMetric: string;
}

const PLATFORM_CONFIGS: Record<ChannelPlatform, PlatformConfig> = {
  [ChannelPlatform.YouTube]: {
    platform: ChannelPlatform.YouTube,
    name: "YouTube",
    iconName: "play_circle",
    iconColorClass: "text-red-500",
    bgGradient: "from-red-600/10 via-rose-700/5 to-transparent border-red-500/20 hover:border-red-500/50 shadow-[0_0_20px_-5px_rgba(239,68,68,0.1)] hover:shadow-[0_0_25px_rgba(239,68,68,0.25)]",
    placeholderText: "Broadcast high-fidelity cinematic video logs to your global audience.",
    defaultMetric: "0 Subscribers • 0 Videos",
  },
  [ChannelPlatform.TikTok]: {
    platform: ChannelPlatform.TikTok,
    name: "TikTok",
    iconName: "music_note",
    iconColorClass: "text-teal-400",
    bgGradient: "from-cyan-600/10 via-fuchsia-600/5 to-transparent border-cyan-500/20 hover:border-fuchsia-500/40 shadow-[0_0_20px_-5px_rgba(34,211,238,0.1)] hover:shadow-[0_0_25px_rgba(217,70,239,0.25)]",
    placeholderText: "Engage the generation with vertical, AI-synthesis short clips.",
    defaultMetric: "0 Followers • 0 Likes",
  },
  [ChannelPlatform.Instagram]: {
    platform: ChannelPlatform.Instagram,
    name: "Instagram",
    iconName: "movie_edit",
    iconColorClass: "text-pink-500",
    bgGradient: "from-pink-600/10 via-purple-600/5 to-transparent border-pink-500/20 hover:border-purple-500/40 shadow-[0_0_20px_-5px_rgba(236,72,153,0.1)] hover:shadow-[0_0_25px_rgba(168,85,247,0.25)]",
    placeholderText: "Publish immersive visuals and reels to the modern aesthetic catalog.",
    defaultMetric: "0 Followers • 0 Posts",
  },
  [ChannelPlatform.Facebook]: {
    platform: ChannelPlatform.Facebook,
    name: "Facebook",
    iconName: "hub",
    iconColorClass: "text-blue-500",
    bgGradient: "from-blue-600/10 via-indigo-700/5 to-transparent border-blue-500/20 hover:border-blue-500/40 shadow-[0_0_20px_-5px_rgba(59,130,246,0.1)] hover:shadow-[0_0_25px_rgba(59,130,246,0.25)]",
    placeholderText: "Distribute your automated social video feeds to worldwide communities.",
    defaultMetric: "0 Followers • 0 Likes",
  },
  [ChannelPlatform.LinkedIn]: {
    platform: ChannelPlatform.LinkedIn,
    name: "LinkedIn",
    iconName: "work",
    iconColorClass: "text-sky-400",
    bgGradient: "from-sky-600/10 via-blue-600/5 to-transparent border-sky-500/20 hover:border-sky-500/40 shadow-[0_0_20px_-5px_rgba(56,189,248,0.1)] hover:shadow-[0_0_25px_rgba(14,165,233,0.25)]",
    placeholderText: "Share institutional broadcasts and professional career updates.",
    defaultMetric: "0 Connections • 0 Posts",
  },
  [ChannelPlatform.X]: {
    platform: ChannelPlatform.X,
    name: "X / Twitter",
    iconName: "X",
    iconColorClass: "text-white",
    bgGradient: "from-neutral-700/15 via-neutral-900/10 to-transparent border-neutral-600/20 hover:border-neutral-400/50 shadow-[0_0_20px_-5px_rgba(255,255,255,0.02)] hover:shadow-[0_0_25px_rgba(255,255,255,0.1)]",
    placeholderText: "Deploy real-time micro-broadcasts to keep trending across the globe.",
    defaultMetric: "0 Followers • 0 Reposts",
  },
  [ChannelPlatform.Federated]: {
    platform: ChannelPlatform.Federated,
    name: "Federated Network",
    iconName: "share",
    iconColorClass: "text-violet-400",
    bgGradient: "from-violet-600/10 via-purple-800/5 to-transparent border-violet-500/20 hover:border-purple-500/40 shadow-[0_0_20px_-5px_rgba(139,92,246,0.1)] hover:shadow-[0_0_25px_rgba(139,92,246,0.25)]",
    placeholderText: "Publish decentralized web streams across the fediverse standard node.",
    defaultMetric: "0 Peer Nodes Connected",
  },
};

export default function SocialLinksPage() {
  const auth = useAuth()
  const userId = auth?.user?.profile.sub || "";
  const { data, isLoading, error } = useGetMyChannelsQuery();
  const [updateChannel] = useUpdateChannelMutation();
  const [deleteChannel] = useDeleteChannelMutation();

  const [selectedManageChannel, setSelectedManageChannel] = useState<Channel | null>(null);

  const channels = data?.data || [];

  const handleToggleAutoPost = async (channel: Channel) => {
    try {
      await updateChannel({
        id: channel.id,
        body: {
          name: channel.name,
          autoPost: !channel.autoPost,
          syncAnalytics: channel.syncAnalytics,
          isActive: channel.isActive,
          isConnected: channel.isConnected,
        },
      }).unwrap();
      toast.success(`${channel.name} Auto-Post updated successfully.`);
    } catch (err) {
      console.error(err);
      toast.error(`Failed to update ${channel.name} Auto-Post settings.`);
    }
  };

  const handleToggleSyncAnalytics = async (channel: Channel) => {
    try {
      await updateChannel({
        id: channel.id,
        body: {
          name: channel.name,
          autoPost: channel.autoPost,
          syncAnalytics: !channel.syncAnalytics,
          isActive: channel.isActive,
          isConnected: channel.isConnected,
        },
      }).unwrap();
      toast.success(`${channel.name} Analytics Sync updated successfully.`);
    } catch (err) {
      console.error(err);
      toast.error(`Failed to update ${channel.name} Analytics Sync settings.`);
    }
  };

  const handleDisconnectChannel = async (id: string) => {
    try {
      await deleteChannel(id).unwrap();
      setSelectedManageChannel(null);
      toast.success("Channel disconnected successfully.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to disconnect channel.");
    }
  };

  const handleRedirectToConnect = (platform: ChannelPlatform) => {
    if (!isPlatformAuthImplemented(platform)) {
      toast.info(`${PLATFORM_CONFIGS[platform].name} integration is coming soon!`);
      return;
    }

    const redirectUrl = getChannelAuthUrl(platform, userId);
    if (redirectUrl) {
      toast.info(`Redirecting to ${PLATFORM_CONFIGS[platform].name} connection gateway...`);
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 800);
    } else {
      toast.error("Integration gateway configuration not found for this platform.");
    }
  };

  const mapChannelToChannelData = (channel: Channel): ChannelData => {
    const platform = channel.platform ?? ChannelPlatform.YouTube;
    const config = PLATFORM_CONFIGS[platform];

    let statsMetric = config.defaultMetric;
    if (channel.channelStat) {
      if (platform === ChannelPlatform.YouTube) {
        statsMetric = `${channel.channelStat.totalFollowers.toLocaleString()} Subscribers • ${channel.channelStat.totalVideos} Videos`;
      } else if (platform === ChannelPlatform.TikTok) {
        statsMetric = `${channel.channelStat.totalFollowers.toLocaleString()} Followers • ${channel.channelStat.totalLikes.toLocaleString()} Likes`;
      } else if (platform === ChannelPlatform.Instagram) {
        statsMetric = `${channel.channelStat.totalFollowers.toLocaleString()} Followers • ${channel.channelStat.totalVideos} Posts`;
      } else if (platform === ChannelPlatform.Facebook) {
        statsMetric = `${channel.channelStat.totalFollowers.toLocaleString()} Followers • ${channel.channelStat.totalLikes.toLocaleString()} Likes`;
      } else if (platform === ChannelPlatform.LinkedIn) {
        statsMetric = `${channel.channelStat.totalFollowers.toLocaleString()} Connections • ${channel.channelStat.totalVideos} Posts`;
      } else {
        statsMetric = `${channel.channelStat.totalViews.toLocaleString()} Views`;
      }
    }

    return {
      id: channel.id,
      name: channel.name,
      isConnected: channel.isConnected,
      handleOrChannelName: channel.platformChannelId || channel.name,
      statsMetric: statsMetric,
      avatarUrl: channel.avatarUrl,
      iconName: config.iconName,
      iconColorClass: config.iconColorClass,
      autoPost: channel.autoPost,
      syncAnalytics: channel.syncAnalytics,
    };
  };

  if (isLoading) return <LoadingScreen message="Accessing Channels..." accentColor="purple" />;
  if (error) return <ErrorScreen title="Channel Connection Lost" message="Unable to retrieve channel details. Please check your network connection or try again." />;

  // Get all platforms from enum
  const allPlatforms = Object.values(ChannelPlatform).filter(
    (v) => typeof v === "number"
  ) as ChannelPlatform[];

  return (
    <div>
      <div className="space-y-4 pb-16">
        <Breadcrumbs
          items={[{ label: "Home", path: "/" }, { label: "Social Links" }]}
        />
        <div>
          <h1 className="text-5xl font-headline font-bold text-white tracking-tight flex items-center gap-4">
            Connect Your <span className="text-gradient-purple">Channels</span>
          </h1>
          <p className="text-on-surface-variant/80 mt-2 max-w-2xl">
            Synchronize your AI-generated narratives across the global
            distribution network. Manage permissions, automation workflows, and
            cinematic analytics from a single command deck.
          </p>
        </div>
      </div>

      <div className="space-y-16 pb-20">
        {selectedManageChannel ? (
          /* Sub-Page Configuration Interface Router */
          <ChannelManageDeck
            channel={mapChannelToChannelData(selectedManageChannel)}
            onBack={() => setSelectedManageChannel(null)}
            onDisconnect={handleDisconnectChannel}
          />
        ) : (
          /* Root Platforms Overview Command Screen UI */
          <div className="animation-fade-in">
            {/* Bento Grid Matrix containing active channels and gorgeous connection placeholders */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
              {allPlatforms.map((platform) => {
                const matchedChannels = channels.filter(c => c.platform === platform);
                const config = PLATFORM_CONFIGS[platform];

                // If one or more channels exist for this platform, render cards
                if (matchedChannels.length > 0) {
                  return matchedChannels.map((channel) => (
                    <div
                      key={channel.id}
                      className={`glass-panel rounded-xl p-8 border bg-gradient-to-br ${config.bgGradient} relative overflow-hidden group transition-all duration-500`}
                    >
                      <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>

                      <div className="flex justify-between items-start mb-8">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-lg bg-surface-container-high flex items-center justify-center border border-outline-variant/20 group-hover:border-primary/30 transition-all duration-300">
                            {config.iconName === "X" ? (
                              <span className="text-2xl font-black text-on-surface">
                                X
                              </span>
                            ) : (
                              <span
                                className={`material-symbols-outlined text-3xl transition-transform duration-300 group-hover:scale-110 ${config.iconColorClass}`}
                              >
                                {config.iconName}
                              </span>
                            )}
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold font-display tracking-tight">
                              {config.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span
                                className={`w-2 h-2 rounded-full ${channel.isConnected ? "bg-green-500 animate-glow-pulse" : "bg-outline-variant"}`}
                              ></span>
                              <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-semibold">
                                {channel.isConnected ? "Connected" : "Not Linked"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons: Manage (if connected) or Reconnect (if disconnected) */}
                        {channel.isConnected ? (
                          <button
                            onClick={() => setSelectedManageChannel(channel)}
                            className="px-5 py-2 rounded-lg bg-surface-container-highest border border-outline-variant/30 text-xs font-bold uppercase tracking-widest hover:bg-outline-variant/20 transition-all text-on-surface group-hover:scale-[1.02]"
                          >
                            Manage
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRedirectToConnect(platform)}
                            className={`px-5 py-2 rounded-lg bg-gradient-to-br ${config.iconColorClass === "text-white" ? "from-neutral-700 to-neutral-900" : "from-primary/80 to-secondary/80"} text-on-primary text-xs font-bold uppercase tracking-widest hover:scale-[1.05] transition-all duration-300 shadow-lg`}
                          >
                            Reconnect
                          </button>
                        )}
                      </div>

                      {/* Connected Details Info Box */}
                      {channel.isConnected ? (
                        <div className="bg-surface-container-lowest/50 backdrop-blur-md rounded-lg p-5 mb-8 flex items-center gap-4 animate-fade-in border border-outline-variant/10">
                          {channel.avatarUrl ? (
                            <img
                              alt={channel.name}
                              className="w-12 h-12 rounded-full border-2 border-secondary/20 shadow-md object-cover"
                              src={channel.avatarUrl}
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-on-primary font-bold shadow-md">
                              {channel.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-on-surface">
                              {channel.name}
                            </p>
                            <p className="text-xs text-on-surface-variant">
                              {mapChannelToChannelData(channel).statsMetric}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-surface-container-lowest/30 rounded-lg p-5 mb-8 border border-dashed border-outline-variant/30 flex items-center justify-center">
                          <p className="text-sm text-on-surface-variant/60 italic">
                            Connect your {channel.name} Professional account
                          </p>
                        </div>
                      )}

                      {/* Interactive Configuration Switches */}
                      <div
                        className={`space-y-4 transition-all duration-500 ${channel.isConnected ? "opacity-100" : "opacity-40 pointer-events-none"}`}
                      >
                        <div className="flex items-center justify-between border-t border-outline-variant/10 pt-4">
                          <label className="text-sm font-medium text-on-surface-variant flex items-center gap-2 cursor-pointer hover:text-on-surface transition-colors">
                            <span className="material-symbols-outlined text-lg">
                              auto_mode
                            </span>{" "}
                            Auto-Post Content
                          </label>
                          <button
                            onClick={() => handleToggleAutoPost(channel)}
                            className={`relative w-10 h-5 rounded-full transition-colors duration-300 flex items-center ${channel.autoPost ? "bg-primary justify-end pr-1" : "bg-surface-container-highest justify-start pl-1"}`}
                          >
                            <span
                              className={`w-3 h-3 rounded-full transition-all duration-300 ${channel.autoPost ? "bg-on-primary" : "bg-outline-variant"}`}
                            ></span>
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-on-surface-variant flex items-center gap-2 cursor-pointer hover:text-on-surface transition-colors">
                            <span className="material-symbols-outlined text-lg">
                              sync
                            </span>{" "}
                            Sync Real-time Analytics
                          </label>
                          <button
                            onClick={() => handleToggleSyncAnalytics(channel)}
                            className={`relative w-10 h-5 rounded-full transition-colors duration-300 flex items-center ${channel.syncAnalytics ? "bg-primary justify-end pr-1" : "bg-surface-container-highest justify-start pl-1"}`}
                          >
                            <span
                              className={`w-3 h-3 rounded-full transition-all duration-300 ${channel.syncAnalytics ? "bg-on-primary" : "bg-outline-variant"}`}
                            ></span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ));
                }

                // If NO channel exists for this platform, render the gorgeous animated placeholder card
                return (
                  <div
                    key={platform}
                    className="relative rounded-xl p-8 border border-dashed border-outline-variant/20 bg-surface-container-low/20 overflow-hidden flex flex-col justify-between min-h-[300px] group hover:bg-surface-container-low/40 hover:border-solid hover:border-outline-variant/40 transition-all duration-500"
                  >
                    {/* Glowing brand backdrop on card hover */}
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-700"></div>

                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-lg bg-surface-container-high/40 flex items-center justify-center border border-dashed border-outline-variant/30 group-hover:border-solid group-hover:border-primary/40 transition-all duration-300">
                          {config.iconName === "X" ? (
                            <span className="text-2xl font-black text-on-surface/50 group-hover:text-on-surface">
                              X
                            </span>
                          ) : (
                            <span
                              className={`material-symbols-outlined text-3xl opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 ${config.iconColorClass}`}
                            >
                              {config.iconName}
                            </span>
                          )}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold font-display tracking-tight text-on-surface/60 group-hover:text-on-surface transition-colors">
                            {config.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="w-2 h-2 rounded-full bg-outline-variant animate-pulse"></span>
                            <span className="text-[10px] uppercase tracking-widest text-on-surface-variant/50 font-semibold group-hover:text-on-surface-variant/80 transition-colors">
                              Not Integrated
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Pulsing Integrate button */}
                      <button
                        onClick={() => handleRedirectToConnect(platform)}
                        className="px-5 py-2 rounded-lg border border-outline-variant/30 text-on-surface-variant hover:text-white hover:border-primary bg-surface-container-high/10 hover:bg-primary/20 text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-1.5 group-hover:scale-105"
                      >
                        <span className="material-symbols-outlined text-xs group-hover:rotate-90 transition-transform duration-300">
                          add
                        </span>
                        Integrate
                      </button>
                    </div>

                    <div className="mt-2 mb-6">
                      <p className="text-sm text-on-surface-variant/50 group-hover:text-on-surface-variant/75 transition-colors leading-relaxed">
                        {config.placeholderText}
                      </p>
                    </div>

                    {/* Dummy switches to match bento grid style */}
                    <div className="space-y-4 opacity-20 pointer-events-none mt-auto">
                      <div className="flex items-center justify-between border-t border-outline-variant/10 pt-4">
                        <label className="text-xs text-on-surface-variant flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm">
                            auto_mode
                          </span>{" "}
                          Auto-Post Content
                        </label>
                        <span className="w-8 h-4 rounded-full bg-surface-container-highest flex items-center p-0.5">
                          <span className="w-3 h-3 rounded-full bg-outline-variant"></span>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
