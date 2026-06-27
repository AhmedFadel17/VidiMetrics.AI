import { Button } from "@/components/ui/Button";
import InviteCard from "@/components/ui/Cards/InviteCard";
import { ErrorScreen, LoadingScreen } from "@/components/ui/Feedback/StatusScreens";
import { useGetUserProfileQuery, useUpdateUserProfileMutation } from "@/store/apis";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function ProfileTab() {
  const [isEditing, setIsEditing] = useState(false);
  const { data: profileData, isLoading: isProfileLoading, error: profileError } = useGetUserProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateUserProfileMutation();

  const profile = profileData?.data;

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    bio: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || "",
        email: profile.email || "",
        bio: profile.bio || "",
      });
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDiscard = () => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || "",
        email: profile.email || "",
        bio: profile.bio || "",
      });
    }
    setIsEditing(false);
    toast.info("Changes discarded");
  };

  const handleSave = async () => {
    try {
      await updateProfile({
        fullName: formData.fullName,
        email: formData.email,
        bio: formData.bio,
      }).unwrap();
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile");
      console.error("Update error:", error);
    }
  };

  if (isProfileLoading) return <LoadingScreen message="Loading Profile" />;
  if (profileError) return <ErrorScreen title="Profile Error" message="Failed to load profile" />;

  return (
    <div className="grid grid-cols-12 flex flex-col gap-6">
      <div className="lg:col-span-8 space-y-8">
        <div className="glass-panel p-8 rounded-xl space-y-8 border border-white/5 bg-white/[0.01]">

          <div className="flex justify-between items-center">
            <h3 className="text-xl font-display font-bold text-white">
              Personal Information
            </h3>

            {!isEditing && (
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="flex items-center"
              >
                <span className="material-symbols-outlined text-sm pr-3">edit</span>
                Edit Details
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-label uppercase tracking-widest text-white/40 ml-1">
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-purple/50 focus:bg-white/10 transition-all font-bold text-sm"
                />
              ) : (
                <div className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-white/80 font-bold text-sm">
                  {formData.fullName || <span className="text-white/20 font-normal italic">No name provided</span>}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1 mt-2">
                <label className="text-xs font-label uppercase tracking-widest text-white/40">
                  Email Address
                </label>
                {isEditing && (
                  <span className="text-[10px] text-accent-purple/80 font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">lock</span>
                    Managed by Account Security
                  </span>
                )}
              </div>

              <div className="w-full bg-black/40 border border-white/5 opacity-60 rounded-xl px-4 py-3 text-white/50 font-bold text-sm flex items-center justify-between select-none">
                <span>{formData.email}</span>
                <span className="material-symbols-outlined text-sm text-white/20">lock</span>
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-label uppercase tracking-widest text-white/40 ml-1">
                Bio
              </label>
              {isEditing ? (
                <textarea
                  name="bio"
                  rows={3}
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-purple/50 focus:bg-white/10 transition-all font-bold text-sm resize-none"
                />
              ) : (
                <div className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-white/80 font-bold text-sm min-h-[48px]">
                  {formData.bio || <span className="text-white/20 font-normal italic">Write something about yourself...</span>}
                </div>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5 animation-fade-in">
              <button
                type="button"
                onClick={handleDiscard}
                disabled={isUpdating}
                className="px-5 py-2.5 rounded-xl text-xs uppercase tracking-widest font-bold text-white/60 hover:text-white hover:bg-white/5 transition-all"
              >
                Discard
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={isUpdating}
                className="px-6 py-2.5 rounded-xl text-xs uppercase tracking-widest font-bold flex items-center gap-2 transition-all bg-accent-cyan text-black shadow-[0_0_20px_rgba(0,242,255,0.2)] hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? (
                  <>
                    <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                    Saving...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">save</span>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          )}

        </div>
      </div>

      <div className="lg:col-span-4 space-y-8">
        <InviteCard />
      </div>
    </div>
  );
}