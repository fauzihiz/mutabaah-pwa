'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Award, CheckCircle2 } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts';
import { CategoryStat } from '@/hooks/useMonthlyStats';

interface StatsViewProps {
    stats: {
        categoryStats: CategoryStat[];
        overallPercentage: number;
        totalCompleted: number;
        totalTarget: number;
    } | null;
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

export function StatsView({ stats }: StatsViewProps) {
    if (!stats) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col p-6 space-y-8 pb-32"
        >
            {/* Overall Progress Card */}
            <div className="p-6 rounded-3xl border text-center space-y-4" style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border)' }}>
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                    Total Kedisiplinan
                </p>
                <div className="relative inline-flex items-center justify-center">
                    <svg className="w-32 h-32 transform -rotate-90">
                        <circle
                            cx="64"
                            cy="64"
                            r="58"
                            stroke="currentColor"
                            strokeWidth="10"
                            fill="transparent"
                            className="text-slate-200 dark:text-slate-700"
                        />
                        <circle
                            cx="64"
                            cy="64"
                            r="58"
                            stroke="currentColor"
                            strokeWidth="10"
                            fill="transparent"
                            strokeDasharray={364.4}
                            strokeDashoffset={364.4 - (364.4 * stats.overallPercentage) / 100}
                            strokeLinecap="round"
                            className="text-green-500 transition-all duration-1000 ease-out"
                        />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                        <span className="text-3xl font-black" style={{ color: 'var(--text-primary)' }}>
                            {stats.overallPercentage}%
                        </span>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="text-left">
                        <p className="text-[10px] font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Selesai</p>
                        <p className="text-lg font-black" style={{ color: 'var(--text-primary)' }}>{stats.totalCompleted}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Target</p>
                        <p className="text-lg font-black" style={{ color: 'var(--text-primary)' }}>{stats.totalTarget}</p>
                    </div>
                </div>
            </div>

            {/* Bar Chart Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <TrendingUp size={16} className="text-blue-500" />
                    <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Performa Per Kategori</h3>
                </div>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={stats.categoryStats}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                        >
                            <XAxis type="number" hide domain={[0, 100]} />
                            <YAxis
                                dataKey="name"
                                type="category"
                                width={80}
                                tick={{ fontSize: 10, fontWeight: 600, fill: 'var(--text-secondary)' }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                cursor={{ fill: 'transparent' }}
                                contentStyle={{
                                    borderRadius: '16px',
                                    border: 'none',
                                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                    fontSize: '11px',
                                    fontWeight: 'bold',
                                    backgroundColor: 'var(--bg-surface)',
                                    color: 'var(--text-primary)'
                                }}
                            />
                            <Bar
                                dataKey="percentage"
                                radius={[0, 10, 10, 0]}
                                barSize={18}
                            >
                                {stats.categoryStats.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Quick Insights */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Award size={16} className="text-yellow-500" />
                    <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Quick Insight</h3>
                </div>
                <div className="space-y-3">
                    {stats.categoryStats.map((cat, idx) => (
                        <div
                            key={cat.name}
                            className="flex items-center justify-between p-4 rounded-2xl border"
                            style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-2 h-2 rounded-full"
                                    style={{ background: COLORS[idx % COLORS.length] }}
                                />
                                <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                                    {cat.name}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-black" style={{ color: 'var(--text-primary)' }}>
                                    {cat.percentage}%
                                </span>
                                {cat.percentage >= 80 && <CheckCircle2 size={14} className="text-green-500" />}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
