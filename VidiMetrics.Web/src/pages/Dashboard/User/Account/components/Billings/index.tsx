import CreditsSection from './CreditsSection';
import PlansSections from './PlansSections';
import CreditsLogsSection from './CreditsLogsSection';
import BillingsHistorySection from './BillingsHistorySection';



export default function BillingsTab() {
  return (
    <div className="space-y-12">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 space-y-8">
          <PlansSections />
          <BillingsHistorySection />
          <CreditsSection />
          <CreditsLogsSection />
        </div>
      </div>

    </div>
  );
}