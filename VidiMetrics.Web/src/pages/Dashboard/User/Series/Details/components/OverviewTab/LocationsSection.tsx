import LocationCard from "@/components/ui/Cards/LocationCard";
import {
  ErrorScreen,
  LoadingScreen,
} from "@/components/ui/Feedback/StatusScreens";
import { useGetLocationsQuery } from "@/store/apis";
import { Location } from "@/types/models/storyEngine";
import { useNavigate } from "react-router-dom";

interface LocationsSectionProps {
  showId: string;
}

export default function LocationsSection({
  showId,
}: LocationsSectionProps) {
  const {
    data: response,
    isLoading,
    error,
  } = useGetLocationsQuery({ showId, limit: 2 });
  const locations: Location[] = response?.data?.items || [];
  const navigate = useNavigate();
  if (isLoading) return <LoadingScreen message="Loading Locations" />;
  if (error)
    return (
      <ErrorScreen
        onRetry={() => { }}
        title="Error"
        message="Failed to load locations"
      />
    );
  return (
    <div className="glass-card rounded-xl p-10 border border-white/5 h-full flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-headline font-bold text-white tracking-tight">
          Locations
        </h3>
        <button
          onClick={() =>
            navigate(`/dashboard/series/${showId}?tab=Locations`)
          }
          className="text-xs font-black uppercase tracking-widest text-accent-cyan hover:text-primary transition-colors duration-300 flex items-center gap-2"
        >
          <span>View All</span>
          <span className="material-symbols-outlined text-sm">
            arrow_forward
          </span>
        </button>
      </div>

      <div className="space-y-4 flex-grow flex flex-col justify-center">
        {locations.length === 0 ? (
          <button
            onClick={() =>
              navigate(`/dashboard/series/${showId}/locations/new`)
            }
            className="w-full relative group overflow-hidden hover:from-white/[0.03] hover:to-white/[0.06] transition-all duration-500 flex flex-col items-center justify-center p-8 text-center min-h-[220px]"
          >
            <div className="absolute -inset-y-12 -inset-x-12 bg-gradient-to-r from-accent-cyan/0 via-accent-cyan/5 to-accent-cyan/0 group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
            <div className="relative space-y-4 z-10 flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-accent-cyan/5 border border-accent-cyan/10 flex items-center justify-center group-hover:scale-110 group-hover:border-accent-cyan/30 group-hover:shadow-[0_0_20px_rgba(0,242,255,0.15)] transition-all duration-500 animate-bounce [animation-duration:3s]">
                <span className="material-symbols-outlined text-accent-cyan text-2xl">
                  landscape
                </span>
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-white group-hover:text-accent-cyan transition-colors">
                  No Worlds Discovered
                </h4>
                <p className="text-[11px] text-white/40 max-w-[240px] leading-relaxed">
                  Your story needs a setting. Click here to start your journey
                  and generate your first world environment!
                </p>
              </div>
            </div>
          </button>
        ) : (
          locations.map((location, index) => (
            <LocationCard key={index} location={location} />
          ))
        )}
      </div>
      <div className="mt-4">
        {locations.length > 0 && (
          <button
            onClick={() =>
              navigate(`/dashboard/series/${showId}/locations/new`)
            }
            className="mt-2 w-full glass-card hover:bg-white/10 px-6 py-4 rounded-xl flex items-center justify-center gap-3 border border-white/5 transition-all duration-300 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white"
          >
            Generate New World
          </button>
        )}
      </div>
    </div>
  );
}
