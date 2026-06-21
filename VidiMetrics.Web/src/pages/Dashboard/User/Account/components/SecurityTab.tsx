import { useAuth } from "react-oidc-context";
import { showToast } from "@/utils/toast";

export default function SecurityTab() {
  const auth = useAuth();
  const user = auth.user;
  const isEmailVerified = user?.profile.email_verified === true;
  const handlePasswordReset = () => {
    const identityServerUrl = import.meta.env.VITE_IDENTITY_SERVER_URL;
    const returnUrl = encodeURIComponent(window.location.origin + "/callback");
    const targetUrl = `${identityServerUrl}/Recovery?ReturnUrl=${returnUrl}`;

    showToast.info(
      "Redirecting",
      "Navigating to Identity Server Recovery portal...",
    );
    setTimeout(() => {
      window.location.href = targetUrl;
    }, 1200);
  };
  return (
    <div className="glass-card rounded-[3rem] p-10 border border-white/5 space-y-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent-purple/5 blur-[100px] pointer-events-none"></div>

      <div className="border-b border-white/5 pb-6">
        <h3 className="text-3xl font-headline font-bold text-white tracking-tight">
          Account Security
        </h3>
        <p className="text-white/40 text-sm mt-1">
          Manage credentials and authentication details.
        </p>
      </div>

      <div className="space-y-6 w-full">
        {/* Email Verification Status */}
        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white">
              Email Authentication Status
            </h4>
            <p className="text-xs text-white/40 leading-relaxed">
              Your email address is used for password recovery and system status
              notifications.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 self-start md:self-center">
            {isEmailVerified ? (
              <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider">
                <span className="material-symbols-outlined text-sm">
                  verified
                </span>
                Verified
              </div>
            ) : (
              <div className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider">
                <span className="material-symbols-outlined text-sm">
                  warning
                </span>
                Unverified
              </div>
            )}
          </div>
        </div>

        {/* Reset Password Redirect */}
        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white">
              Change Credentials / Password
            </h4>
            <p className="text-xs text-white/40 leading-relaxed">
              Securely reset your login password. You will be redirected to the
              Identity Server.
            </p>
          </div>

          <button
            onClick={handlePasswordReset}
            className="px-5 py-2.5 rounded-xl text-[10px] uppercase tracking-widest font-black flex items-center gap-2 transition-all duration-300 bg-white/5 text-white hover:bg-white/10 border border-white/10 hover:scale-[1.02] active:scale-[0.98] self-start md:self-center flex-shrink-0"
          >
            <span className="material-symbols-outlined text-sm">key</span>
            Reset Password
          </button>
        </div>

        {/* Danger Zone: Account Deletion */}
        <div className="border border-red-500/10 bg-red-500/[0.01] rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-red-400">
            <span className="material-symbols-outlined">report</span>
            <h4 className="text-sm font-bold uppercase tracking-wider">
              Danger Zone
            </h4>
          </div>
          <p className="text-xs text-white/50 leading-relaxed">
            Permanently delete your profile workspace and sign credentials. This
            action will destroy all configuration data inside this node and
            clear local sessions.
          </p>
          <div className="pt-2">
            <button
              type="button"
              className="px-5 py-2.5 rounded-xl text-[10px] uppercase tracking-widest font-black bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
