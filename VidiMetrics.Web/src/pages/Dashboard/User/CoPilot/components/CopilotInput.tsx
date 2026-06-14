import { useState } from 'react'
import { Button } from '@/components/ui/Button'

type Props = {
    onSend: (value: string) => Promise<void> | void
    isLoading?: boolean
}

export default function CopilotInput({ onSend, isLoading = false }: Props) {
    const [value, setValue] = useState('')

    const handleSubmit = async () => {
        const trimmed = value.trim()
        if (!trimmed || isLoading) return
        setValue('')
        await onSend(trimmed)
    }

    return (
        <div className="flex items-end gap-3 p-3">
            <textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSubmit()
                    }
                }}
                rows={3}
                placeholder="Ask copilot to create, update, get, delete, or explain dashboard fields..."
                className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35"
                disabled={isLoading}
            />

            <Button
                onClick={handleSubmit}
                disabled={isLoading || !value.trim()}
                className="h-11 rounded-xl px-4"
            >
                <span className="material-symbols-outlined text-sm text-white">send</span>
            </Button>
        </div>
    )
}