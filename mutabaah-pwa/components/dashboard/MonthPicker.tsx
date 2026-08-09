'use client';

import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface MonthPickerProps {
    currentDate: Date;
    onDateChange: (date: Date) => void;
}

export function MonthPicker({ currentDate, onDateChange }: MonthPickerProps) {
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const handlePrev = () => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        onDateChange(newDate);
    };

    const handleNext = () => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        onDateChange(newDate);
    };

    return (
        <div className="px-6 py-4 flex items-center justify-between border-b" style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border)' }}>
            <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-500/15 text-green-700 dark:text-green-400">
                    <Calendar size={18} />
                </div>
                <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
            </div>
            <div className="flex space-x-2">
                <button
                    onClick={handlePrev}
                    className="p-2 hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm rounded-xl transition-all hover:text-green-600 dark:hover:text-green-400"
                    style={{ color: 'var(--text-muted)' }}
                >
                    <ChevronLeft size={20} />
                </button>
                <button
                    onClick={handleNext}
                    className="p-2 hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm rounded-xl transition-all hover:text-green-600 dark:hover:text-green-400"
                    style={{ color: 'var(--text-muted)' }}
                >
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
}
