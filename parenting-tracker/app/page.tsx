'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useMutabaahMonth } from '@/hooks/useMutabaah';
import { useMonthlyStats } from '@/hooks/useMonthlyStats';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { MonthPicker } from '@/components/dashboard/MonthPicker';
import { MutabaahGrid } from '@/components/dashboard/MutabaahGrid';
import { DashboardFooter } from '@/components/dashboard/DashboardFooter';

// Lazy-load heavy components that aren't needed on initial render
const NavigationDrawer = dynamic(
  () => import('@/components/dashboard/NavigationDrawer').then(m => m.NavigationDrawer),
  { ssr: false }
);

const ChangelogModal = dynamic(
  () => import('@/components/dashboard/ChangelogModal').then(m => m.ChangelogModal),
  { ssr: false }
);

const StatsView = dynamic(
  () => import('@/components/dashboard/StatsView').then(m => m.StatsView),
  { ssr: false }
);

export default function Dashboard() {
  const [currentDate, setCurrentDate] = useState(new Date());

  // UI State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isChangelogOpen, setIsChangelogOpen] = useState(false);
  const [activeView, setActiveView] = useState<'dashboard' | 'stats'>('dashboard');

  const { logs, toggleActivity } = useMutabaahMonth(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );

  const stats = useMonthlyStats(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    logs || []
  );

  return (
    <div className="flex-1 flex flex-col min-h-screen" style={{ background: 'var(--bg-surface)' }}>
      <DashboardHeader
        onMenuClick={() => setIsDrawerOpen(true)}
      />

      <NavigationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpenChangelog={() => setIsChangelogOpen(true)}
        onOpenStats={() => {
          setActiveView('stats');
          setIsDrawerOpen(false);
        }}
        onOpenHome={() => {
          setActiveView('dashboard');
          setIsDrawerOpen(false);
        }}
        activeView={activeView}
      />

      <ChangelogModal
        isOpen={isChangelogOpen}
        onClose={() => setIsChangelogOpen(false)}
      />

      <main className="flex-1 flex flex-col overflow-hidden relative">
        {activeView === 'dashboard' ? (
          <>
            <div className="py-5 space-y-5">
              <MonthPicker currentDate={currentDate} onDateChange={setCurrentDate} />
            </div>

            <MutabaahGrid
              currentDate={currentDate}
              logs={logs || []}
              onToggle={toggleActivity}
            />
          </>
        ) : (
          <StatsView stats={stats} />
        )}
      </main>

      <DashboardFooter />
    </div>
  );
}
