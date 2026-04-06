import RecentScenes from "../../../Shared/components/Sections/RecentScenes";
import ActiveSynthetics from "../../../Shared/components/Sections/ActiveSyntheticsSection";

export default function OverviewTab() {
    return (
        <div className="grid grid-cols-12 gap-8">
            <div className="col-span-6 space-y-8">
                <RecentScenes />
            </div>
            <div className="col-span-6 space-y-8">
                <ActiveSynthetics />
            </div>
        </div>
    )
}
