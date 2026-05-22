import { useState } from "react";
import { ChannelData } from "./../index";

interface ChannelManageDeckProps {
  channel: ChannelData;
  onBack: () => void;
  onDisconnect: (id: string) => void;
}

export default function ChannelManageDeck({
  channel,
  onBack,
  onDisconnect,
}: ChannelManageDeckProps) {
  const [streamKey] = useState(
    "live_74829104_vidsynth_prod_deck_alpha_x90",
  );
  const [showKey, setShowKey] = useState(false);
  const [resolution, setResolution] = useState("4k");

  return (
    <div className="animation-fade-in space-y-8">
      {/* Back Header Nav row */}
      <div className="flex items-center justify-between border-b border-outline-variant/10 pb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-lg bg-surface-container-high border border-outline-variant/20 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-sm">
              arrow_back
            </span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-3xl font-bold font-display tracking-tight">
                {channel.name} Command
              </h3>
              <span className="px-2.5 py-0.5 bg-green-500/10 text-green-400 rounded-full text-[10px] font-bold uppercase tracking-wider border border-green-500/20">
                Active Node
              </span>
            </div>
            <p className="text-sm text-on-surface-variant mt-0.5">
              Pipeline architecture and secure credential access configuration
              settings.
            </p>
          </div>
        </div>

        <button
          onClick={() => onDisconnect(channel.id)}
          className="px-4 py-2 border border-error/30 text-error text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-error/10 transition-all"
        >
          Disconnect Channel
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Core Configuration Stream Panel */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-panel p-6 rounded-xl border border-outline-variant/10 space-y-6">
            <h4 className="text-lg font-bold font-display text-primary">
              Ingestion Gateway Cryptography
            </h4>

            <div className="space-y-2">
              <label className="text-xs font-label uppercase tracking-widest text-on-surface-variant ml-1">
                RTMP Synthesis Endpoint
              </label>
              <div className="bg-surface-container-lowest/50 p-4 rounded-xl text-on-surface font-medium border border-outline-variant/10 font-mono text-xs flex justify-between items-center">
                <span>
                  rtmp://live.vidimetrics.ai/synth-ingest/{channel.id}
                </span>
                <span className="material-symbols-outlined text-sm opacity-40 cursor-pointer hover:opacity-100">
                  content_copy
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-label uppercase tracking-widest text-on-surface-variant ml-1">
                Private Channel Stream Key
              </label>
              <div className="bg-surface-container-lowest/50 p-4 rounded-xl text-on-surface font-medium border border-outline-variant/10 font-mono text-xs flex justify-between items-center">
                <input
                  type={showKey ? "text" : "password"}
                  value={streamKey}
                  readOnly
                  className="bg-transparent border-none p-0 focus:ring-0 w-3/4 text-on-surface tracking-wider"
                />
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowKey(!showKey)}
                    className="text-on-surface-variant hover:text-on-surface"
                  >
                    <span className="material-symbols-outlined text-sm">
                      {showKey ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                  <span className="material-symbols-outlined text-sm opacity-40 cursor-pointer hover:opacity-100">
                    content_copy
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Engine Quality Profiles */}
          <div className="glass-panel p-6 rounded-xl border border-outline-variant/10">
            <h4 className="text-lg font-bold font-display text-secondary mb-4">
              Rendering Output Compression Matrix
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  id: "1080p",
                  label: "ProRes 1080p",
                  sub: "Standard definition",
                },
                {
                  id: "4k",
                  label: "Cinematic 4K UHD",
                  sub: "Priority GPU dispatch",
                },
                {
                  id: "8k",
                  label: "Raw 8K Master",
                  sub: "Requires Premium Elite",
                },
              ].map((profile) => (
                <div
                  key={profile.id}
                  onClick={() => setResolution(profile.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    resolution === profile.id
                      ? "bg-secondary-container/10 border-secondary"
                      : "bg-surface-container-low border-outline-variant/10 hover:border-outline-variant/40"
                  }`}
                >
                  <p
                    className={`font-bold text-sm ${resolution === profile.id ? "text-secondary" : "text-on-surface"}`}
                  >
                    {profile.label}
                  </p>
                  <p className="text-[11px] text-on-surface-variant mt-1">
                    {profile.sub}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Integration Status Summary Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-6 rounded-xl border border-outline-variant/10 text-center">
            <div className="w-16 h-16 rounded-full bg-surface-container-high border border-outline-variant/20 mx-auto flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-2xl text-secondary">
                hub
              </span>
            </div>
            <h5 className="font-bold text-md mb-1">
              Webhook Dispatcher Status
            </h5>
            <p className="text-xs text-on-surface-variant leading-relaxed max-w-xs mx-auto mb-4">
              Live asynchronous events are pushing changes down into the
              pipeline effortlessly.
            </p>
            <div className="bg-surface-container-lowest/50 p-3 rounded-lg border border-outline-variant/10 text-left space-y-2">
              <div className="flex justify-between text-[11px]">
                <span className="text-on-surface-variant">
                  Last Pulse Request:
                </span>
                <span className="font-mono text-green-400">
                  Success (200 OK)
                </span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-on-surface-variant">
                  Latency Overhead:
                </span>
                <span className="font-mono text-secondary">14ms</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
