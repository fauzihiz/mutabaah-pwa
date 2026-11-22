'use client';

interface ActivityToggleProps {
    name: string;
    completed: boolean;
    onToggle: () => void;
}

export function ActivityToggle({ name, completed, onToggle }: ActivityToggleProps) {
    return (
        <button
            onClick={onToggle}
            className={[
                "w-full flex items-center justify-between p-4 rounded-2xl transition-all border outline-none active:scale-[0.98]",
                completed
                    ? "bg-green-50 border-green-200 text-green-900"
                    : "bg-white border-slate-100 text-slate-600"
            ].join(' ')}
        >
            <span className="text-sm font-medium">{name}</span>
            <div className={[
                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                completed
                    ? "bg-green-600 border-green-600"
                    : "bg-white border-slate-200"
            ].join(' ')}>
                {completed && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white"><polyline points="20 6 9 17 4 12"/></svg>}
            </div>
        </button>
    );
}
