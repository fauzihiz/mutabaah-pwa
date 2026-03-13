'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, Maximize2, Minimize2, Save } from 'lucide-react';
import { useMonthlyPlanner } from '@/hooks/useMonthlyPlanner';

interface MonthlyPlannerViewProps {
    currentDate: Date;
    onDateChange: (date: Date) => void;
}

export function MonthlyPlannerView({ currentDate, onDateChange }: MonthlyPlannerViewProps) {
    const { notes, saveNote } = useMonthlyPlanner(currentDate.getFullYear(), currentDate.getMonth());
    const [viewMode, setViewMode] = useState<'grid' | 'single'>('grid');
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toLocaleDateString('en-CA'));
    const [localContent, setLocalContent] = useState('');

    const daysInMonth = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const days = [];
        const date = new Date(year, month, 1);
        while (date.getMonth() === month) {
            days.push(new Date(date).toLocaleDateString('en-CA'));
            date.setDate(date.getDate() + 1);
        }
        return days;
    }, [currentDate]);

    const handleDateClick = (date: string) => {
        setSelectedDate(date);
        const note = notes.find(n => n.date === date);
        setLocalContent(note?.content || '');
        setViewMode('single');
    };

    const handleSave = async () => {
        await saveNote(selectedDate, localContent);
    };

    const handleNextDay = () => {
        const d = new Date(selectedDate);
        d.setDate(d.getDate() + 1);
        const nextDate = d.toLocaleDateString('en-CA');
        setSelectedDate(nextDate);
        setLocalContent(notes.find(n => n.date === nextDate)?.content || '');
        
        // If moved to next month, update parent
        if (d.getMonth() !== currentDate.getMonth()) {
            onDateChange(new Date(d.getFullYear(), d.getMonth(), 1));
        }
    };

    const handlePrevDay = () => {
        const d = new Date(selectedDate);
        d.setDate(d.getDate() - 1);
        const prevDate = d.toLocaleDateString('en-CA');
        setSelectedDate(prevDate);
        setLocalContent(notes.find(n => n.date === prevDate)?.content || '');

        if (d.getMonth() !== currentDate.getMonth()) {
            onDateChange(new Date(d.getFullYear(), d.getMonth(), 1));
        }
    };

    // Calendar Grid Calculation
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

    return (
        <div className="flex-1 flex flex-col p-4 space-y-4 pb-32">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-green-600" />
                    <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--text-primary)' }}>
                        Monthly Planner
                    </h2>
                </div>
                <button
                    onClick={() => setViewMode(v => v === 'grid' ? 'single' : 'grid')}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                >
                    {viewMode === 'grid' ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
                </button>
            </div>

            <AnimatePresence mode="wait">
                {viewMode === 'grid' ? (
                    <motion.div
                        key="grid"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="grid grid-cols-7 gap-2"
                    >
                        {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => (
                            <div key={day} className="text-[10px] font-black text-center py-2 uppercase tracking-tighter" style={{ color: 'var(--text-muted)' }}>
                                {day}
                            </div>
                        ))}
                        {blanks.map(i => <div key={`blank-${i}`} />)}
                        {daysInMonth.map(date => {
                            const d = new Date(date).getDate();
                            const note = notes.find(n => n.date === date);
                            const isToday = date === new Date().toLocaleDateString('en-CA');
                            
                            return (
                                <button
                                    key={date}
                                    onClick={() => handleDateClick(date)}
                                    className={`relative aspect-square flex flex-col p-2 rounded-2xl border transition-all text-left overflow-hidden ${
                                        isToday ? 'border-green-500 ring-1 ring-green-500/20' : 'hover:border-green-300'
                                    }`}
                                    style={{
                                        background: isToday ? 'var(--bg-subtle)' : 'var(--bg-surface)',
                                        borderColor: isToday ? undefined : 'var(--border)'
                                    }}
                                >
                                    <span className={`text-xs font-bold ${isToday ? 'text-green-600' : ''}`} style={{ color: isToday ? undefined : 'var(--text-primary)' }}>
                                        {d}
                                    </span>
                                    {note && (
                                        <div className="mt-1 text-[8px] leading-tight line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                                            {note.content}
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </motion.div>
                ) : (
                    <motion.div
                        key="single"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex-1 flex flex-col space-y-4"
                    >
                        <div className="flex items-center justify-between">
                            <button onClick={handlePrevDay} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                                <ChevronLeft size={20} style={{ color: 'var(--text-muted)' }} />
                            </button>
                            <div className="text-center">
                                <p className="text-xs font-bold uppercase tracking-widest text-green-600">
                                    {new Date(selectedDate).toLocaleDateString('id-ID', { weekday: 'long' })}
                                </p>
                                <h3 className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>
                                    {new Date(selectedDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </h3>
                            </div>
                            <button onClick={handleNextDay} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                                <ChevronRight size={20} style={{ color: 'var(--text-muted)' }} />
                            </button>
                        </div>

                        <div className="flex-1 relative">
                            <textarea
                                value={localContent}
                                onChange={(e) => setLocalContent(e.target.value)}
                                onBlur={handleSave}
                                placeholder="Tulis rencana atau catatan hari ini..."
                                className="w-full h-full min-h-[300px] p-6 rounded-3xl border focus:ring-2 focus:ring-green-500/20 outline-none transition-all resize-none font-medium leading-relaxed"
                                style={{
                                    background: 'var(--bg-surface)',
                                    borderColor: 'var(--border)',
                                    color: 'var(--text-primary)'
                                }}
                            />
                            <div className="absolute bottom-4 right-4 flex gap-2">
                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-2xl font-bold text-xs shadow-lg shadow-green-600/20 hover:bg-green-700 transition-all"
                                >
                                    <Save size={14} />
                                    Simpan
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
