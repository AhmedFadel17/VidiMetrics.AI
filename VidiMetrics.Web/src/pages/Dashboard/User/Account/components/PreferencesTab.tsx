import { useState } from "react";

export default function PreferencesTab() {
  const [soundEffects, setSoundEffects] = useState(false);
  const [autoCompile, setAutoCompile] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [productionNotifications, setProductionNotifications] = useState(true);
  return (
    <div className="glass-panel p-8 rounded-3xl">
      <h3 className="text-xl font-display font-bold mb-8">Local Preferences</h3>
      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-surface-container-lowest/30 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-secondary/10 text-secondary rounded-xl">
              <span className="material-symbols-outlined">
                notifications_active
              </span>
            </div>
            <div>
              <p className="font-bold">Production Notifications</p>
              <p className="text-xs text-on-surface-variant">
                Alerts when a render is complete
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              checked={productionNotifications}
              onChange={(e) => setProductionNotifications(e.target.checked)}
              className="sr-only peer"
              type="checkbox"
            />
            <div className="w-12 h-6 bg-surface-variant rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
          </label>
        </div>
        <div className="flex items-center justify-between p-4 bg-surface-container-lowest/30 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-secondary/10 text-secondary rounded-xl">
              <span className="material-symbols-outlined">auto_awesome</span>
            </div>
            <div>
              <p className="font-bold">AI Auto-Compile</p>
              <p className="text-xs text-on-surface-variant">
                Auto compile the ai generated scene
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              checked={autoCompile}
              onChange={(e) => setAutoCompile(e.target.checked)}
              className="sr-only peer"
              type="checkbox"
            />
            <div className="w-12 h-6 bg-surface-variant rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
          </label>
        </div>
        <div className="flex items-center justify-between p-4 bg-surface-container-lowest/30 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-secondary/10 text-secondary rounded-xl">
              <span className="material-symbols-outlined">email</span>
            </div>
            <div>
              <p className="font-bold">Email Notifications</p>
              <p className="text-xs text-on-surface-variant">
                Receive emails about your account
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
              className="sr-only peer"
              type="checkbox"
            />
            <div className="w-12 h-6 bg-surface-variant rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
          </label>
        </div>
        <div className="flex items-center justify-between p-4 bg-surface-container-lowest/30 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-secondary/10 text-secondary rounded-xl">
              <span className="material-symbols-outlined">volume_up</span>
            </div>
            <div>
              <p className="font-bold">Interface Audio</p>
              <p className="text-xs text-on-surface-variant">
                enable audio notifications
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              checked={soundEffects}
              onChange={(e) => setSoundEffects(e.target.checked)}
              className="sr-only peer"
              type="checkbox"
            />
            <div className="w-12 h-6 bg-surface-variant rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
          </label>
        </div>
      </div>
    </div>
  );
}
