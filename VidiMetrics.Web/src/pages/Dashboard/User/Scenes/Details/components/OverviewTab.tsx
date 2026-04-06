import CharactersSection from "../../../Shared/components/Sections/CharactersSection";
import EnvironmentsSection from "../../../Shared/components/Sections/EnvironmentsSection";

export default function OverviewTab() {
    return (
        <div className="grid grid-cols-12 gap-8">
            <div className="col-span-8 space-y-8">
                <CharactersSection />
            </div>
            <div className="col-span-4 space-y-8">
                <EnvironmentsSection />
            </div>
        </div>
    )
}
