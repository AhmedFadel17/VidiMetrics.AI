import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";

export default function DashboardNavbar() {
  const auth = useAuth();
  const navigate = useNavigate();
  const user = auth.user;

  const hasNotifications = true; // Mocking new notifications

  const handleLogout = () => {
    auth.signoutRedirect();
  };

  return (
    <header className="h-20 border-b border-white/5 px-10 flex items-center justify-end sticky top-0 z-30 bg-dashboard-bg/80 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-4 border-r border-white/5 pr-4">
          {/* Notifications Dropdown */}
          <Menu as="div" className="relative">
            <Menu.Button className="w-10 h-10 flex items-center justify-center relative hover:bg-white/5 rounded-xl transition-colors group">
              <span className="material-symbols-outlined text-white/60 text-xl group-hover:text-white transition-colors">
                notifications
              </span>
              {hasNotifications && (
                <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-yellow-400 rounded-full border-2 border-dashboard-bg shadow-[0_0_10px_rgba(250,204,21,0.5)]"></span>
              )}
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="transform opacity-0 scale-95 -translate-y-2"
              enterTo="transform opacity-100 scale-100 translate-y-0"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100 translate-y-0"
              leaveTo="transform opacity-0 scale-95 -translate-y-2"
            >
              <Menu.Items className="absolute right-0 bg-surface-container-low w-80 origin-top-right glass-card rounded-lg overflow-hidden focus:outline-none z-50 ring-1 ring-white/10">
                <div className="p-4 border-b border-white/5 bg-white/5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white tracking-wide">
                      Notifications
                    </h3>
                    <span className="bg-yellow-400/20 text-yellow-400 text-[10px] px-2 py-0.5 rounded-full font-bold">
                      NEW
                    </span>
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <div className="p-8 text-center flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                      <span className="material-symbols-outlined text-white/20 text-2xl">
                        notifications_off
                      </span>
                    </div>
                    <p className="text-white/40 text-xs font-medium">
                      You're all caught up!
                    </p>
                  </div>
                </div>
                <div className="p-3 bg-white/5 text-center border-t border-white/5">
                  <button
                    onClick={() => navigate("/dashboard/notifications")}
                    className="text-[10px] uppercase tracking-widest font-bold text-primary hover:text-primary-light transition-colors"
                  >
                    View All Activity
                  </button>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>

          <button className="w-10 h-10 flex items-center justify-center hover:bg-white/5 rounded-xl transition-colors group">
            <span className="material-symbols-outlined text-white/60 text-xl group-hover:text-white transition-colors">
              language
            </span>
          </button>
        </div>

        {/* User Dropdown */}
        <Menu as="div" className="relative">
          <Menu.Button className="flex items-center gap-4 p-1.5 outline-none">
            <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white/10 p-[2px] group-hover:border-primary/50 transition-all duration-300">
              <img
                src={
                  user?.profile.picture ||
                  "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                }
                alt="Operator"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="transform opacity-0 scale-95 -translate-y-2"
            enterTo="transform opacity-100 scale-100 translate-y-0"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100 translate-y-0"
            leaveTo="transform opacity-0 scale-95 -translate-y-2"
          >
            <Menu.Items className="absolute right-0 w-64 p-2 font-medium text-sm origin-top-right glass-card rounded-lg overflow-hidden focus:outline-none z-50 ring-1 ring-white/10 bg-surface-container-low">
              <div className="p-3 border-b border-white/5">
                <div className="flex flex-col">
                  <span className="text-base capitalize text-white truncate">
                    {user?.profile.given_name + " " + user?.profile.family_name}
                  </span>
                  <span className="text-sm text-white/40 truncate">
                    {user?.profile.email}
                  </span>
                </div>
              </div>
              <div className=" py-3">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => navigate("/dashboard/account?tab=profile")}
                      className={`${
                        active ? "bg-white/10 text-white" : "text-white/60"
                      } group flex w-full justify-between items-center rounded px-3 py-1 text-xs transition-all duration-200 uppercase tracking-widest`}
                    >
                      My Profile
                      <span className="material-symbols-outlined text-lg opacity-60">
                        person
                      </span>
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() =>
                        navigate("/dashboard/account?tab=preferences")
                      }
                      className={`${
                        active ? "bg-white/10 text-white" : "text-white/60"
                      } group flex w-full justify-between items-center rounded px-3 py-1 text-xs transition-all duration-200 uppercase tracking-widest`}
                    >
                      Settings
                      <span className="material-symbols-outlined text-lg opacity-60">
                        settings
                      </span>
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleLogout}
                      className={`${
                        active ? "bg-red-500 text-white" : "text-red-500/80"
                      } group flex justify-between w-full items-center rounded px-3 py-1 text-xs font-bold transition-all duration-200 uppercase tracking-widest`}
                    >
                      Logout
                      <span className="material-symbols-outlined text-lg">
                        logout
                      </span>
                    </button>
                  )}
                </Menu.Item>
              </div>
              <div className="border-t border-white/5 py-3">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => navigate("/privacy")}
                      className={`${
                        active ? "bg-white/10 text-white" : "text-white/60"
                      } group flex  w-full items-center rounded px-3 py-2 text-xs transition-all duration-200 uppercase tracking-widest`}
                    >
                      Privacy Policy
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => navigate("/terms")}
                      className={`${
                        active ? "bg-white/10 text-white" : "text-white/60"
                      } group flex justify-between w-full items-center rounded px-3 py-2 text-xs transition-all duration-200 uppercase tracking-widest`}
                    >
                      Terms of use
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </header>
  );
}
