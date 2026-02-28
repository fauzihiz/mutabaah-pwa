import { ActivityLog } from './db';
import { supabase } from './supabase';

export interface Achievement {
    id: string;
    title: string;
    description: string;
    condition_type: 'min_streak' | 'total_count' | 'activity_count' | 'activity_streak';
    threshold: number;
    target_activity_id?: string;
    icon_name: string;
    color_theme: string;
}

function getLocalDateString(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export async function checkAndSyncAchievements(userId: string, allLogs: ActivityLog[]) {
    console.log('Checking achievements for user:', userId, 'Logs count:', allLogs.length);

    const { data: definitions, error: defError } = await supabase.from('achievements').select('*');
    if (defError || !definitions) {
        console.error('Error fetching achievement definitions:', defError);
        return [];
    }

    const { data: earned, error: earnedError } = await supabase
        .from('user_achievements')
        .select('achievement_id')
        .eq('user_id', userId);

    if (earnedError) {
        console.error('Error fetching earned achievements:', earnedError);
    }

    const earnedIds = new Set(earned?.map(e => e.achievement_id) || []);
    const newlyEarned: string[] = [];

    for (const rule of definitions as Achievement[]) {
        if (earnedIds.has(rule.id)) continue;

        let isMet = false;

        if (rule.condition_type === 'min_streak') {
            const streak = calculateStreak(allLogs);
            if (streak >= rule.threshold) isMet = true;
        } else if (rule.condition_type === 'activity_streak') {
            const activityLogs = allLogs.filter(l => l.activityId === rule.target_activity_id && l.completed === 1);
            const streak = calculateStreak(activityLogs);
            if (streak >= rule.threshold) isMet = true;
        } else if (rule.condition_type === 'total_count') {
            const count = allLogs.filter(l => l.completed === 1).length;
            if (count >= rule.threshold) isMet = true;
        } else if (rule.condition_type === 'activity_count') {
            const count = allLogs.filter(l => l.activityId === rule.target_activity_id && l.completed === 1).length;
            if (count >= rule.threshold) isMet = true;
        }

        if (isMet) {
            console.log('Achievement unlocked!', rule.title);
            newlyEarned.push(rule.id);
        }
    }

    if (newlyEarned.length > 0) {
        const toInsert = newlyEarned.map(id => ({
            user_id: userId,
            achievement_id: id,
        }));
        const { error: insertError } = await supabase.from('user_achievements').insert(toInsert);
        if (insertError) console.error('Error saving new achievements:', insertError);
    }

    return newlyEarned;
}

function calculateStreak(logs: ActivityLog[]) {
    const completedLogs = logs.filter(l => l.completed === 1);
    if (completedLogs.length === 0) return 0;

    const distinctDates = Array.from(new Set(completedLogs.map(l => l.date))).sort().reverse();

    const now = new Date();
    const today = getLocalDateString(now);

    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = getLocalDateString(yesterdayDate);

    // If the most recent log isn't today or yesterday, streak is broken
    if (distinctDates[0] !== today && distinctDates[0] !== yesterday) return 0;

    let streak = 0;
    let checkDate = distinctDates[0]; // Start from the most recent logged date

    for (const date of distinctDates) {
        if (date === checkDate) {
            streak++;
            // Move checkDate to the day before
            const d = new Date(checkDate);
            d.setHours(12); // Avoid midnight issues
            d.setDate(d.getDate() - 1);
            checkDate = getLocalDateString(d);
        } else {
            break;
        }
    }
    return streak;
}
