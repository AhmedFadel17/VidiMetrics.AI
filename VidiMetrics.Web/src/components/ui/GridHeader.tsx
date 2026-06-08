import { FilterOption } from "@/types";

interface GridHeaderProps {
    searchOption?: {
        placeholder?: string;
        value: string;
        onChange: (search: string) => void;
    };
    filterOptions?: {
        value: string | number;
        options: FilterOption[];
        onChange: (filter: string) => void;
    };
}

export default function GridHeader({
    searchOption,
    filterOptions,
}: GridHeaderProps) {


    return (
        <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 rounded-xl px-8 py-4 select-none">


            <div className="flex items-center gap-4">
                <div>
                    {filterOptions && (
                        <div className="flex items-center">
                            <select
                                value={filterOptions.value}
                                onChange={(e) => filterOptions.onChange(e.target.value)}
                                className="bg-white/[0.04] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-on-surface placeholder-on-surface-variant/40 focus:ring-1 focus:ring-primary focus:outline-none transition-all cursor-pointer"
                            >
                                {filterOptions.options.map((option) => (
                                    <option key={option.value} value={option.value} className="bg-surface-container-high">{option.label}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-6">
                <div>
                    {searchOption && (
                        <div className="relative w-full">
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-lg">search</span>
                                <input
                                    type="text"
                                    placeholder={searchOption.placeholder ?? 'Search...'}
                                    value={searchOption.value}
                                    onChange={e => { searchOption.onChange(e.target.value) }}
                                    className="w-full text-bold bg-white/[0.04] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-on-surface placeholder-on-surface-variant/40 focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                                />
                                {searchOption.value && (
                                    <button
                                        onClick={() => { searchOption.onChange(''); }}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 hover:text-on-surface transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-base">close</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}