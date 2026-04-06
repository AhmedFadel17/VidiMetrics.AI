import RecentScenes from "../../../Shared/components/Sections/RecentScenes";

export default function OverviewTab() {
    return (
        <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 space-y-8">
                <RecentScenes />
            </div>
        </div>
    )
}
