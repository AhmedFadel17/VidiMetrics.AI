import CharactersSection from "../../../Series/Details/components/OverviewTab/CharactersSection";
import EnvironmentsSection from "../../../Series/Details/components/OverviewTab/EnvironmentsSection";

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
