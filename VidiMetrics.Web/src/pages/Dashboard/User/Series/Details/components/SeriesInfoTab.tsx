import { useState } from 'react'

import { Show } from '@/types/models/storyEngine';

interface SeriesInfoTabProps {
    show: Show;
}

export default function SeriesInfoTab({ show }: SeriesInfoTabProps) {
    const [isEditing, setIsEditing] = useState(false)

    // Initial data from props
    const [formData, setFormData] = useState({
        title: show.title,
        synopsis: show.description,
        genre: show.visualStyle,
        targetAudience: show.targetAudience,
        status: show.status === 0 ? 'Active Production' : 'Inactive'
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    return (
        <div className="glass-card rounded-[3rem] p-10 border border-white/5 space-y-8 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-purple/5 blur-[100px] pointer-events-none"></div>

            <div className="flex justify-between items-center relative z-10 border-b border-white/5 pb-6">
                <div>
                    <h3 className="text-3xl font-headline font-bold text-white tracking-tight">Series Details</h3>
                    <p className="text-white/40 text-sm mt-1">Manage core metadata and project settings.</p>
                </div>
                
                <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className={`px-6 py-2.5 rounded-xl text-xs uppercase tracking-widest font-bold flex items-center gap-2 transition-all duration-300 ${
                        isEditing 
                            ? 'bg-accent-cyan text-on-surface shadow-[0_0_15px_rgba(0,242,255,0.4)]' 
                            : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                    }`}
                >
                    <span className="material-symbols-outlined text-sm">
                        {isEditing ? 'save' : 'edit'}
                    </span>
                    {isEditing ? 'Save Changes' : 'Edit Details'}
                </button>
            </div>

            <div className="space-y-6 relative z-10 max-w-3xl">
                {/* Title */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 pl-2">Project Title</label>
                    {isEditing ? (
                        <input 
                            type="text" 
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-purple/50 focus:bg-white/10 transition-all font-bold"
                        />
                    ) : (
                        <div className="w-full bg-black/20 border border-transparent rounded-xl px-4 py-3 text-white font-bold">
                            {formData.title}
                        </div>
                    )}
                </div>

                {/* Synopsis */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 pl-2">Synopsis</label>
                    {isEditing ? (
                        <textarea 
                            name="synopsis"
                            value={formData.synopsis}
                            onChange={handleChange}
                            rows={4}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-purple/50 focus:bg-white/10 transition-all resize-none"
                        />
                    ) : (
                        <div className="w-full bg-black/20 border border-transparent rounded-xl px-4 py-3 text-white/80 leading-relaxed min-h-[104px]">
                            {formData.synopsis}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-6">
                    {/* Genre */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 pl-2">Genre</label>
                        {isEditing ? (
                            <input 
                                type="text" 
                                name="genre"
                                value={formData.genre}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-purple/50 transition-all"
                            />
                        ) : (
                            <div className="w-full bg-black/20 border border-transparent rounded-xl px-4 py-3 text-white">
                                {formData.genre}
                            </div>
                        )}
                    </div>

                    {/* Target Audience */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 pl-2">Target Audience</label>
                        {isEditing ? (
                            <input 
                                type="text" 
                                name="targetAudience"
                                value={formData.targetAudience}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-purple/50 transition-all"
                            />
                        ) : (
                            <div className="w-full bg-black/20 border border-transparent rounded-xl px-4 py-3 text-white">
                                {formData.targetAudience}
                            </div>
                        )}
                    </div>
                </div>

                {/* Status Selection (Only visible in edit mode) */}
                {isEditing && (
                    <div className="space-y-2 pt-4 border-t border-white/5">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 pl-2">Production Status</label>
                        <select 
                            name="status"
                            value={formData.status}
                            onChange={(e: any) => handleChange(e)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-accent-cyan font-bold focus:outline-none focus:border-accent-purple/50 transition-all appearance-none"
                        >
                            <option value="Active Production" className="bg-dashboard-bg text-white">Active Production</option>
                            <option value="In Planning" className="bg-dashboard-bg text-white">In Planning</option>
                            <option value="Completed" className="bg-dashboard-bg text-white">Completed</option>
                            <option value="Archived" className="bg-dashboard-bg text-white">Archived</option>
                        </select>
                    </div>
                )}
            </div>
        </div>
    )
}
