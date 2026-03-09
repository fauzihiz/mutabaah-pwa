'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useMutabaahMonth, useStreak } from '@/hooks/useMutabaah';
import { useMonthlyAchievements } from '@/hooks/useMonthlyAchievements';
import { useMonthlyStats } from '@/hooks/useMonthlyStats';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { AchievementCarousel } from '@/components/dashboard/AchievementCarousel';
import { MonthPicker } from '@/components/dashboard/MonthPicker';
import { MutabaahGrid } from '@/components/dashboard/MutabaahGrid';
import { DashboardFooter } from '@/components/dashboard/DashboardFooter';
import { NavigationDrawer } from '@/components/dashboard/NavigationDrawer';
import { ChangelogModal } from '@/components/dashboard/ChangelogModal';
import { StatsDrawer } from '@/components/dashboard/StatsDrawer';
import { Loader2 } from 'lucide-react';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());

  // UI State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isChangelogOpen, setIsChangelogOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);

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

  const stats = useMonthlyStats(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    logs || []
  );

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-slate-950">
        <Loader2 className="animate-spin text-green-600" size={32} />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-slate-950 min-h-screen">
      <DashboardHeader
        userEmail={user.email}
        onMenuClick={() => setIsDrawerOpen(true)}
      />

      <NavigationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpenChangelog={() => setIsChangelogOpen(true)}
        onOpenStats={() => setIsStatsOpen(true)}
      />

      <ChangelogModal
        isOpen={isChangelogOpen}
        onClose={() => setIsChangelogOpen(false)}
      />

      <StatsDrawer
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        stats={stats}
      />

      <main className="flex-1 flex flex-col overflow-hidden relative">
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
