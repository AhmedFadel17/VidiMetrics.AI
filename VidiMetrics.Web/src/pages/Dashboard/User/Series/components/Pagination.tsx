export default function Pagination() {
    return (
        <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 rounded-[2rem] px-8 py-4">
            <span className="text-sm font-medium text-white/40">
                Showing <span className="text-white">1-5</span> of <span className="text-white">42</span> productions
            </span>
            
            <div className="flex items-center gap-2">
                {/* Previous */}
                <button className="w-10 h-10 flex items-center justify-center rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all duration-300">
                    <span className="material-symbols-outlined">chevron_left</span>
                </button>
                
                {/* Pages */}
                <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-accent-purple text-white font-bold shadow-[0_0_15px_rgba(138,43,226,0.4)]">1</button>
                <button className="w-10 h-10 flex items-center justify-center rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all duration-300">2</button>
                <button className="w-10 h-10 flex items-center justify-center rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all duration-300">3</button>
                
                <span className="w-10 h-10 flex items-center justify-center text-white/20">...</span>
                
                <button className="w-10 h-10 flex items-center justify-center rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all duration-300">9</button>
                
                {/* Next */}
                <button className="w-10 h-10 flex items-center justify-center rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all duration-300">
                    <span className="material-symbols-outlined">chevron_right</span>
                </button>
            </div>
        </div>
    )
}
