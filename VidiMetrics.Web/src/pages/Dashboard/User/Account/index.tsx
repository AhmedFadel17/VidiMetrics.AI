import ProfileTab from "./components/ProfileTab";
import PreferencesTab from "./components/PreferencesTab";
import SecurityTab from "./components/SecurityTab";
import BillingsTab from "./components/Billings";
import { useSearchParams } from "react-router-dom";
import { useGetUserProfileQuery, useUpdateUserProfilePictureMutation } from "@/store/apis";
import { toast } from "sonner";
import { useRef } from "react";

type TabType = "profile" | "security" | "preferences" | "billing";
const tabs: { id: TabType; label: string; icon: string }[] = [
  { id: "profile", label: "Profile", icon: "person" },
  { id: "security", label: "Security", icon: "shield" },
  { id: "preferences", label: "Preferences", icon: "settings" },
  { id: "billing", label: "Billing", icon: "credit_card" },
];

export default function AccountPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: profileData } = useGetUserProfileQuery();
  const [uploadProfilePicture, { isLoading: isUploadingPic }] = useUpdateUserProfilePictureMutation();

  const profile = profileData?.data;
  const defaultAvatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200";

  const tabParam = searchParams.get("tab") as TabType;
  let activeTab = tabs.map((t) => t.id).includes(tabParam) ? tabParam : "profile";

  const setActiveTab = (tab: TabType) => {
    setSearchParams({ tab });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file (PNG/JPEG).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds our 5MB security allocation threshold.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await uploadProfilePicture(formData).unwrap();
      toast.success("Profile avatar updated successfully!");
    } catch (err) {
      toast.error("Failed to upload profile photo to cloud storage.");
      console.error(err);
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/jpg"
        className="hidden"
      />

      <section className="relative h-[320px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-surface via-surface-container-low to-primary-container/20">
          <div className="absolute top-0 right-0 w-2/3 h-full opacity-20 transform translate-x-1/4 -translate-y-1/4">
            <div className="w-full h-full bg-gradient-radial from-secondary/40 to-transparent blur-3xl"></div>
          </div>
        </div>
        <img
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-20 blur-sm select-none"
          alt="Cinematic background"
          src={profile?.profilePictureUrl || defaultAvatar}
        />

        <div className="relative h-full flex items-end px-8 pb-12 max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
            <div className="relative group">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl overflow-hidden border-4 border-surface bg-surface-container shadow-2xl relative">
                <img
                  alt={profile?.fullName}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${isUploadingPic ? 'opacity-40' : 'opacity-100'}`}
                  src={profile?.profilePictureUrl || defaultAvatar}
                />
                {isUploadingPic && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-xl text-white animate-spin">sync</span>
                  </div>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingPic}
                className="absolute bottom-1 right-1 bg-accent-purple text-white p-2 rounded-xl shadow-lg hover:scale-110 active:scale-95 transition-transform disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-sm">
                  photo_camera
                </span>
              </button>
            </div>

            <div className="text-center md:text-left mb-2">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
                {profile?.fullName || "Loading Account..."}
              </h2>
              <p className="text-accent-cyan font-label uppercase tracking-[0.2em] text-xs mt-1">
                Workspace Member • VidiMetrics Engine Client
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs and Tab Panels */}
      <div className="px-8 -mt-8 pb-20 max-w-7xl mx-auto w-full">
        <div className="lg:col-span-8 space-y-8">
          <div className="glass-panel border border-white/5 p-2 rounded-2xl flex items-center justify-between gap-2 md:gap-4 overflow-x-auto scrollbar-none bg-white/[0.01]">
            <div className="flex items-center gap-1 md:gap-4 w-full">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-label tracking-wide font-medium transition-all duration-200 whitespace-nowrap group ${isActive
                      ? "bg-white/5 text-white border border-white/10 shadow-lg font-bold"
                      : "text-white/40 hover:text-white hover:bg-white/5"
                      }`}
                  >
                    <span className={`material-symbols-outlined text-xl transition-transform group-hover:scale-105 ${isActive ? "text-accent-purple" : "text-white/30"}`}>
                      {tab.icon}
                    </span>
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="w-full animation-fade-in">
            {activeTab === "profile" && <ProfileTab />}
            {activeTab === "preferences" && <PreferencesTab />}
            {activeTab === "security" && <SecurityTab />}
            {activeTab === "billing" && <BillingsTab />}
          </div>
        </div>
      </div>
    </div>
  );
}