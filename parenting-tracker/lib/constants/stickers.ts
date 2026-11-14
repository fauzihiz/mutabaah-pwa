export type StickerValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface StickerOption {
    value: StickerValue;
    label: string;
    description: string;
    category: 'primary' | 'supporting';
    color: string;
    icon: string; // Add emoji icon
}

// Primary stickers (1-6): Progress states
export const PRIMARY_STICKERS: StickerOption[] = [
    { value: 1, label: 'SUDAH BISA', description: 'Mandiri melakukan aktivitas', category: 'primary', color: 'green', icon: '✅' },
    { value: 2, label: 'DENGAN BANTUAN', description: 'Masih perlu dibantu', category: 'primary', color: 'green', icon: '🔗' },
    { value: 3, label: 'MASIH LATIHAN', description: 'Sedang belajar', category: 'primary', color: 'green', icon: '🔄' },
    { value: 4, label: 'BARU MULAI', description: 'Baru diperkenalkan', category: 'primary', color: 'green', icon: '🌱' },
    { value: 5, label: 'BELUM DICOBA', description: 'Belum dilakukan', category: 'primary', color: 'gray', icon: '⚪' },
    { value: 6, label: 'PENCAPAIAN', description: 'Apresiasi kemajuan anak', category: 'primary', color: 'green', icon: '🏆' },
];

// Supporting stickers (7-10): Additional flags
export const SUPPORTING_STICKERS: StickerOption[] = [
    { value: 7, label: 'FAVORIT ANAK', description: 'Aktivitas yang disukai anak', category: 'supporting', color: 'blue', icon: '❤️' },
    { value: 8, label: 'ULANGI LAGI', description: 'Aktivitas yang perlu diulang', category: 'supporting', color: 'blue', icon: '🔁' },
    { value: 9, label: 'PERLU DIAMATI', description: 'Perlu pengamatan lebih lanjut dari Bunda', category: 'supporting', color: 'orange', icon: '👁️' },
    { value: 10, label: 'TARGET MINGGU INI', description: 'Aktivitas yang menjadi fokus latihan', category: 'supporting', color: 'purple', icon: '🎯' },
];

export const ALL_STICKERS: StickerOption[] = [...PRIMARY_STICKERS, ...SUPPORTING_STICKERS];

export function isPrimarySticker(value: StickerValue): boolean {
    return value >= 1 && value <= 6;
}

export function isSupportingSticker(value: StickerValue): boolean {
    return value >= 7 && value <= 10;
}

export function getStickerOption(value: number): StickerOption | undefined {
    return ALL_STICKERS.find(sticker => sticker.value === value);
}

// Helper functions
export function getMainStickerIcon(value: number): string {
    const sticker = getStickerOption(value);
    return sticker?.icon || '';
}

export function getSupportingStickers(): StickerOption[] {
    return SUPPORTING_STICKERS;
}