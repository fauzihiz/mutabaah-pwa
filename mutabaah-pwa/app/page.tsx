'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useMutabaahMonth, useStreak } from '@/hooks/useMutabaah';
import { useMonthlyAchievements } from '@/hooks/useMonthlyAchievements';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { AchievementCarousel } from '@/components/dashboard/AchievementCarousel';
import { MonthPicker } from '@/components/dashboard/MonthPicker';
import { MutabaahGrid } from '@/components/dashboard/MutabaahGrid';
import { DashboardFooter } from '@/components/dashboard/DashboardFooter';
import { Loader2 } from 'lucide-react';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());

  const { logs, toggleActivity } = useMutabaahMonth(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    user?.id
  );

  const { badges, isLoading: badgesLoading } = useMonthlyAchievements(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    user?.id
  );

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-green-600" size={32} />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex-1 flex flex-col bg-white">
      <DashboardHeader userEmail={user.email} />

      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="py-5 space-y-5">
          <AchievementCarousel badges={badges} isLoading={badgesLoading} />
          <MonthPicker currentDate={currentDate} onDateChange={setCurrentDate} />
        </div>

        <MutabaahGrid
          currentDate={currentDate}
          logs={logs || []}
          onToggle={toggleActivity}
        />
      </main>

      <DashboardFooter />
    </div>
  );
}
