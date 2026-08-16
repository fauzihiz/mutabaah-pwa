'use client';
import React from 'react';
interface ChangelogModalProps { isOpen: boolean; onClose: () => void; }
const X = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const Sp = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z"/></svg>;
const Bg = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m8 2 1.9 1.9"/><path d="M14.1 3.9 16 2"/><path d="M9 7.1v-1a3 3 0 1 1 6 0v1"/><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"/><path d="M12 20v-9"/></svg>;
const Zp = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
type IF = () => React.JSX.Element;
const CL = [
  { v:'v1.5.0', d:'Agustus 2026', items:[
    {t:'fix',i:Bg,x:'Kolom hari ini kini tetap ter-highlight hijau meski melewati pergantian hari (midnight).'},
    {t:'feature',i:Sp,x:'Grid otomatis scroll ke kolom hari ini saat aplikasi dibuka.'},
    {t:'fix',i:Bg,x:'Tombol "Reset Semua Data" kini hanya terlihat di mode development.'},
  ]},
  { v:'v1.4.0', d:'Agustus 2026', items:[
    {t:'feature',i:Sp,x:'Tombol "Reset Semua Data" untuk menghapus seluruh data lokal dari perangkat.'},
    {t:'fix',i:Bg,x:'Aktivitas kustom yang namanya dikosongkan saat rename akan otomatis kembali ke nama default (Aktivitas Kustom 1, dst).'},
    {t:'fix',i:Bg,x:'Aplikasi kini tetap bisa dibuka saat offline — halaman fallback ditampilkan jika belum ada cache, dan pembaruan hanya berjalan saat terkoneksi internet.'},
  ]},
  { v:'v1.3.0', d:'Agustus 2026', items:[
    {t:'removed',i:Zp,x:'Login & Supabase dihapus — aplikasi kini sepenuhnya offline.'},
    {t:'removed',i:Zp,x:'Fitur Planner dihapus sementara.'},
    {t:'removed',i:Zp,x:'Sistem pencapaian/badge disembunyikan sementara.'},
    {t:'feature',i:Sp,x:'Nama sapaan ("Sahabat") kini bisa diedit.'},
    {t:'feature',i:Sp,x:'Semua data 100% lokal (IndexedDB).'},
  ]},
  { v:'v1.2.0', d:'Maret 2026', items:[
    {t:'feature',i:Sp,x:'Aktivitas Mandiri (Custom Slots) yang bisa di-rename.'},
    {t:'feature',i:Sp,x:'Navigasi: Menu Hamburger dan riwayat pembaruan.'},
    {t:'feature',i:Zp,x:'Ikon edit aktivitas kustom kini selalu terlihat di mobile.'},
    {t:'fix',i:Bg,x:'Perbaikan bug: Tanggal hari ini tidak lagi terkunci.'},
    {t:'fix',i:Bg,x:'Readability: Teks aktivitas panjang kini otomatis melipat.'},
  ]},
  { v:'v1.1.0', d:'Februari 2026', items:[
    {t:'feature',i:Sp,x:'Mode Gelap (Dark Mode) dengan deteksi otomatis.'},
    {t:'feature',i:Sp,x:'Sistem Badge baru yang dinamis per bulan.'},
    {t:'feature',i:Sp,x:'Branding: Ikon aplikasi dan Favicon baru.'},
  ]}
];
export function ChangelogModal({ isOpen, onClose }: ChangelogModalProps) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div onClick={onClose} className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]" />
            <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border shadow-2xl animate-[scaleIn_0.2s_ease-out]" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
                <div className="flex items-center justify-between border-b px-6 py-4" style={{ borderColor: 'var(--border)' }}>
                    <div><h2 className="text-lg font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>Changelog</h2><p className="text-[10px] uppercase font-bold tracking-widest" style={{ color: 'var(--text-muted)' }}>Pembaruan Aplikasi</p></div>
                    <button onClick={onClose} className="rounded-full p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"><span style={{ color: 'var(--text-muted)' }}><X /></span></button>
                </div>
                <div className="max-h-[60vh] overflow-y-auto px-6 py-4 space-y-8 scrollbar-hide">
                    {CL.map((r) => (
                        <div key={r.v} className="space-y-4">
                            <div className="flex items-baseline justify-between"><h3 className="text-md font-bold text-green-600 dark:text-green-500">{r.v}</h3><span className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>{r.d}</span></div>
                            <div className="space-y-3">
                                {r.items.map((it, idx) => (
                                    <div key={idx} className="flex gap-3">
                                        <div className={'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md '+(it.t==='feature'?'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400':'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400')}><it.i /></div>
                                        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{it.x}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="border-t bg-slate-50/50 dark:bg-slate-900/20 px-6 py-4 text-center" style={{ borderColor: 'var(--border)' }}>
                    <p className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>Mutabaah Tracker v1.5.0 • <a href="https://fauzihiz.github.io/" target="_blank" rel="noopener noreferrer" className="text-green-600 dark:text-green-500 font-bold hover:underline">FAUZI HIZ</a></p>
                </div>
            </div>
        </div>
    );
}
