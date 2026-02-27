'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { Mail, ArrowRight, Loader2, Sparkles } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && user) {
            router.push('/');
        }
    }, [user, authLoading, router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: window.location.origin,
            },
        });

        if (error) {
            setMessage({ type: 'error', text: error.message });
        } else {
            setMessage({ type: 'success', text: 'OTP link has been sent to your email!' });
        }
        setLoading(false);
    };

    if (authLoading) return null;

    return (
        <div className="flex-1 flex flex-col p-6 items-center justify-center space-y-8 bg-gradient-to-b from-white to-green-50">
            <div className="text-center space-y-2">
                <div className="inline-flex p-3 rounded-2xl bg-green-100 text-green-600 mb-2">
                    <Sparkles size={32} />
                </div>
                <h1 className="text-3xl font-bold text-slate-900">Mutabaah Tracker</h1>
                <p className="text-slate-500">Track your daily spiritual journey</p>
            </div>

            <div className="w-full space-y-6">
                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-slate-700 ml-1">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all bg-white"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-600/20"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>
                                <span>Send Magic Link</span>
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                </form>

                {message && (
                    <div
                        className={`p-4 rounded-xl text-sm ${message.type === 'success'
                                ? 'bg-green-50 text-green-700 border border-green-100'
                                : 'bg-red-50 text-red-700 border border-red-100'
                            }`}
                    >
                        {message.text}
                    </div>
                )}
            </div>

            <p className="text-xs text-slate-400 text-center max-w-[240px]">
                We'll send a magic link to your email for a passwordless login experience.
            </p>
        </div>
    );
}
