import { useEffect, useState } from 'react'

import ActiveSeries from './components/ActiveSeries'
import GrowthEngine from './components/GrowthEngine'
import AutomatedDistribution from './components/AutomatedDistribution'
import SocialPulse from './components/SocialPulse'
import EngineControls from './components/EngineControls'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import { PageHeader } from '@/components/ui/PageHeader'

export default function UserHome() {

  const [loading, setLoading] = useState(true)



  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Breadcrumbs items={[
        { label: 'Dashboard' },
        { label: 'Home' },
      ]} />
      <div className="py-5 flex justify-between gap-6">
        <div className="md:w-2/3 ">
          <PageHeader
            chipText="SYSTEM ONLINE"
            titlePrefix="VidiMetrics"
            gradientText=".AI"
            description="Analyze and optimize your video performance across multiple platforms."
          />
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-8 space-y-12">
          <ActiveSeries />
        </div>
        <div className="col-span-4 space-y-8">
          <SocialPulse />
        </div>
      </div>


    </div>
  )
}
