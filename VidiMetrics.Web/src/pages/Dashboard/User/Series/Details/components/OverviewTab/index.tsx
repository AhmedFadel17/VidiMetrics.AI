import CharactersSection from "./CharactersSection";
import EnvironmentsSection from "./EnvironmentsSection";
import EpisodesSection from "./EpisodesSection";

import { Show } from "@/types/models/storyEngine";

interface OverviewTabProps {
    show: Show;
}

export default function OverviewTab({ show }: OverviewTabProps) {
    return (
        <div className="grid grid-cols-12 gap-8">
            <div className="col-span-8 space-y-8">
                <CharactersSection showId={show.id} />
            </div>
            <div className="col-span-4 space-y-8">
                <EnvironmentsSection showId={show.id} />
            </div>
            <div className="col-span-12">
                <EpisodesSection showId={show.id} />
            </div>
        </div>
    )
}