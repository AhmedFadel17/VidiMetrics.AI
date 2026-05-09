import React from 'react';
import { FilterOption } from '@/types/ui';

interface FilterDropdownProps {
    value: string | number;
    onChange: (option: FilterOption) => void;
    options: FilterOption[];
    className?: string;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ value, onChange, options, className = "" }) => {
    return (
        <div className={`relative group ${className}`}>
            <select
                className="glass-card appearance-none bg-transparent hover:bg-white/10 px-6 py-3 pr-12 rounded-2xl text-xs font-bold text-white uppercase tracking-widest border border-white/5 transition-all duration-300 outline-none cursor-pointer w-full"
                value={value}
                onChange={(e) => {
                    const selectedOption = options.find(o => o.value.toString() === e.target.value);
                    if (selectedOption) onChange(selectedOption);
                }}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value} className="bg-[#0f0f0f] text-white">
                        {option.label}
                    </option>
                ))}
            </select>
            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40 group-hover:text-white/60 transition-colors">
                expand_more
            </span>
        </div>
    );
};

export default FilterDropdown;
