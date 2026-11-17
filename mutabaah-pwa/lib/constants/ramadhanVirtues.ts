/** Satu poin keutamaan bulan Ramadan beserta dalilnya. */
export interface RamadhanVirtue {
    title: string;
    body: string;
    source: string;
}

/**
 * Keutamaan bulan Ramadhan — disarikan dari artikel Rumaysho
 * "Keutamaan Bulan Ramadhan" (Ustadz Muhammad Abduh Tuasikal, MSc)
 * beserta dalil Al-Qur'an dan hadits shahih (Bukhari–Muslim).
 * Dipakai oleh modal "Keutamaan Ramadhan" sebagai penyemangat ibadah.
 */
export const RAMADHAN_VIRTUES: RamadhanVirtue[] = [
    {
        title: "Bulan diturunkannya Al-Qur'an",
        body: 'Allah menurunkan Al-Qur\'an pada bulan Ramadan sebagai petunjuk bagi manusia, penjelas kebenaran, dan pembeda antara yang hak dan yang batil. Inilah waktu terbaik untuk kembali dekat dengan kitab-Nya — perbanyak tilawah dan tadabur.',
        source: 'QS. Al-Baqarah: 185',
    },
    {
        title: 'Ada Lailatul Qadr yang lebih baik dari 1.000 bulan',
        body: 'Di bulan ini tersimpan satu malam yang nilainya lebih baik dari seribu bulan. Siapa yang menghidupkannya dengan iman dan ihtisab (mengharap pahala), akan diampuni dosa-dosanya yang telah lalu.',
        source: 'QS. Al-Qadr: 3 • HR. Bukhari no. 1901, Muslim no. 760',
    },
    {
        title: 'Pintu surga dibuka, pintu neraka ditutup, setan dibelenggu',
        body: 'Ketika Ramadan tiba, pintu-pintu Jannah dibuka, pintu-pintu Jahannam ditutup, dan setan-setan dibelenggu. Momentum emas untuk beramal dengan lebih leluasa — jangan sia-siakan.',
        source: 'HR. Bukhari no. 1898, Muslim no. 1079',
    },
    {
        title: 'Ampunan menyeluruh bagi yang berpuasa dengan iman & ihtisab',
        body: 'Rasulullah ﷺ bersabda: "Barang siapa berpuasa Ramadan dengan iman dan ihtisab, diampuni dosa-dosanya yang telah lalu." Begitu pula bagi yang menghidupkan qiyam Ramadan (shalat tarawih).',
        source: 'HR. Bukhari no. 38 & 1901, Muslim no. 760',
    },
    {
        title: 'Doa orang yang berpuasa tidak tertolak',
        body: 'Rasulullah ﷺ menyebutkan ada tiga doa yang tidak tertolak, salah satunya adalah doa orang yang berpuasa hingga ia berbuka. Manfaatkan waktu mustajab menjelang berbuka untuk memanjatkan hajat dunia dan akhirat.',
        source: 'HR. Ahmad no. 8651, dishahihkan Albani',
    },
    {
        title: 'Puasa menjadi perisai dari api neraka',
        body: 'Puasa adalah benteng (junnah) yang melindungi seorang muslim dari maksiat di dunia dan dari api neraka di akhirat. Selama menahan lapar, dahaga, serta menjaga lisan dan amarah, pahala puasa mengalir tanpa terputus.',
        source: 'HR. Bukhari no. 1894, Muslim no. 1151',
    },
    {
        title: 'Sedekah di bulan Ramadan lebih utama',
        body: 'Nabi ﷺ adalah manusia paling dermawan, dan beliau semakin dermawan di bulan Ramadan, bagaikan angin yang berhembus membawa kebaikan. Sedekah, ifthar (memberi makan berbuka), dan zakat fitrah punya nilai istimewa di bulan ini.',
        source: 'HR. Bukhari no. 6, Muslim no. 2308',
    },
    {
        title: 'Syafaat puasa dan Al-Qur\'an di hari kiamat',
        body: 'Puasa dan Al-Qur\'an keduanya akan memberi syafaat bagi pemiliknya pada hari kiamat. Puasa berkata: "Ya Allah, aku menahannya dari makanan dan syahwat," sedangkan Al-Qur\'an berkata: "Aku menghalanginya tidur di malam hari." Keduanya layak mendapat syafaat.',
        source: 'HR. Ahmad no. 6600, dishahihkan Albani',
    },
    {
        title: 'Itikaf — mendekatkan diri kepada Allah',
        body: 'Itikaf di sepuluh terakhir Ramadan adalah sunnah muakkadah yang terus dijaga Rasulullah ﷺ sejak hijrah hingga wafatnya. Meninggalkan kesibukan dunia sejenak di masjid untuk fokus beribadah, berdoa, dan menghidupkan Lailatul Qadr.',
        source: 'HR. Bukhari no. 2025, Muslim no. 1172',
    },
    {
        title: 'Ramadan = madrasah ketakwaan',
        body: 'Puasa disyariatkan agar kita bertakwa — QS. Al-Baqarah: 183. Latihan sehari-hari selama sebulan penuh membentuk karakter sabar, jujur, empati terhadap fakir miskin, dan konsisten dalam ibadah. Bekal berharga untuk 11 bulan setelahnya.',
        source: 'QS. Al-Baqarah: 183–185 • Rumaysho.com',
    },
];
