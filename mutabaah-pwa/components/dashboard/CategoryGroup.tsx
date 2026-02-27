'use client';

import { Activity, ActivityCategory } from '@/lib/constants/activities';
import { ActivityToggle } from './ActivityToggle';
import { ActivityLog } from '@/lib/db';

interface CategoryGroupProps {
    category: ActivityCategory;
    activities: Activity[];
    logs: ActivityLog[];
    onToggle: (id: string) => void;
}

export function CategoryGroup({ category, activities, logs, onToggle }: CategoryGroupProps) {
    return (
        <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                {category}
            </h3>
            <div className="grid grid-cols-1 gap-2">
                {activities.map((activity) => {
                    const isCompleted = !!logs?.find(l => l.activityId === activity.id)?.completed;
                    return (
                        <ActivityToggle
                            key={activity.id}
                            name={activity.name}
                            completed={isCompleted}
                            onToggle={() => onToggle(activity.id)}
                        />
                    );
                })}
            </div>
        </div>
    );
}
