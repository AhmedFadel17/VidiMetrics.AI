import ProfileTab from "./components/ProfileTab";
import PreferencesTab from "./components/PreferencesTab";
import SecurityTab from "./components/SecurityTab";
import BillingsTab from "./components/Billings";
import { useSearchParams } from "react-router-dom";
import { useGetBalanceQuery } from "@/store/apis";

type TabType = "profile" | "security" | "preferences" | "billing";
const tabs: { id: TabType; label: string; icon: string }[] = [
  { id: "profile", label: "Profile", icon: "person" },
  { id: "security", label: "Security", icon: "shield" },
  { id: "preferences", label: "Preferences", icon: "settings" },
  { id: "billing", label: "Billing", icon: "credit_card" },
];
export default function AccountPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: balanceData, isLoading: isBalanceLoading } = useGetBalanceQuery();

  const tabParam = searchParams.get("tab") as TabType;
  let activeTab = tabs.map((t) => t.id).includes(tabParam)
    ? tabParam
    : "profile";
  const setActiveTab = (tab: TabType) => {
    setSearchParams({ tab });
  };
  const wallet = balanceData?.data;
  const total = wallet?.totalCreditsAvailable ?? 0;
  const used = wallet?.creditsUsed ?? 0;
  const remaining = Math.max(0, total - used);
  const fillPercentage = total > 0 ? (remaining / total) * 100 : 0;
  return (
    <div>
      {/* Cinematic Profile Banner Header - Always Visible */}
      <section className="relative h-[320px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-surface via-surface-container-low to-primary-container/20">
          <div className="absolute top-0 right-0 w-2/3 h-full opacity-20 transform translate-x-1/4 -translate-y-1/4">
            <div className="w-full h-full bg-gradient-radial from-secondary/40 to-transparent blur-3xl"></div>
          </div>
        </div>
        <img
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60"
          alt="Cinematic abstract gradient waves background"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBN9dwhaYS7Rpfg0ykxeZxVq93YX3it2QdsHyTPqk3qvOequd6fLmUW4331Kn_7aA5BLYXkjBa8o4ZcY7yg-FLApfALs84IM79NCX_LZy-Z7h-1BMZiLQixiSrMYPGrqm7QdddJRaIt0RMHsJm0rXhPjXy5Gp-KZ6YsE8DC5OWOxoe5UV5MMs_r8_0O0yG6lkORhzfrVQAk2yEW4_DyH9Ai7lZG8M7i1cGXfZ1wIGc4hIBvF9WHbHB03lgLnjRWicGJn1QAyvK6a3k"
        />

        <div className="relative h-full flex items-end px-8 pb-12 max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl overflow-hidden border-4 border-surface shadow-2xl">
                <img
                  alt="Alex Rivera"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwF7HCp3TolejaZ5HaMocUewpeDs5WNxzGEkc3tAaJK3caMrvSCjmqsEypI7BR1pdBgH_St2j6eAwZzewoaxYr-6ub0aP3LT5QbquMP9DVWBey6H-k4g5c7Hfvgk5umAd_23IMxFfMeIV6zMSwrfPRJsqYzpNKSWaZT2pjsMtAwF3cIzP9M9Du6kKoolSeJOzetERlbtbaTB70BJeGKw0D0M2zhYQ1V44VMwpebdnu41nMfZCByU7fL2uf5mwHAIrq_vgc6jzcv_4"
                />
              </div>
              <button className="absolute bottom-1 right-1 bg-secondary text-on-secondary p-2 rounded-xl shadow-lg hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-sm">
                  photo_camera
                </span>
              </button>
            </div>
            <div className="text-center md:text-left mb-2">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-on-surface tracking-tight">
                Alex Rivera
              </h2>
              <p className="text-secondary font-label uppercase tracking-[0.2em] text-sm mt-1">
                Creative Director • VidiMetrics Premium
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="px-8 -mt-8 pb-20 max-w-7xl mx-auto w-full">
        <div className="lg:col-span-8 space-y-8">
          {/* Bento Statistics Overview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between h-40 group hover:bg-surface-container-high transition-all">
              <div className="flex justify-between items-start">
                <span className="material-symbols-outlined text-primary text-3xl">
                  video_library
                </span>
                <span className="text-xs font-label text-on-surface-variant uppercase tracking-wider">
                  Series
                </span>
              </div>
              <div>
                <h3 className="text-3xl font-display font-bold">12</h3>
                <p className="text-xs text-on-surface-variant">
                  Active Productions
                </p>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between h-40 group hover:bg-surface-container-high transition-all">
              <div className="flex justify-between items-start">
                <span className="material-symbols-outlined text-secondary text-3xl">
                  dynamic_feed
                </span>
                <span className="text-xs font-label text-on-surface-variant uppercase tracking-wider">
                  Scenes
                </span>
              </div>
              <div>
                <h3 className="text-3xl font-display font-bold">2,482</h3>
                <p className="text-xs text-on-surface-variant">
                  Rendered to date
                </p>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between h-40 group hover:bg-surface-container-high transition-all">
              <div className="flex justify-between items-start">
                <span className="material-symbols-outlined text-tertiary text-3xl">
                  bolt
                </span>
                <span className="text-xs font-label text-on-surface-variant uppercase tracking-wider">
                  AI Credits
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-tertiary">{remaining} Left</span>
                  <span className="opacity-50">{total} Total</span>
                </div>
                <div className="w-full bg-surface-container-lowest h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-tertiary to-tertiary-container h-full rounded-full shadow-[0_0_8px_rgba(255,176,205,0.4)]"
                    style={{ width: `${fillPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full">
            <div className="bg-surface-container-low/40 border border-outline-variant/10 p-2 rounded-2xl flex items-center justify-between gap-2 md:gap-4 overflow-x-auto scrollbar-none">
              <div className="flex items-center gap-1 md:gap-4 w-full">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-label tracking-wide font-medium transition-all duration-200 whitespace-nowrap group ${isActive
                        ? "bg-surface text-secondary border border-outline-variant/10 shadow-lg shadow-background/40 font-bold"
                        : "text-on-surface-variant/70 hover:text-on-surface hover:bg-surface-container-high/30"
                        }`}
                    >
                      <span
                        className={`material-symbols-outlined text-xl transition-transform group-hover:scale-105 ${isActive
                          ? "text-secondary font-variation-fill"
                          : "text-on-surface-variant/60"
                          }`}
                      >
                        {tab.icon}
                      </span>
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="w-full animation-fade-in">
            {activeTab === "profile" && <ProfileTab />}
            {activeTab === "preferences" && <PreferencesTab />}
            {activeTab === "security" && <SecurityTab />}
            {activeTab === "billing" && <BillingsTab wallet={wallet} />}
          </div>
        </div>
      </div>
    </div>
  );
}
