'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { LogOut, Flame, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface DashboardHeaderProps {
    streak: number;
    percentage: number;
    selectedDate: string;
    onDateChange: (date: string) => void;
}

export function DashboardHeader({ streak, percentage, selectedDate, onDateChange }: DashboardHeaderProps) {
    const { signOut, user } = useAuth();

    const handlePrevDay = () => {
        const d = new Date(selectedDate);
        d.setDate(d.getDate() - 1);
        onDateChange(d.toISOString().split('T')[0]);
    };

    const handleNextDay = () => {
        const d = new Date(selectedDate);
        d.setDate(d.getDate() + 1);
        onDateChange(d.toISOString().split('T')[0]);
    };

    const isToday = selectedDate === new Date().toISOString().split('T')[0];

    return (
        <div className="bg-green-600 text-white p-6 rounded-b-[32px] shadow-lg shadow-green-600/20 space-y-6 sticky top-0 z-10">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
                        {user?.email?.[0].toUpperCase()}
                    </div>
                    <div>
                        <p className="text-xs text-green-100 italic">Assalamualaikum,</p>
                        <p className="text-sm font-bold truncate max-w-[150px]">{user?.email?.split('@')[0]}</p>
                    </div>
                </div>
                <button
                    onClick={() => signOut()}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                >
                    <LogOut size={20} />
                </button>
            </div>

            <div className="flex items-center justify-between bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-orange-400 text-white shadow-inner">
                        <Flame size={20} />
                    </div>
                    <div>
                        <p className="text-2xl font-black">{streak}</p>
                        <p className="text-[10px] uppercase font-bold text-green-100 tracking-wider">Day Streak</p>
                    </div>
                </div>

                <div className="h-12 w-[1px] bg-white/20"></div>

                <div className="text-right">
                    <p className="text-2xl font-black">{percentage}%</p>
                    <p className="text-[10px] uppercase font-bold text-green-100 tracking-wider">Completed</p>
                </div>
            </div>

            <div className="flex items-center justify-between bg-white rounded-2xl p-2 text-slate-900 shadow-sm">
                <button onClick={handlePrevDay} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                    <ChevronLeft size={20} />
                </button>
                <div className="flex items-center space-x-2 font-bold text-sm">
                    <Calendar size={16} className="text-green-600" />
                    <span>{isToday ? 'Today' : selectedDate}</span>
                </div>
                <button
                    onClick={handleNextDay}
                    disabled={isToday}
                    className="p-2 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-20"
                >
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
}
