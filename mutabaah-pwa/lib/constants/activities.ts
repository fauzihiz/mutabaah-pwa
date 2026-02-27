export type ActivityCategory = 
  | 'Qiyamulail'
  | 'Sholat Jamaah di Masjid/Tepat Waktu'
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
  { id: 'tahajud', name: 'Sholat Tahajud', category: 'Qiyamulail' },
  { id: 'taubat', name: 'Sholat Taubat', category: 'Qiyamulail' },
  { id: 'hajat', name: 'Sholat Hajat', category: 'Qiyamulail' },
  { id: 'witir', name: 'Sholat Witir', category: 'Qiyamulail' },

  // Sholat Jamaah
  { id: 'subuh', name: 'Subuh', category: 'Sholat Jamaah di Masjid/Tepat Waktu' },
  { id: 'zuhur', name: 'Zuhur', category: 'Sholat Jamaah di Masjid/Tepat Waktu' },
  { id: 'ashar', name: 'Ashar', category: 'Sholat Jamaah di Masjid/Tepat Waktu' },
  { id: 'magrib', name: 'Magrib', category: 'Sholat Jamaah di Masjid/Tepat Waktu' },
  { id: 'isya', name: 'Isya', category: 'Sholat Jamaah di Masjid/Tepat Waktu' },

  // Sholat Sunnah Rawatib
  { id: 'qob_subuh', name: 'Qobliyah Subuh', category: 'Sholat Sunnah Rawatib' },
  { id: 'qob_zuhur', name: 'Qobiyah Zuhur', category: 'Sholat Sunnah Rawatib' },
  { id: 'bad_zuhur', name: 'Badiah Zuhur', category: 'Sholat Sunnah Rawatib' },
  { id: 'bad_magrib', name: 'Badiah Magrib', category: 'Sholat Sunnah Rawatib' },
  { id: 'bad_isya', name: 'Badiah Isya', category: 'Sholat Sunnah Rawatib' },

  // Zikir Harian
  { id: 'zikir_pagi', name: 'Zikir Pagi', category: 'Zikir Harian' },
  { id: 'sholawat', name: 'Sholawat 10x', category: 'Zikir Harian' },
  { id: 'la_haula', name: 'Laa haula walaa quwwata illa billah 10x', category: 'Zikir Harian' },
  { id: 'hasbi_rabbi', name: 'Hasbi rabbi jallallah 10x', category: 'Zikir Harian' },
  { id: 'astagfirullah', name: 'Astagfirullah Waatuubuilaihi 100x', category: 'Zikir Harian' },
  { id: 'subhanallah', name: 'Subhanallah Wabihamdihi 100x', category: 'Zikir Harian' },
  { id: 'zikir_petang', name: 'Zikir Petang', category: 'Zikir Harian' },

  // Interaksi Al Quran
  { id: 'tilawah', name: 'Tilawah 1 Juz', category: 'Interaksi Al Quran' },
  { id: 'tafsir', name: 'Tafsir 1 Ayat', category: 'Interaksi Al Quran' },
  { id: 'al_waqiah', name: 'Al Waqiah', category: 'Interaksi Al Quran' },
  { id: 'al_mulk', name: 'Al Mulk', category: 'Interaksi Al Quran' },

  // Ibadah Lainnya
  { id: 'puasa', name: 'Puasa Sunnah', category: 'Ibadah Lainnya' },
  { id: 'sedekah', name: 'Sedekah Harian', category: 'Ibadah Lainnya' },
  { id: 'dhuha', name: 'Dhuha', category: 'Ibadah Lainnya' },
  { id: 'mendoakan', name: 'Mendoakan Orang lain di jalan', category: 'Ibadah Lainnya' },
  { id: 'memaafkan', name: 'Memaafkan Orang Lain Sebelum Tidur', category: 'Ibadah Lainnya' },
];

export const CATEGORIES: ActivityCategory[] = [
  'Qiyamulail',
  'Sholat Jamaah di Masjid/Tepat Waktu',
  'Sholat Sunnah Rawatib',
  'Zikir Harian',
  'Interaksi Al Quran',
  'Ibadah Lainnya',
];
