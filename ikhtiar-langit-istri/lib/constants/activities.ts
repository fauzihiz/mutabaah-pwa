export type ActivityCategory =
  | 'Sholat Tepat Waktu'
  | 'Sholat Sunnah'
  | 'Zikir Harian'
  | 'Interaksi Al Quran'
  | 'Sedekah'
  | 'Ibadah Lainnya'
  | 'Curhat Berulang';

export interface Activity {
  id: string;
  name: string;
  category: ActivityCategory;
  description?: string;
}

export const ACTIVITIES: Activity[] = [
  // Sholat Tepat Waktu
  { id: 'subuh', name: 'Sholat Subuh', category: 'Sholat Tepat Waktu' },
  { id: 'zuhur', name: 'Sholat Zuhur', category: 'Sholat Tepat Waktu' },
  { id: 'ashar', name: 'Sholat Ashar', category: 'Sholat Tepat Waktu' },
  { id: 'magrib', name: 'Sholat Magrib', category: 'Sholat Tepat Waktu' },
  { id: 'isya', name: 'Sholat Isya', category: 'Sholat Tepat Waktu' },
  
  // Sholat Sunnah
  { id: 'tahajud', name: 'Sholat Sunnah Tahajud', category: 'Sholat Sunnah' },
  { id: 'taubat', name: 'Sholat Sunnah Taubat', category: 'Sholat Sunnah' },
  { id: 'hajat', name: 'Sholat Sunnah Hajat', category: 'Sholat Sunnah' },
  { id: 'witr', name: 'Sholat Sunnah witr', category: 'Sholat Sunnah' },
  { id: 'qob_subuh', name: 'Sholat Sunnah Qobliyah Subuh', category: 'Sholat Sunnah' },
  { id: 'dhuha', name: 'Sholat Sunnah Dhuha', category: 'Sholat Sunnah' },

  // Zikir Harian
  { id: 'zikir_pagi', name: 'Ayat Kursi + Alikhlas, Alfalaq, Annas Waktu Pagi', category: 'Zikir Harian' },
  { id: 'zikir_bada_sholat', name: 'Ayat Kursi Setelah Sholat Wajib', category: 'Zikir Harian' },
  { id: 'la_haula', name: 'Laa haula walaa quwwata illa billah 10x', category: 'Zikir Harian' },
  { id: 'hasbi_rabbi', name: 'Hasbi rabbi jallallah 10x', category: 'Zikir Harian' },
  { id: 'subhanallah', name: 'Subhanallah Wabihamdihi Subhanallahiladzim 10x', category: 'Zikir Harian' },
  { id: 'yunus', name: 'Doa Nabi Yunus 10x', category: 'Zikir Harian' },
  { id: 'astagfirullah', name: 'Astagfirullah Waatuubuilaihi 100x', category: 'Zikir Harian' },
  { id: 'sholawat', name: 'Sholawat 100x', category: 'Zikir Harian' },
  { id: 'zikir_petang', name: 'Ayat Kursi + Alikhlas, Alfalaq, Annas Waktu Petang', category: 'Zikir Harian' },

  // Interaksi Al Quran
  { id: 'tilawah', name: 'Tilawah Al Quran 1 Halaman', category: 'Interaksi Al Quran' },
  { id: 'al_mulk', name: 'Membaca Surat Almulk Malam Hari', category: 'Interaksi Al Quran' },
  { id: 'attalaq', name: 'Membaca Surat Attalaq ayat 2-3 dan artinya', category: 'Interaksi Al Quran' },
  { id: 'alqashas', name: 'Membaca Surat Alqashas ayat 24 dan artinya', category: 'Interaksi Al Quran' },

  // Sedekah
  { id: 'sedekah_uang', name: 'Sedekah Uang', category: 'Sedekah' },
  { id: 'sedekah_tenaga', name: 'Sedekah Tenaga', category: 'Sedekah' },
  { id: 'sedekah_ilmu', name: 'Sedekah Ilmu', category: 'Sedekah' },
  { id: 'sedekah_makanan', name: 'Sedekah Makanan', category: 'Sedekah' },

  // Ibadah Lainnya
  { id: 'mendoakan', name: 'Mendoakan Minimal 5 Orang Lain', category: 'Ibadah Lainnya' },
  { id: 'bersih', name: 'Membersihkan Rumah', category: 'Ibadah Lainnya' },
  { id: 'tidak_bentak', name: 'Tidak Bentak Suami & Anak', category: 'Ibadah Lainnya' },
  { id: 'gerak', name: 'Ikhtiar Gerak Antusias', category: 'Ibadah Lainnya' },
  
  // Curhat Berulang
  { id: 'doa_setelah_sholat', name: 'Doa Setelah Sholat Wajib', category: 'Curhat Berulang' },
  { id: 'doa_sepertiga_malam', name: 'Doa Pada Sepertiga Malam', category: 'Curhat Berulang' },
  { id: 'doa_setelah_azan', name: 'Doa Antara Adzan dan Iqomah', category: 'Curhat Berulang' },
  { id: 'selftalk_berlimpah', name: 'Baca Selftalk Keberlimpahan', category: 'Curhat Berulang' },
];

export const CATEGORIES: ActivityCategory[] = [
  'Sholat Tepat Waktu',
  'Sholat Sunnah',
  'Zikir Harian',
  'Interaksi Al Quran',
  'Sedekah',
  'Ibadah Lainnya',
  'Curhat Berulang',
];