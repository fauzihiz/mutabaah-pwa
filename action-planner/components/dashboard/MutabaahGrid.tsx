'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import { ActivityLog, ActivityDef } from '@/lib/db';
import { useTrackerConfig } from '@/hooks/useTrackerConfig';
import { Plus, Trash, Edit2, Flag, GripVertical } from 'lucide-react';

interface MutabaahGridProps {
    currentDate: Date;
    logs: ActivityLog[];
    onToggle: (date: string, activityId: string) => void;
}

function toLocalDateStr(y: number, m: number, d: number) {
    return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

export function MutabaahGrid({ currentDate, logs, onToggle }: MutabaahGridProps) {
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const days = useMemo(() => Array.from({ length: daysInMonth }, (_, i) => i + 1), [daysInMonth]);

    const {
        categories, activities,
        addCategory, editCategory, deleteCategory,
        addActivity, editActivity, deleteActivity,
        reorderCategories, reorderActivities
    } = useTrackerConfig();

    // ── Drag & Drop State ──
    type DragItem = { type: 'category' | 'activity'; id: string; categoryId?: string };
    const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);
    const [dropTarget, setDropTarget] = useState<{ id: string; position: 'before' | 'after' } | null>(null);

    const handleDragStart = (e: React.DragEvent, item: DragItem) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', JSON.stringify(item));
        setDraggedItem(item);
    };

    const handleDragEnd = () => {
        setDraggedItem(null);
        setDropTarget(null);
    };

    const handleDragOver = (e: React.DragEvent, targetId: string, targetType: 'category' | 'activity') => {
        if (!draggedItem || draggedItem.id === targetId) return;
        
        // Prevent cross-type drops (category onto activity row or vice versa)
        if (draggedItem.type !== targetType) return;
        
        // For activities, prevent cross-category drops
        if (targetType === 'activity' && draggedItem.categoryId !== undefined) {
             // We need to know the target activity's category. 
             // Since we don't pass it here easily without lookup, we assume valid targets are passed correctly in render.
             // However, simpler check: just allow drop if types match. The reorder function validates category internally.
        }

        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        
        const rect = e.currentTarget.getBoundingClientRect();
        const midY = rect.top + rect.height / 2;
        const position = e.clientY < midY ? 'before' : 'after';
        
        setDropTarget({ id: targetId, position });
    };

    const handleDrop = async (e: React.DragEvent, targetId: string, targetType: 'category' | 'activity') => {
        e.preventDefault();
        if (!draggedItem || !dropTarget) return;
        if (draggedItem.id === targetId) return;

        if (targetType === 'category' && draggedItem.type === 'category') {
            await reorderCategories(draggedItem.id, targetId, dropTarget.position);
        } else if (targetType === 'activity' && draggedItem.type === 'activity') {
            // Ensure same category for safety, though UI restricts this visually usually
            if (draggedItem.categoryId) {
                await reorderActivities(draggedItem.id, targetId, dropTarget.position, draggedItem.categoryId);
            }
        }

        setDraggedItem(null);
        setDropTarget(null);
    };

    const logMap = useMemo(() => {
        const m = new Map<string, boolean>();
        for (const l of logs) {
            m.set(`${l.date}:${l.activityId}`, l.completed === 1);
        }
        return m;
    }, [logs]);

    const [today, setToday] = useState<Date | null>(null);
    const [todayStr, setTodayStr] = useState('');

    useEffect(() => {
        const sync = () => {
            const now = new Date();
            setToday(now);
            setTodayStr(toLocalDateStr(now.getFullYear(), now.getMonth(), now.getDate()));
        };
        sync();
        const onVisible = () => { if (document.visibilityState === 'visible') sync(); };
        document.addEventListener('visibilitychange', onVisible);
        window.addEventListener('focus', onVisible);
        return () => { document.removeEventListener('visibilitychange', onVisible); window.removeEventListener('focus', onVisible); };
    }, []);

    const isFuture = (day: number) => {
        if (!todayStr) return false;
        return toLocalDateStr(currentDate.getFullYear(), currentDate.getMonth(), day) > todayStr;
    };

    const formatDate = (day: number) => {
        const y = currentDate.getFullYear();
        const m = String(currentDate.getMonth() + 1).padStart(2, '0');
        const d = String(day).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    const isToday = (day: number) =>
        !!today &&
        day === today.getDate() &&
        currentDate.getMonth() === today.getMonth() &&
        currentDate.getFullYear() === today.getFullYear();

    // Auto-scroll to today
    const scrollRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const el = scrollRef.current;
        if (!el || !today || !todayStr) return;
        const isCurrentMonth = currentDate.getFullYear() === today.getFullYear() && currentDate.getMonth() === today.getMonth();
        if (isCurrentMonth) {
            // Get the natural width of the label column after it's rendered
            const labelCol = el.querySelector('[data-label-col]') as HTMLElement;
            const labelWidth = labelCol?.offsetWidth || 240;
            const colWidth = 40;
            const target = Math.max(0, labelWidth + (today.getDate() - 1) * colWidth - el.clientWidth * 0.5);
            el.scrollTo({ left: target, behavior: 'smooth' });
        } else {
            el.scrollTo({ left: 0, behavior: 'smooth' });
        }
    }, [currentDate, todayStr]);

    // ── Desktop Drag-to-Scroll ──
    const isPanning = useRef(false);
    const panStartX = useRef(0);
    const panStartY = useRef(0);
    const panStartScrollLeft = useRef(0);
    const panStartScrollTop = useRef(0);
    const [isPanningActive, setIsPanningActive] = useState(false);

    const handlePanStart = (e: React.PointerEvent<HTMLDivElement>) => {
        // Only respond to primary button (left click / touch / pen)
        if (e.button !== 0) return;
        // Skip if starting on interactive elements (buttons, inputs, drag handles)
        const target = e.target as HTMLElement;
        if (target.closest('button, input, textarea, select, [draggable="true"], [data-drag-handle]')) return;

        isPanning.current = true;
        panStartX.current = e.clientX;
        panStartY.current = e.clientY;
        panStartScrollLeft.current = scrollRef.current?.scrollLeft ?? 0;
        panStartScrollTop.current = scrollRef.current?.scrollTop ?? 0;
        setIsPanningActive(true);
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const handlePanMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isPanning.current || !scrollRef.current) return;
        const dx = e.clientX - panStartX.current;
        const dy = e.clientY - panStartY.current;
        // Scroll by delta amount (opposite direction of drag)
        scrollRef.current.scrollLeft = panStartScrollLeft.current - dx;
        scrollRef.current.scrollTop = panStartScrollTop.current - dy;
    };

    const handlePanEnd = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isPanning.current) return;
        isPanning.current = false;
        setIsPanningActive(false);
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
        }
    };

    const handleAddCategory = () => {
        const name = prompt('New Category Name:');
        if (name?.trim()) addCategory(name.trim());
    };
    const handleEditCategory = (id: string, current: string) => {
        const name = prompt('Edit Category Name:', current);
        if (name?.trim() && name !== current) editCategory(id, name.trim());
    };
    const handleDeleteCategory = (id: string) => {
        if (confirm('Delete this category and all its activities?')) deleteCategory(id);
    };
    const handleAddActivity = (catId: string) => {
        const name = prompt('New Activity Name:');
        if (name?.trim()) addActivity(catId, name.trim());
    };
    const handleEditActivity = (id: string, current: string) => {
        const name = prompt('Edit Activity Name:', current);
        if (name?.trim() && name !== current) editActivity(id, { name: name.trim() });
    };
    const handleDeleteActivity = (id: string) => {
        if (confirm('Delete this activity?')) deleteActivity(id);
    };
    // Cycle: none → high → medium → low → none
    const cycleActivityPriority = (activity: ActivityDef) => {
        const next =
            activity.priority === 'high' ? 'medium' :
            activity.priority === 'medium' ? 'low' :
            activity.priority === 'low' ? undefined :
            'high';
        editActivity(activity.id, { priority: next });
    };

    return (
        <div
            className={`mutabaah-grid flex-1 overflow-auto border-t scrollbar-hide select-none ${isPanningActive ? 'cursor-grabbing' : 'cursor-grab'}`}
            style={{ borderColor: 'var(--border)' }}
            ref={scrollRef}
            onPointerDown={handlePanStart}
            onPointerMove={handlePanMove}
            onPointerUp={handlePanEnd}
            onPointerCancel={handlePanEnd}
            onPointerLeave={handlePanEnd}
        >
            {/* The whole grid is one scroll context. Left labels are sticky. */}
            <div style={{ minWidth: 'calc(var(--label-col-w) + ' + days.length * 40 + 'px)' }}>

                {/* ── HEADER ROW ── */}
                <div
                    className="flex min-h-11 border-b sticky top-0 z-30"
                    style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
                >
                    {/* sticky top-left corner with Add Category button */}
                    <div
                        data-label-col
                        className="flex-shrink-0 sticky left-0 z-30 flex items-center justify-between px-2 border-r w-[var(--label-col-w)]"
                        style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
                    >
                        <span className="text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>
                            Activities
                        </span>
                        <button
                            onClick={handleAddCategory}
                            title="Add Category"
                            className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            style={{ color: 'var(--text-muted)' }}
                        >
                            <Plus size={14} />
                        </button>
                    </div>

                    {/* Date columns */}
                    {days.map(day => {
                        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                        const _today = isToday(day);
                        const weekend = date.getDay() === 0 || date.getDay() === 6;
                        return (
                            <div
                                key={day}
                                className="w-10 flex-shrink-0 flex flex-col items-center justify-center border-r"
                                style={{
                                    borderColor: 'var(--border)',
                                    background: _today ? 'var(--primary-light)' : weekend ? 'var(--bg-subtle)' : 'var(--bg-surface)',
                                }}
                            >
                                <span className="text-[9px] font-bold uppercase" style={{ color: _today ? 'var(--today-label)' : 'var(--text-muted)' }}>
                                    {date.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0)}
                                </span>
                                <span className="text-[11px] font-black" style={{ color: _today ? 'var(--today-label)' : 'var(--text-primary)' }}>
                                    {day}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* ── BODY ── */}
                {categories.length === 0 && (
                    <div className="flex items-center justify-center h-32 text-sm opacity-40">
                        No categories yet. Tap + to add one.
                    </div>
                )}

                {categories.map((category, catIdx) => {
                    const catActivities = activities.filter(a => a.categoryId === category.id);
                    const isDraggingCat = draggedItem?.type === 'category' && draggedItem.id === category.id;
                    const isDropTargetCat = dropTarget?.id === category.id && draggedItem?.type === 'category';

                    return (
                        <div key={category.id}>
                            {/* Drop-zone before this category (except first) */}
                            {catIdx > 0 && draggedItem?.type === 'category' && (
                                <div
                                    className={`h-1 transition-colors ${dropTarget?.id === category.id && dropTarget?.position === 'before' ? 'bg-primary' : ''}`}
                                    onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; setDropTarget({ id: category.id, position: 'before' }); }}
                                    onDrop={(e) => { e.preventDefault(); if (draggedItem && draggedItem.type === 'category') reorderCategories(draggedItem.id, category.id, 'before').then(() => { setDraggedItem(null); setDropTarget(null); }); }}
                                />
                            )}
                            {/* ── Category header row ── */}
                            <div
                                className={`flex min-h-7 border-b group ${isDraggingCat ? 'opacity-50' : ''} ${isDropTargetCat ? (dropTarget!.position === 'before' ? 'border-t-2 border-t-primary' : 'border-b-2 border-b-primary') : ''}`}
                                style={{ borderColor: 'var(--border)', background: 'var(--bg-subtle)' }}
                                onDragOver={(e) => handleDragOver(e, category.id, 'category')}
                                onDrop={(e) => handleDrop(e, category.id, 'category')}
                            >
                                {/* sticky label */}
                                <div
                                    className="flex-shrink-0 sticky left-0 z-20 flex items-start justify-between gap-1 px-2 py-1 border-r w-[var(--label-col-w)] h-auto"
                                    style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border)' }}
                                >
                                    {/* Drag Handle */}
                                    <div
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, { type: 'category', id: category.id })}
                                        onDragEnd={handleDragEnd}
                                        className="cursor-grab active:cursor-grabbing p-1 -ml-1 mr-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] touch-none"
                                        title="Drag to reorder"
                                    >
                                        <GripVertical size={14} />
                                    </div>
                                    <span
                                        className="text-[10px] font-black uppercase break-words flex-1 min-w-0 leading-snug"
                                        style={{ color: 'var(--text-muted)' }}
                                    >
                                        {category.name}
                                    </span>
                                    <div className="flex sm:hidden sm:group-hover:flex items-center gap-1 shrink-0 mt-0.5">
                                        <button
                                            onClick={() => handleAddActivity(category.id)}
                                            title="Add Activity"
                                            className="p-1 sm:p-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-600"
                                            style={{ color: 'var(--text-muted)' }}
                                        >
                                            <Plus size={12} />
                                        </button>
                                        <button
                                            onClick={() => handleEditCategory(category.id, category.name)}
                                            title="Edit Category"
                                            className="p-1 sm:p-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-600"
                                            style={{ color: 'var(--text-muted)' }}
                                        >
                                            <Edit2 size={12} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteCategory(category.id)}
                                            title="Delete Category"
                                            className="p-1 sm:p-0.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500"
                                        >
                                            <Trash size={12} />
                                        </button>
                                    </div>
                                </div>
                                {/* spacer cells */}
                                {days.map(day => (
                                    <div
                                        key={day}
                                        className="w-10 flex-shrink-0 border-r"
                                        style={{ borderColor: 'var(--border)' }}
                                    />
                                ))}
                            </div>

                            {/* ── Activity rows ── */}
                            {catActivities.length === 0 ? (
                                <div
                                    className="flex min-h-10 border-b"
                                    style={{ borderColor: 'var(--border)' }}
                                >
                                    <div
                                        className="flex-shrink-0 sticky left-0 z-20 flex items-center px-3 py-1 border-r w-[var(--label-col-w)] h-auto"
                                        style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
                                    >
                                        <span className="text-[10px] opacity-40 italic">No activities — tap + above</span>
                                    </div>
                                    {days.map(day => (
                                        <div
                                            key={day}
                                            className="w-10 flex-shrink-0 border-r"
                                            style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}
                                        />
                                    ))}
                                </div>
                            ) : (
                                catActivities.map((activity, actIdx) => {
                                    const isDraggingAct = draggedItem?.type === 'activity' && draggedItem.id === activity.id;
                                    const isDropTargetAct = dropTarget?.id === activity.id && draggedItem?.type === 'activity';
                                    
                                    return (
                                    <div key={activity.id} className={`flex min-h-12 border-b group ${isDraggingAct ? 'opacity-50' : ''} ${isDropTargetAct ? 'border-b-2 border-b-primary' : ''}`} style={{ borderColor: 'var(--border)' }} onDragOver={(e) => handleDragOver(e, activity.id, 'activity')} onDrop={(e) => handleDrop(e, activity.id, 'activity')}>
                                        {/* Drop-zone before this activity (except first in category) */}
                                        {actIdx > 0 && draggedItem?.type === 'activity' && (
                                            <div
                                                className={`h-1 transition-colors ${dropTarget?.id === activity.id && dropTarget?.position === 'before' ? 'bg-primary' : ''}`}
                                                onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; setDropTarget({ id: activity.id, position: 'before' }); }}
                                                onDrop={(e) => { e.preventDefault(); if (draggedItem && draggedItem.type === 'activity') reorderActivities(draggedItem.id, activity.id, 'before', activity.categoryId).then(() => { setDraggedItem(null); setDropTarget(null); }); }}
                                            />
                                        )}
                                        {/* sticky label */}
                                        <div
                                            className="flex-shrink-0 sticky left-0 z-20 flex items-start justify-between gap-1 px-2 py-1 border-r w-[var(--label-col-w)] h-auto"
                                            style={{
                                                background:
                                                    activity.priority === 'high' ? 'var(--priority-high-bg)' :
                                                    activity.priority === 'medium' ? 'var(--priority-medium-bg)' :
                                                    activity.priority === 'low' ? 'var(--priority-low-bg)' :
                                                    'var(--bg-surface)',
                                                borderColor: 'var(--border)',
                                            }}
                                        >
                                            {/* Drag Handle */}
                                            <div
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, { type: 'activity', id: activity.id, categoryId: activity.categoryId })}
                                                onDragEnd={handleDragEnd}
                                                className="cursor-grab active:cursor-grabbing p-1 -ml-1 mr-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] touch-none"
                                                title="Drag to reorder"
                                            >
                                                <GripVertical size={14} />
                                            </div>
                                            <span
                                                className="text-[11px] font-semibold break-words flex-1 min-w-0 leading-snug"
                                                style={{ color: activity.priority ? 'var(--text-primary)' : 'var(--text-secondary)' }}
                                            >
                                                {activity.name}
                                            </span>
                                            <div className="flex sm:hidden sm:group-hover:flex items-center gap-1 shrink-0 mt-0.5">
                                                <button
                                                    onClick={() => cycleActivityPriority(activity)}
                                                    title={`Priority: ${activity.priority ?? 'none'} — click to cycle`}
                                                    className="p-1 sm:p-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-600"
                                                    style={{
                                                        color:
                                                            activity.priority === 'high' ? 'var(--priority-high)' :
                                                            activity.priority === 'medium' ? 'var(--priority-medium)' :
                                                            activity.priority === 'low' ? 'var(--priority-low)' :
                                                            'var(--text-muted)',
                                                    }}
                                                >
                                                    <Flag size={12} />
                                                </button>
                                                <button
                                                    onClick={() => handleEditActivity(activity.id, activity.name)}
                                                    className="p-1 sm:p-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-600"
                                                    style={{ color: 'var(--text-muted)' }}
                                                >
                                                    <Edit2 size={12} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteActivity(activity.id)}
                                                    className="p-1 sm:p-0.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500"
                                                >
                                                    <Trash size={12} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* date toggle cells */}
                                        {days.map(day => {
                                            const dateStr = formatDate(day);
                                            const locked = isFuture(day);
                                            const completed = logMap.get(`${dateStr}:${activity.id}`) ?? false;
                                            const _today = isToday(day);
                                            return (
                                                <div
                                                    key={day}
                                                    className="w-10 flex-shrink-0 flex items-center justify-center border-r transition-colors"
                                                    style={{
                                                        borderColor: 'var(--border)',
                                                        background: _today ? 'var(--primary-light)' : 'transparent',
                                                    }}
                                                >
                                                    <button
                                                        disabled={locked}
                                                        onClick={() => onToggle(dateStr, activity.id)}
                                                        className={[
                                                            'w-6 h-6 rounded-lg flex items-center justify-center transition-all active:scale-90',
                                                            completed
                                                                ? 'bg-green-600 text-white shadow-sm shadow-green-300 dark:shadow-green-900/30'
                                                                : 'border hover:border-green-400 dark:hover:border-green-500',
                                                            locked ? 'cursor-not-allowed opacity-40' : '',
                                                        ].join(' ')}
                                                        style={!completed ? { borderColor: 'var(--border)', background: 'var(--bg-subtle)' } : undefined}
                                                    >
                                                        {locked
                                                            ? <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)' }}><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                                                            : completed
                                                                ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                                                : null
                                                        }
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                                })
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
