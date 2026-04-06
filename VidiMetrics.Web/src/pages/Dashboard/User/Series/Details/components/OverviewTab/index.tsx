import CharactersSection from "../../../../Shared/components/Sections/CharactersSection";
import EnvironmentsSection from "../../../../Shared/components/Sections/EnvironmentsSection";
import EpisodesSection from "../../../../Shared/components/Sections/EpisodesSection";
import RecentScenes from "../../../../Shared/components/Sections/RecentScenes";
import ActiveSynthetics from "../../../../Shared/components/Sections/ActiveSyntheticsSection";

export default function OverviewTab() {
    return (
        <div className="grid grid-cols-12 gap-8">
            <div className="col-span-8 space-y-8">
                <CharactersSection />
            </div>
            <div className="col-span-4 space-y-8">
                <EnvironmentsSection />
            </div>
            <div className="col-span-12">
                <EpisodesSection />
            </div>
            <div className="col-span-6 space-y-8">
                <RecentScenes />
            </div>
            <div className="col-span-6 space-y-8">
                <ActiveSynthetics />
            </div>
        </div>
    )
}