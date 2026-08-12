'use client';

export default function OfflinePage() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen px-6 text-center"
      style={{ background: "#f8fafc", color: "#0f172a", fontFamily: "system-ui, -apple-system, sans-serif" }}
    >
      <div className="space-y-4 max-w-sm">
        {/* Icon */}
        <div className="text-6xl">📵</div>

        {/* Title */}
        <h1 className="text-xl font-semibold">Offline</h1>

        {/* Description */}
        <p className="text-sm leading-relaxed" style={{ color: "#475569" }}>
          Tidak ada koneksi internet. Data Anda tersimpan secara lokal di
          perangkat ini. Buka kembali aplikasi saat online untuk menyinkronkan.
        </p>

        {/* Retry button */}
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2.5 rounded-full font-medium text-white text-sm"
          style={{ background: "#16a34a" }}
        >
          Coba Lagi
        </button>
      </div>
    </div>
  );
}
