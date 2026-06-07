import { useEffect, useState } from 'react'

import ActiveSeries from './components/ActiveSeries'
import GrowthEngine from './components/GrowthEngine'
import AutomatedDistribution from './components/AutomatedDistribution'
import SocialPulse from './components/SocialPulse'
import EngineControls from './components/EngineControls'

export default function UserHome() {

  const [loading, setLoading] = useState(true)



  return (
    <div className="space-y-12 pb-20">
      {/* Hero Section */}
      <section className="relative">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse shadow-[0_0_10px_#00f2ff]"></div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent-cyan">System Online</span>
        </div>
        <div className='flex items-center justify-between'>
          <h1 className="text-7xl font-headline font-bold tracking-tight text-white flex items-baseline gap-4">
            Command <span className="text-gradient-purple">Center</span>
          </h1>
          {/* Top Right Status Badges */}

        </div>



      </section>

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
