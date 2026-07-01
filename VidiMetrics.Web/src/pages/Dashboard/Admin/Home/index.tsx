import Breadcrumbs from '@/components/ui/Breadcrumbs'
import { PageHeader } from '@/components/ui/PageHeader'

import AICopilotActivityCenter from './components/AICopilotActivityCenter'
import MediaActivityCenter from './components/MediaVisualMatrix'
import ProductionTimelineQuickActions from './components/ProductionTimelineQuickActions'
import StoryEnginePipelineMetrics from './components/StoryEnginePipelineMetrics'

export default function AdminHome() {
    return (
        <div className="flex h-full flex-col overflow-auto">
            <Breadcrumbs
                items={[
                    { label: 'Admin Dashboard' },
                    { label: 'Home' },
                ]}
            />
            <div className="py-5 flex justify-between gap-6">
                <div className="md:w-2/3">
                    <PageHeader
                        chipText="SYSTEM ONLINE"
                        titlePrefix="VidiMetrics"
                        gradientText=".AI"
                        description="A premium production workspace for automation, story operations, media consistency, and AI-assisted publishing."
                    />
                </div>
            </div>
            {/* Main Workspace Grid */}
            <section className="grid grid-cols-12 gap-6">
                <div className="col-span-12">
                    <StoryEnginePipelineMetrics />

                </div>
                {/* Left column */}
                <div className="col-span-12 xl:col-span-8">
                    <div className='space-y-6'>
                        <ProductionTimelineQuickActions />
                    </div>


                </div>

                {/* Right column */}
                <div className="col-span-12 space-y-6 xl:col-span-4">
                    <AICopilotActivityCenter />
                    <MediaActivityCenter />
                </div>
            </section>
        </div>
    )
}









