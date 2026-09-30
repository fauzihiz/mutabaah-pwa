'use client';

import { useMemo } from 'react';
import { ActivityLog } from '@/lib/db';
import { useTrackerConfig } from '@/hooks/useTrackerConfig';

export interface CategoryStat {
    name: string;
    completed: number;
    total: number;
    percentage: number;
}

export interface ActivityStat {
    id: string;
    name: string;
    category: string;
    count: number;
}

export function useMonthlyStats(year: number, month: number, logs: ActivityLog[] | undefined) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const { categories, activities } = useTrackerConfig();

    const stats = useMemo(() => {
        if (!logs) return null;

        const categoryStats: CategoryStat[] = categories.map(category => {
            const categoryActivities = activities.filter(a => a.categoryId === category.id);
            const totalTarget = categoryActivities.length * daysInMonth;

            const completedCount = logs.filter(log => {
                const activity = categoryActivities.find(a => a.id === log.activityId);
                return !!activity && log.completed === 1;
            }).length;

            return {
                name: category.name,
                completed: completedCount,
                total: totalTarget,
                percentage: totalTarget > 0 ? Math.round((completedCount / totalTarget) * 100) : 0
            };
        });

        const activityStats: ActivityStat[] = activities.map(activity => {
            const count = logs.filter(log => log.activityId === activity.id && log.completed === 1).length;
            const cat = categories.find(c => c.id === activity.categoryId);
            return {
                id: activity.id,
                name: activity.name,
                category: cat ? cat.name : 'Unknown',
                count
            };
        }).sort((a, b) => b.count - a.count);

        const totalCompleted = categoryStats.reduce((acc, curr) => acc + curr.completed, 0);
        const totalTarget = activities.length * daysInMonth;
        const overallPercentage = totalTarget > 0 ? Math.round((totalCompleted / totalTarget) * 100) : 0;

        return {
            categoryStats,
            activityStats,
            overallPercentage,
            totalCompleted,
            totalTarget,
            daysInMonth
        };
    }, [logs, year, month, daysInMonth, categories, activities]);

    return stats;
}
