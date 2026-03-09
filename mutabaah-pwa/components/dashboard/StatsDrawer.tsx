'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BarChart3, TrendingUp, Award, CheckCircle2 } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie
} from 'recharts';
import { CategoryStat } from '@/hooks/useMonthlyStats';

interface StatsDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    stats: {
        categoryStats: CategoryStat[];
        overallPercentage: number;
        totalCompleted: number;
        totalTarget: number;
    } | null;
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

export function StatsDrawer({ isOpen, onClose, stats }: StatsDrawerProps) {
    if (!stats) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[95]">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                    />

                    {/* Drawer Content */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="absolute right-0 top-0 bottom-0 w-full max-w-md flex flex-col shadow-2xl"
                        style={{ background: 'var(--bg-surface)' }}
                    >
                        {/* Header */}
                        <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400">
                                    <BarChart3 size={20} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
                                        Statistik Bulanan
                                    </h2>
                                    <p className="text-[10px] uppercase font-bold tracking-widest" style={{ color: 'var(--text-muted)' }}>
                                        Performa Ibadah
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                                <X size={20} style={{ color: 'var(--text-muted)' }} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8 scrollbar-hide">

                            {/* Overall Progress Card */}
                            <div className="p-6 rounded-3xl border text-center space-y-4" style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border)' }}>
                                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                                    Total Kepatuhan
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
                                            className="text-slate-200 dark:text-slate-800"
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
                                                    fontWeight: 'bold'
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
                                    <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Insight Cepat</h3>
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

                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t text-center" style={{ borderColor: 'var(--border)' }}>
                            <p className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>
                                Mutabaah Tracker v1.2.0 • Madani Group
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
