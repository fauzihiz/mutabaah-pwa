'use client';

import { Check } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ActivityToggleProps {
    name: string;
    completed: boolean;
    onToggle: () => void;
}

export function ActivityToggle({ name, completed, onToggle }: ActivityToggleProps) {
    return (
        <button
            onClick={onToggle}
            className={cn(
                "w-full flex items-center justify-between p-4 rounded-2xl transition-all border outline-none active:scale-[0.98]",
                completed
                    ? "bg-green-50 border-green-200 text-green-900"
                    : "bg-white border-slate-100 text-slate-600"
            )}
        >
            <span className="text-sm font-medium">{name}</span>
            <div className={cn(
                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                completed
                    ? "bg-green-600 border-green-600"
                    : "bg-white border-slate-200"
            )}>
                {completed && <Check size={14} className="text-white" />}
            </div>
        </button>
    );
}
