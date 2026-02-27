'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useMutabaah, useStreak } from '@/hooks/useMutabaah';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { CategoryGroup } from '@/components/dashboard/CategoryGroup';
import { CATEGORIES, ACTIVITIES } from '@/lib/constants/activities';
import { Loader2 } from 'lucide-react';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const { logs, toggleActivity, stats } = useMutabaah(selectedDate);
  const streak = useStreak();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="animate-spin text-green-600" size={32} />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex-1 flex flex-col bg-slate-50 pb-20">
      <DashboardHeader
        streak={streak}
        percentage={stats.percentage}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {CATEGORIES.map((category) => (
          <CategoryGroup
            key={category}
            category={category}
            activities={ACTIVITIES.filter(a => a.category === category)}
            logs={logs || []}
            onToggle={toggleActivity}
          />
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/80 backdrop-blur-md border-t border-slate-100 p-4 flex justify-around items-center z-20">
        <p className="text-[10px] text-slate-400 font-medium">Mutabaah Tracker v1.0 • Offline Ready</p>
      </div>
    </div>
  );
}
