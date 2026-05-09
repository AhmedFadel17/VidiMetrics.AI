
interface PaginationProps {
    page: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
    onPageChange: (page: number) => void;
}
export default function Pagination({ page, pageSize, totalPages, totalCount, onPageChange }: PaginationProps) {
    const getPages = () => {
        const pages = [];
        const showMax = 5;

        if (totalPages <= showMax) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            // Always show first page
            pages.push(1);

            if (page > 3) {
                pages.push('...');
            }

            // Show pages around current page
            const start = Math.max(2, page - 1);
            const end = Math.min(totalPages - 1, page + 1);

            // Adjust start/end to ensure we show a consistent number of buttons if possible
            let adjustedStart = start;
            let adjustedEnd = end;
            
            if (page <= 3) {
                adjustedEnd = 4;
            } else if (page >= totalPages - 2) {
                adjustedStart = totalPages - 3;
            }

            for (let i = Math.max(2, adjustedStart); i <= Math.min(totalPages - 1, adjustedEnd); i++) {
                pages.push(i);
            }

            if (page < totalPages - 2) {
                pages.push('...');
            }

            // Always show last page
            if (totalPages > 1) {
                pages.push(totalPages);
            }
        }
        return pages;
    };

    const showingFrom = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
    const showingTo = Math.min(page * pageSize, totalCount);

    return (
        <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 rounded-[2rem] px-8 py-4">
            <span className="text-sm font-medium text-white/40">
                Showing <span className="text-white">{showingFrom}</span>- <span className="text-white">{showingTo}</span> of <span className="text-white">{totalCount}</span> productions
            </span>

            <div className="flex items-center gap-2">
                {/* Previous */}
                <button 
                    disabled={page === 1} 
                    onClick={() => onPageChange(page - 1)} 
                    className="w-10 h-10 flex items-center justify-center rounded-xl text-white/40 hover:text-white hover:bg-white/5 disabled:opacity-20 disabled:hover:bg-transparent transition-all duration-300"
                >
                    <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                </button>

                {/* Pages */}
                {getPages().map((p, i) => (
                    p === '...' ? (
                        <span key={`dots-${i}`} className="w-10 h-10 flex items-center justify-center text-white/20">...</span>
                    ) : (
                        <button
                            key={p}
                            onClick={() => onPageChange(p as number)}
                            className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 font-medium ${
                                page === p
                                    ? 'bg-accent-purple text-white font-bold shadow-[0_0_15px_rgba(138,43,226,0.4)]'
                                    : 'text-white/40 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            {p}
                        </button>
                    )
                ))}

                {/* Next */}
                <button 
                    disabled={page === totalPages || totalPages === 0} 
                    onClick={() => onPageChange(page + 1)} 
                    className="w-10 h-10 flex items-center justify-center rounded-xl text-white/40 hover:text-white hover:bg-white/5 disabled:opacity-20 disabled:hover:bg-transparent transition-all duration-300"
                >
                    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                </button>
            </div>
        </div>
    );
}
