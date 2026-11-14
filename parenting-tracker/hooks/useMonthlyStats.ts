'use client';

import { useMemo } from 'react';
import { ACTIVITIES, CATEGORIES, ActivityCategory } from '@/lib/constants/activities';
import { ActivityLog } from '@/lib/db';

export interface CategoryStat {
    name: string;
    completed: number;
    total: number;
    percentage: number;
}

export interface ActivityStat {
    id: string;
    name: string;
    category: ActivityCategory;
    count: number;
}

export function useMonthlyStats(
    year: number,
    month: number,
    logs: ActivityLog[] | undefined,
    activities: {
        id: string;
        name: string;
        category: ActivityCategory;
    }[] | undefined,
    onAddActivity?: (name: string, category: ActivityCategory) => Promise<string>,
    onRenameActivity?: (activityId: string, newName: string) => Promise<void>,
    onDeleteActivity?: (activityId: string) => Promise<void>
) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const stats = useMemo(() => {
        if (!logs) return null;

        const resolvedActivities = activities ?? [];

        const categoryStats: CategoryStat[] = CATEGORIES.map(category => {
            const categoryActivities = resolvedActivities.filter(a => a.category === category);
            const totalTarget = categoryActivities.length * daysInMonth;

            const completedCount = logs.filter(log => {
                const activity = categoryActivities.find(a => a.id === log.activityId);
                return !!activity && log.stickerValue >= 1 && log.stickerValue <= 6;
            }).length;

            return {
                name: category,
                completed: completedCount,
                total: totalTarget,
                percentage: totalTarget > 0 ? Math.round((completedCount / totalTarget) * 100) : 0
            };
        });

        const activityStats: ActivityStat[] = resolvedActivities.map(activity => {
            const count = logs.filter(log => log.activityId === activity.id && log.stickerValue >= 1 && log.stickerValue <= 6).length;
            return {
                id: activity.id,
                name: activity.name,
                category: activity.category,
                count
            };
        }).sort((a, b) => b.count - a.count);

        const totalCompleted = categoryStats.reduce((acc, curr) => acc + curr.completed, 0);
        const totalTarget = resolvedActivities.length * daysInMonth;
        const overallPercentage = totalTarget > 0 ? Math.round((totalCompleted / totalTarget) * 100) : 0;

        return {
            categoryStats,
            activityStats,
            overallPercentage,
            totalCompleted,
            totalTarget,
            daysInMonth
        };
    }, [logs, activities, year, month, daysInMonth]);

    return stats;
}
