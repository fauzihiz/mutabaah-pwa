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
        <div className="px-6 py-4 flex items-center justify-between bg-slate-50 border-b border-slate-100">
            <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-green-100 text-green-700">
                    <Calendar size={18} />
                </div>
                <h2 className="text-lg font-bold text-slate-800">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
            </div>
            <div className="flex space-x-2">
                <button
                    onClick={handlePrev}
                    className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all text-slate-400 hover:text-green-600"
                >
                    <ChevronLeft size={20} />
                </button>
                <button
                    onClick={handleNext}
                    className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all text-slate-400 hover:text-green-600"
                >
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
}
