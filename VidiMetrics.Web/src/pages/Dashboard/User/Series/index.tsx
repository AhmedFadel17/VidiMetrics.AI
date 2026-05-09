import SeriesStats from './components/SeriesStats'
import ProductionVault from './components/ProductionVault'
import Breadcrumbs from '@/components/ui/Breadcrumbs'

export default function SeriesLibrary() {
    return (
        <div>
            {/* Page Header */}
            <div className="space-y-4 pb-16">
                <Breadcrumbs items={[
                    { label: 'Home', path: '/' },
                    { label: 'Series Library' }
                ]} />
                <div>
                    <h1 className="text-5xl font-headline font-bold text-white tracking-tight flex items-center gap-4">
                        Series <span className="text-gradient-purple">Library</span>
                    </h1>

                </div>
            </div>

            <div className="space-y-16 pb-20">


                {/* Top Stats Section */}
                <section>
                    <SeriesStats />
                </section>

                {/* Main Library Section */}
                <section>
                    <ProductionVault />
                </section>
            </div>
        </div>
    )
}
