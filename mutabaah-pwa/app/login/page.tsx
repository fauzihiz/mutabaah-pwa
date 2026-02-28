'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { Mail, Loader2, CheckCircle2, AlertCircle, Send } from 'lucide-react';
import Image from 'next/image';

const STEPS = [
    { n: '1', text: 'Masukkan alamat email kamu di bawah.' },
    { n: '2', text: 'Klik tombol "Kirim Link Masuk".' },
    { n: '3', text: 'Buka email kamu, lalu klik link yang kami kirimkan.' },
];

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && user) router.push('/');
    }, [user, authLoading, router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: { emailRedirectTo: window.location.origin },
        });

        if (error) setError(error.message);
        else setSent(true);

        setLoading(false);
    };

    if (authLoading) return null;

    return (
        <div
            className="flex-1 flex flex-col min-h-full relative overflow-hidden"
            style={{ background: 'var(--bg-base)' }}
        >
            {/* Background decorative blobs */}
            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-10 bg-green-500 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full opacity-10 bg-emerald-400 blur-3xl pointer-events-none" />

            <div className="flex-1 flex flex-col justify-center px-6 py-12 space-y-8 relative z-10">

                {/* ── App brand ── */}
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-20 h-20 rounded-3xl overflow-hidden shadow-lg shadow-green-900/20">
                        <Image src="/favicon.png" alt="Mutabaah" width={80} height={80} className="w-full h-full object-cover" />
                    </div>
                    <div className="text-center">
                        <h1
                            className="text-3xl font-black tracking-tight"
                            style={{ color: 'var(--text-primary)' }}
                        >
                            Mutabaah Tracker
                        </h1>
                        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                            Catat ibadah harianmu. Bangun kebiasaan terbaik.
                        </p>
                    </div>
                </div>

                {/* ── Card ── */}
                <div
                    className="rounded-3xl p-6 space-y-6 shadow-xl border"
                    style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
                >
                    {!sent ? (
                        <>
                            {/* Steps */}
                            <div className="space-y-2">
                                <p className="text-xs font-black uppercase tracking-widest mb-3"
                                    style={{ color: 'var(--text-muted)' }}>
                                    Cara Masuk
                                </p>
                                {STEPS.map(s => (
                                    <div key={s.n} className="flex items-start space-x-3">
                                        <div className="w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">
                                            {s.n}
                                        </div>
                                        <p className="text-sm leading-snug" style={{ color: 'var(--text-secondary)' }}>
                                            {s.text}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t" style={{ borderColor: 'var(--border)' }} />

                            {/* Form */}
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label
                                        htmlFor="email"
                                        className="text-xs font-bold"
                                        style={{ color: 'var(--text-secondary)' }}
                                    >
                                        Alamat Email
                                    </label>
                                    <div className="relative">
                                        <Mail
                                            className="absolute left-3 top-1/2 -translate-y-1/2"
                                            size={18}
                                            style={{ color: 'var(--text-muted)' }}
                                        />
                                        <input
                                            id="email"
                                            type="email"
                                            placeholder="nama@email.com"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            required
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500"
                                            style={{
                                                background: 'var(--bg-subtle)',
                                                borderColor: 'var(--border)',
                                                color: 'var(--text-primary)',
                                            }}
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="flex items-start space-x-2 p-3 rounded-xl bg-red-50 border border-red-100">
                                        <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                                        <p className="text-xs text-red-600">{error}</p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3.5 rounded-xl font-bold text-sm text-white flex items-center justify-center space-x-2 transition-all active:scale-95 disabled:opacity-60"
                                    style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)', boxShadow: '0 4px 20px rgba(22,163,74,0.35)' }}
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin" size={20} />
                                    ) : (
                                        <>
                                            <Send size={16} />
                                            <span>Kirim Link Masuk</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </>
                    ) : (
                        /* ── Success state ── */
                        <div className="flex flex-col items-center text-center space-y-4 py-4">
                            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                                <CheckCircle2 size={36} className="text-green-600" />
                            </div>
                            <div>
                                <p className="font-black text-lg" style={{ color: 'var(--text-primary)' }}>
                                    Link Terkirim! 🎉
                                </p>
                                <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                    Kami telah mengirimkan tautan login ke{' '}
                                    <span className="font-bold text-green-600">{email}</span>.
                                </p>
                                <p className="text-xs mt-3 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                                    Buka email kamu dan klik tautan tersebut untuk masuk. Cek folder <strong>Spam</strong> bila tidak ditemukan di kotak masuk.
                                </p>
                            </div>
                            <button
                                onClick={() => { setSent(false); setEmail(''); }}
                                className="text-xs font-semibold text-green-600 underline underline-offset-2 mt-2"
                            >
                                Gunakan email lain
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer note */}
                <p className="text-center text-[11px]" style={{ color: 'var(--text-muted)' }}>
                    Tidak perlu password. Login aman menggunakan tautan satu kali pakai.
                </p>
            </div>
        </div>
    );
}
