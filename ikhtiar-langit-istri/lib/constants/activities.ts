export type ActivityCategory =
  | 'Qiyamulail'
  | 'Sholat Tepat Waktu'
  | 'Sholat Sunnah Rawatib'
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
  // Qiyamulail
  { id: 'tahajud', name: 'Sholat Qiyamulail/Tahajud', category: 'Qiyamulail' },
  { id: 'taubat', name: 'Sholat Sunnah Taubat', category: 'Qiyamulail' },

  // Sholat Tepat Waktu
  { id: 'subuh', name: 'Sholat Subuh Tepat Waktu', category: 'Sholat Tepat Waktu' },
  { id: 'zuhur', name: 'Sholat Zuhur Tepat Waktu', category: 'Sholat Tepat Waktu' },
  { id: 'ashar', name: 'Sholat Ashar Tepat Waktu', category: 'Sholat Tepat Waktu' },
  { id: 'magrib', name: 'Sholat Magrib Tepat Waktu', category: 'Sholat Tepat Waktu' },
  { id: 'isya', name: 'Sholat Isya Tepat Waktu', category: 'Sholat Tepat Waktu' },

  // Sholat Sunnah Rawatib
  { id: 'qob_subuh', name: 'Sholat Sunnah Qobliyah Subuh', category: 'Sholat Sunnah Rawatib' },

  // Zikir Harian
  { id: 'zikir_pagi', name: 'Membaca Ayat Kursi, Alikhlas, Alfalaq, Annas Pada Pagi Hari', category: 'Zikir Harian' },
  { id: 'zikir_petang', name: 'Membaca Ayat Kursi, Alikhlas, Alfalaq, Annas Pada Sore Hari', category: 'Zikir Harian' },
  { id: 'zikir_bada_sholat', name: 'Membaca Ayat Kursi, Alikhlas, Alfalaq, Annas Tiap Selesai Waktu Sholat Wajib', category: 'Zikir Harian' },
  { id: 'sholawat', name: 'Membaca Sholawat 10x', category: 'Zikir Harian' },
  { id: 'la_haula', name: 'Membaca Zikir Laa haula walaa quwwata illa billah 10x', category: 'Zikir Harian' },
  { id: 'hasbi_rabbi', name: 'Membaca Zikir Hasbi rabbi jallallah 10x', category: 'Zikir Harian' },
  { id: 'subhanallah', name: 'Membaca Zikir Subhanallah Wabihamdihi 10x', category: 'Zikir Harian' },
  { id: 'astagfirullah', name: 'Membaca Zikir Astagfirullah Waatuubuilaihi 1000x', category: 'Zikir Harian' },

  // Interaksi Al Quran
  { id: 'tilawah', name: 'Tilawah Al Quran', category: 'Interaksi Al Quran' },
  { id: 'al_mulk', name: 'Membaca Surat Almulk Pada Malam Hari', category: 'Interaksi Al Quran' },

  // Ibadah Lainnya
  { id: 'sedekah', name: 'Sedekah', category: 'Ibadah Lainnya' },
  { id: 'dhuha', name: 'Sholat Sunnah Dhuha', category: 'Ibadah Lainnya' },
  { id: 'mendoakan', name: 'Mendoakan Orang Lain', category: 'Ibadah Lainnya' },
];

export const CATEGORIES: ActivityCategory[] = [
  'Qiyamulail',
  'Sholat Tepat Waktu',
  'Sholat Sunnah Rawatib',
  'Zikir Harian',
  'Interaksi Al Quran',
  'Ibadah Lainnya',
];
