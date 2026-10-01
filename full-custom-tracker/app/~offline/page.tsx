'use client';

export default function OfflinePage() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen px-6 text-center"
      style={{ background: "#F5EFE6", color: "#4A403B", fontFamily: "system-ui, -apple-system, sans-serif" }}
    >
      <div className="space-y-4 max-w-sm">
        {/* Icon */}
        <div className="text-6xl">📵</div>

        {/* Title */}
        <h1 className="text-xl font-semibold">Offline</h1>

        {/* Description */}
        <p className="text-sm leading-relaxed" style={{ color: "#7C716A" }}>
          Tidak ada koneksi internet. Data Anda tersimpan secara lokal di
          perangkat ini. Buka kembali aplikasi saat online untuk menyinkronkan.
        </p>

        {/* Retry button */}
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2.5 rounded-full font-medium text-white text-sm"
          style={{ background: "#7A8C6E" }}
        >
          Coba Lagi
        </button>
      </div>
    </div>
  );
}
