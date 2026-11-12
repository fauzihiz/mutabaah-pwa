export type ActivityCategory =
  | 'Qiyamulail'
  | 'Sholat Tepat Waktu'
  | 'Sholat Sunnah Rawatib'
  | 'Zikir Harian'
  | 'Interaksi Al Quran'
  | 'Ibadah Lainnya'
  | 'Amalan Unggulan'
  | 'Aktivitas Ramadhan';

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

  // Sholat Tepat Waktu
  { id: 'subuh', name: 'Subuh', category: 'Sholat Tepat Waktu' },
  { id: 'zuhur', name: 'Zuhur', category: 'Sholat Tepat Waktu' },
  { id: 'ashar', name: 'Ashar', category: 'Sholat Tepat Waktu' },
  { id: 'magrib', name: 'Magrib', category: 'Sholat Tepat Waktu' },
  { id: 'isya', name: 'Isya', category: 'Sholat Tepat Waktu' },

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
  { id: 'tilawah', name: 'Tilawah', category: 'Interaksi Al Quran' },
  { id: 'tafsir', name: 'Tafsir', category: 'Interaksi Al Quran' },
  { id: 'al_waqiah', name: 'Al Waqiah', category: 'Interaksi Al Quran' },
  { id: 'al_mulk', name: 'Al Mulk', category: 'Interaksi Al Quran' },

  // Ibadah Lainnya
  { id: 'puasa', name: 'Puasa', category: 'Ibadah Lainnya' },
  { id: 'sedekah', name: 'Sedekah', category: 'Ibadah Lainnya' },
  { id: 'dhuha', name: 'Dhuha', category: 'Ibadah Lainnya' },
  { id: 'mendoakan', name: 'Mendoakan Orang lain di jalan', category: 'Ibadah Lainnya' },
  { id: 'memaafkan', name: 'Memaafkan Orang Lain Sebelum Tidur', category: 'Ibadah Lainnya' },

  // Aktivitas Ramadhan
  { id: 'kajian', name: 'Mengikuti atau Mendengarkan Kajian Ilmu', category: 'Aktivitas Ramadhan' },
  { id: 'doa_sahur', name: 'Memperbanyak Doa Saat Sahur', category: 'Aktivitas Ramadhan' },
  { id: 'doa_berbuka', name: 'Memperbanyak Doa Menjelang Berbuka', category: 'Aktivitas Ramadhan' },
  { id: 'sedekah_berbuka', name: 'Bersedekah Makanan Berbuka', category: 'Aktivitas Ramadhan' },
  { id: 'menjaga_lisan', name: 'Menjaga Lisan', category: 'Aktivitas Ramadhan' },
  { id: 'menahan_amarah', name: 'Menahan Amarah', category: 'Aktivitas Ramadhan' },
  { id: 'menghindari_ghibah', name: 'Menghindari Ghibah', category: 'Aktivitas Ramadhan' },

  // Amalan Unggulan (pilih satu amalan yang ingin dijaga secara istiqamah)
  { id: 'istigfar', name: 'Memperbanyak Istigfar', category: 'Amalan Unggulan' },
  { id: 'selawat', name: 'Memperbanyak Selawat', category: 'Amalan Unggulan' },
  { id: 'sedekah_subuh', name: 'Sedekah Subuh', category: 'Amalan Unggulan' },
  { id: 'zikir_pagi_petang', name: 'Zikir Pagi dan Petang', category: 'Amalan Unggulan' },
  { id: 'tahajud_unggulan', name: 'Salat Tahajud', category: 'Amalan Unggulan' },
  { id: 'duha', name: 'Salat Duha', category: 'Amalan Unggulan' },
  { id: 'tilawah_harian', name: "Membaca Al-Qur'an Setiap Hari", category: 'Amalan Unggulan' },
  { id: 'al_mulk_malam', name: 'Membaca Surah Al-Mulk Setiap Malam', category: 'Amalan Unggulan' },
  { id: 'ayat_kursi', name: 'Membaca Ayat Kursi Setelah Salat Wajib', category: 'Amalan Unggulan' },
  { id: 'tasbih_tidur', name: 'Membaca Tasbih, Tahmid, dan Takbir Sebelum Tidur', category: 'Amalan Unggulan' },
  { id: 'bersyukur', name: 'Membiasakan Bersyukur', category: 'Amalan Unggulan' },
];

export const CATEGORIES: ActivityCategory[] = [
  'Qiyamulail',
  'Sholat Tepat Waktu',
  'Sholat Sunnah Rawatib',
  'Zikir Harian',
  'Interaksi Al Quran',
  'Ibadah Lainnya',
  'Aktivitas Ramadhan',
  'Amalan Unggulan',
];
