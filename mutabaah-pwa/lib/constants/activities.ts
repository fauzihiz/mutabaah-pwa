export type ActivityCategory =
  | 'Sholat Tepat Waktu'
  | 'Ibadah Lainnya'
  | 'Qiyamulail'
  | 'Sholat Sunnah Rawatib'
  | 'Zikir Harian'
  | 'Interaksi Al Quran'
  | 'Amalan Unggulan';

export interface Activity {
  id: string;
  name: string;
  category: ActivityCategory;
  description?: string;
}

export const ACTIVITIES: Activity[] = [
  // Sholat Tepat Waktu (Wajib) — amalan Ramadhan diutamakan di atas
  { id: 'subuh', name: 'Subuh', category: 'Sholat Tepat Waktu' },
  { id: 'zuhur', name: 'Zuhur', category: 'Sholat Tepat Waktu' },
  { id: 'ashar', name: 'Ashar', category: 'Sholat Tepat Waktu' },
  { id: 'magrib', name: 'Magrib', category: 'Sholat Tepat Waktu' },
  { id: 'isya', name: 'Isya', category: 'Sholat Tepat Waktu' },

  // Ibadah Lainnya — amalan Ramadhan diutamakan di atas
  { id: 'puasa_ramadhan', name: 'Puasa Ramadan', category: 'Ibadah Lainnya' },
  { id: 'itikaf', name: 'Itikaf', category: 'Ibadah Lainnya' },
  { id: 'kajian', name: 'Mengikuti atau Mendengarkan Kajian Ilmu', category: 'Ibadah Lainnya' },
  { id: 'sedekah_berbuka', name: 'Berbagi Takjil', category: 'Ibadah Lainnya' },
  { id: 'menjaga_lisan', name: 'Menjaga Lisan', category: 'Ibadah Lainnya' },
  { id: 'menahan_amarah', name: 'Menahan Amarah', category: 'Ibadah Lainnya' },
  { id: 'menghindari_ghibah', name: 'Menghindari Ghibah', category: 'Ibadah Lainnya' },
  { id: 'sedekah_subuh', name: 'Sedekah Subuh', category: 'Ibadah Lainnya' },
  { id: 'dhuha', name: 'Shalat Sunnah Dhuha', category: 'Ibadah Lainnya' },
  { id: 'mendoakan', name: 'Mendoakan Orang lain di jalan', category: 'Ibadah Lainnya' },
  { id: 'memaafkan', name: 'Memaafkan Orang Lain Sebelum Tidur', category: 'Ibadah Lainnya' },

  // Qiyamulail (Sunnah) — amalan Ramadhan diutamakan di atas
  { id: 'tarawih', name: 'Shalat Sunah Tarawih', category: 'Qiyamulail' },
  { id: 'tahajud', name: 'Sholat Tahajud', category: 'Qiyamulail' },
  { id: 'witir', name: 'Sholat Witir', category: 'Qiyamulail' },
  { id: 'taubat', name: 'Sholat Taubat', category: 'Qiyamulail' },
  { id: 'hajat', name: 'Sholat Hajat', category: 'Qiyamulail' },

  // Sholat Sunnah Rawatib (Sunnah)
  { id: 'qob_subuh', name: 'Qobliyah Subuh', category: 'Sholat Sunnah Rawatib' },
  { id: 'qob_zuhur', name: 'Qobiyah Zuhur', category: 'Sholat Sunnah Rawatib' },
  { id: 'bad_zuhur', name: 'Badiah Zuhur', category: 'Sholat Sunnah Rawatib' },
  { id: 'bad_magrib', name: 'Badiah Magrib', category: 'Sholat Sunnah Rawatib' },
  { id: 'bad_isya', name: 'Badiah Isya', category: 'Sholat Sunnah Rawatib' },

  // Zikir Harian (Sunnah) — amalan Ramadhan diutamakan di atas
  { id: 'doa_sahur', name: 'Memperbanyak Doa Saat Sahur', category: 'Zikir Harian' },
  { id: 'doa_berbuka', name: 'Memperbanyak Doa Menjelang Berbuka', category: 'Zikir Harian' },
  { id: 'doa_lailatul_qadr', name: 'Membaca Doa Lailatul Qadr', category: 'Zikir Harian' },
  { id: 'zikir_pagi', name: 'Zikir Pagi', category: 'Zikir Harian' },
  { id: 'sholawat', name: 'Sholawat 10x', category: 'Zikir Harian' },
  { id: 'la_haula', name: 'Laa haula walaa quwwata illa billah 10x', category: 'Zikir Harian' },
  { id: 'hasbi_rabbi', name: 'Hasbi rabbi jallallah 10x', category: 'Zikir Harian' },
  { id: 'astagfirullah', name: 'Astagfirullah Waatuubuilaihi 10x', category: 'Zikir Harian' },
  { id: 'subhanallah', name: 'Subhanallah Wabihamdihi 10x', category: 'Zikir Harian' },
  { id: 'zikir_petang', name: 'Zikir Petang', category: 'Zikir Harian' },

  // Interaksi Al Quran (Sunnah)
  { id: 'tilawah', name: 'Tilawah', category: 'Interaksi Al Quran' },
  { id: 'terjemahan_quran', name: "Membaca Terjemahan Al-Qur'an", category: 'Interaksi Al Quran' },

  // Amalan Unggulan (pilih satu amalan yang ingin dijaga secara istiqamah) — dinonaktifkan sementara
  // { id: 'istigfar', name: 'Memperbanyak Istigfar', category: 'Amalan Unggulan' },
  // { id: 'shalawat', name: 'Memperbanyak Shalawat', category: 'Amalan Unggulan' },
  // { id: 'sedekah_subuh', name: 'Sedekah Subuh', category: 'Amalan Unggulan' },
  // { id: 'zikir_pagi_petang', name: 'Zikir Pagi dan Petang', category: 'Amalan Unggulan' },
  // { id: 'tahajud_unggulan', name: 'Shalat Tahajud', category: 'Amalan Unggulan' },
  // { id: 'duha', name: 'Salat Duha', category: 'Amalan Unggulan' },
  // { id: 'tilawah_harian', name: "Membaca Al-Qur'an Setiap Hari", category: 'Amalan Unggulan' },
  // { id: 'al_mulk_malam', name: 'Membaca Surah Al-Mulk Setiap Malam', category: 'Amalan Unggulan' },
  // { id: 'ayat_kursi', name: 'Membaca Ayat Kursi Setelah Salat Wajib', category: 'Amalan Unggulan' },
  // { id: 'tasbih_tidur', name: 'Membaca Tasbih, Tahmid, dan Takbir Sebelum Tidur', category: 'Amalan Unggulan' },
  // { id: 'bersyukur', name: 'Membiasakan Bersyukur', category: 'Amalan Unggulan' },
];

export const CATEGORIES: ActivityCategory[] = [
  'Sholat Tepat Waktu',
  'Ibadah Lainnya',
  'Qiyamulail',
  'Sholat Sunnah Rawatib',
  'Zikir Harian',
  'Interaksi Al Quran',
  // 'Amalan Unggulan', // Dinonaktifkan sementara — belum dibutuhkan
];
