'use client';

import { Activity, ActivityCategory } from '@/lib/constants/activities';
import { ActivityDropdown } from './ActivityDropdown';
import { ActivityLog } from '@/lib/db';
import { useActivityFlags } from '@/hooks/useMutabaah';
import { getSupportingStickers } from '@/lib/constants/stickers';

interface CategoryGroupProps {
    category: ActivityCategory;
    activities: Activity[];
    logs: ActivityLog[];
    onSetSticker: (activityId: string, stickerValue: number) => void;
}

export function CategoryGroup({ category, activities, logs, onSetSticker }: CategoryGroupProps) {
    const childId = 1; // Default to first child, can be passed as prop
    const { flags, toggleFlag } = useActivityFlags(childId);

    return (
        <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                {category}
            </h3>
            <div className="grid grid-cols-1 gap-2">
                {activities.map((activity) => {
                    const log = logs?.find(l => l.activityId === activity.id);
                    const stickerValue = log?.stickerValue ?? 0;
                    
                    // Get supporting flags for this activity
                    const activityFlags = flags.get(activity.id) ?? [];

                    return (
                        <div key={activity.id} className="flex items-center justify-between p-3 rounded-xl border" style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                                    {activity.name}
                                </span>
                                {activityFlags.length > 0 && (
                                    <div className="flex gap-1">
                                        {activityFlags.map(flag => {
                                            const sticker = getSupportingStickers().find(s => s.value === flag);
                                            if (!sticker) return null;
                                            
                                            return (
                                                <button
                                                    key={flag}
                                                    onClick={() => toggleFlag(activity.id, flag)}
                                                    className="text-lg transition-colors"
                                                    title={sticker.label}
                                                >
                                                    {sticker.icon}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                            <ActivityDropdown
                                value={stickerValue}
                                onChange={(val) => onSetSticker(activity.id, val)}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
