export type ActivityCategory =
  | 'Sholat Tepat Waktu'
  | 'Sholat Sunnah'
  | 'Zikir Harian'
  | 'Interaksi Al Quran'
  | 'Ibadah Lainnya';

export interface Activity {
  id: string;
  name: string;
  category: ActivityCategory;
  description?: string;
}

export const ACTIVITIES: Activity[] = [
  // Sholat Sunnah
  { id: 'tahajud', name: 'Sholat Tahajud', category: 'Sholat Sunnah' },
  { id: 'taubat', name: 'Sholat Sunnah Taubat', category: 'Sholat Sunnah' },
  { id: 'qob_subuh', name: 'Sholat Sunnah Qobliyah Subuh', category: 'Sholat Sunnah' },
  { id: 'dhuha', name: 'Sholat Sunnah Dhuha', category: 'Sholat Sunnah' },

  // Sholat Tepat Waktu
  { id: 'subuh', name: 'Sholat Subuh', category: 'Sholat Tepat Waktu' },
  { id: 'zuhur', name: 'Sholat Zuhur', category: 'Sholat Tepat Waktu' },
  { id: 'ashar', name: 'Sholat Ashar', category: 'Sholat Tepat Waktu' },
  { id: 'magrib', name: 'Sholat Magrib', category: 'Sholat Tepat Waktu' },
  { id: 'isya', name: 'Sholat Isya', category: 'Sholat Tepat Waktu' },

  // Zikir Harian
  { id: 'zikir_pagi', name: 'Zikir Pagi', category: 'Zikir Harian' },
  { id: 'zikir_petang', name: 'Zikir Petang', category: 'Zikir Harian' },
  { id: 'zikir_bada_sholat', name: 'Zikir Setelah Sholat Wajib', category: 'Zikir Harian' },
  { id: 'sholawat', name: 'Sholawat 10x', category: 'Zikir Harian' },
  { id: 'la_haula', name: 'Laa haula walaa quwwata illa billah 10x', category: 'Zikir Harian' },
  { id: 'hasbi_rabbi', name: 'Hasbi rabbi jallallah 10x', category: 'Zikir Harian' },
  { id: 'subhanallah', name: 'Subhanallah Wabihamdihi 10x', category: 'Zikir Harian' },
  { id: 'astagfirullah', name: 'Astagfirullah Waatuubuilaihi 1000x', category: 'Zikir Harian' },

  // Interaksi Al Quran
  { id: 'tilawah', name: 'Tilawah Al Quran', category: 'Interaksi Al Quran' },
  { id: 'al_mulk', name: 'Membaca Surat Almulk Pada Malam Hari', category: 'Interaksi Al Quran' },

  // Ibadah Lainnya
  { id: 'sedekah', name: 'Sedekah', category: 'Ibadah Lainnya' },
  { id: 'mendoakan', name: 'Mendoakan Orang Lain', category: 'Ibadah Lainnya' },
];

export const CATEGORIES: ActivityCategory[] = [
  'Sholat Tepat Waktu',
  'Sholat Sunnah',
  'Zikir Harian',
  'Interaksi Al Quran',
  'Ibadah Lainnya',
];
