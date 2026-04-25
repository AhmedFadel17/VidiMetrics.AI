import CharactersSection from "../../../../Shared/components/Sections/CharactersSection";
import EnvironmentsSection from "../../../../Shared/components/Sections/EnvironmentsSection";
import EpisodesSection from "../../../../Shared/components/Sections/EpisodesSection";
import RecentScenes from "../../../../Shared/components/Sections/RecentScenes";
import ActiveSynthetics from "../../../../Shared/components/Sections/ActiveSyntheticsSection";

import { Show } from "@/types/models/storyEngine";

interface OverviewTabProps {
    show: Show;
}

export default function OverviewTab({ show }: OverviewTabProps) {
    return (
        <div className="grid grid-cols-12 gap-8">
            <div className="col-span-8 space-y-8">
                <CharactersSection showId={show.id} initialData={show.characters} />
            </div>
            <div className="col-span-4 space-y-8">
                <EnvironmentsSection showId={show.id} initialData={show.storyEnvironments} />
            </div>
            <div className="col-span-12">
                <EpisodesSection showId={show.id} initialData={show.episodes} />
            </div>
            <div className="col-span-12 space-y-8">
                <ActiveSynthetics />
            </div>
        </div>
    )
}