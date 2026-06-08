import Breadcrumbs from '@/components/ui/Breadcrumbs'
import { PageHeader } from '@/components/ui/PageHeader';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetShowsQuery } from '@/store/apis/storyEngine/shows.api'
import { Series } from '@/types/series'
import { ShowStatus } from '@/types/enums'
import { FilterOption } from '@/types/ui'
import Pagination from '@/components/ui/Pagination'
import SeriesCard from '@/components/ui/Cards/SeriesCard'
import { ErrorScreen, LoadingScreen } from '@/components/ui/Feedback/StatusScreens'
import GridHeader from '@/components/ui/GridHeader';
import GlassLaunchButton from '@/components/ui/Buttons/GlassLaunchButton';
export default function SeriesLibrary() {
    const navigate = useNavigate();
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(8)
    const [status, setStatus] = useState<ShowStatus | undefined>(undefined)
    const [searchTerm, setSearchTerm] = useState('')

    const { data: response, isLoading, error } = useGetShowsQuery({
        pageNumber: page,
        pageSize,
        status,
        searchTerm
    })
    const handleStatusChange = (newStatus: string) => {
        setStatus(newStatus === 'all' ? undefined : parseInt(newStatus) as ShowStatus)
        setPage(1)
    }

    const statusOptions: FilterOption[] = [
        { label: 'All Status', value: 'all' },
        { label: 'Draft', value: ShowStatus.Draft },
        { label: 'In Production', value: ShowStatus.InProduction },
        { label: 'Published', value: ShowStatus.Published },
        { label: 'Archived', value: ShowStatus.Archived },
    ];
    if (isLoading) return <LoadingScreen message="Loading shows..." />
    if (error) return <ErrorScreen title='Network Error' message="Failed to fetch series. Please try again." />
    const showsData = response?.data;
    const shows: Series[] = showsData?.items || []
    return (
        <div className='flex flex-col h-full overflow-hidden'>
            {/* Page Header */}
            <div className="">
                <Breadcrumbs items={[
                    { label: 'Home', path: '/' },
                    { label: 'Series Library' }
                ]} />
                <div className="py-5 flex justify-between gap-6">
                    <PageHeader
                        chipText="Series Library"
                        titlePrefix="Manage "
                        gradientText="Series"
                        description="Manage and track your AI-generated cinematic series."
                    />
                    <div className='flex justify-end items-center'>
                        <GlassLaunchButton
                            title="Generate New Series"
                            subtitle="Tap to Launch AI Screenwriter"
                            iconName="auto_awesome"
                            variant="cyan"
                            onClick={() => navigate('/dashboard/series/new')}
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-4">


                <div className=''>
                    <GridHeader
                        searchOption={{
                            placeholder: "Search series...",
                            value: searchTerm,
                            onChange: (val) => {
                                setSearchTerm(val);
                                setPage(1);
                            }
                        }}
                        filterOptions={{
                            options: statusOptions,
                            value: status === undefined ? 'all' : status,
                            onChange: (val) => handleStatusChange(val)
                        }}


                    />
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {shows.map(show => (
                        <SeriesCard key={show.id} show={show} />
                    ))}
                </div>
                {/* Footer Pagination */}
                <div className="">

                    <Pagination
                        page={showsData?.pageNumber || 1}
                        totalPages={showsData?.totalPages || 0}
                        pageSize={showsData?.pageSize || 0}
                        totalCount={showsData?.totalCount || 0}
                        onPageChange={(page) => setPage(page)}
                        pageSizeOption={{
                            values: [4, 8, 12, 16, 20],
                            onChange: (size) => {
                                setPageSize(size);
                                setPage(1);
                            }
                        }}

                    />
                </div>
            </div>
        </div>
    )
}
