import type { ActivityCategory } from './activities';

/** Dalil: kutipan Arab (opsional), terjemah/penjelasan, dan sumber rujukan. */
export interface Dalil {
    arab?: string;
    arti: string;
    sumber: string;
}

/** Lafadz bacaan (zikir/doa/ayat) yang ditampilkan lengkap dengan Arabnya. */
export interface Lafadz {
    judul?: string;
    arab: string;
    arti?: string;
    sumber?: string;
    catatan?: string;
}

/** Info keutamaan & dalil sebuah kategori atau aktivitas. */
export interface ActivityInfo {
    /** Kalimat pembuka / ringkasan keutamaan */
    ringkasan?: string;
    /** Paragraf penjelas keutamaan */
    keutamaan?: string[];
    dalil?: Dalil[];
    lafadz?: Lafadz[];
    catatan?: string;
}

// ── Lafadz bersama (dipakai lebih dari satu aktivitas) ──────────────────────
const AYAT_KURSI =
    'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۝ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۝ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۝ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۝ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۝ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۝ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۝ وَلَا يَئُودُهُ حِفْظُهُمَا ۝ وَهُوَ الْعَلِيُّ الْعَظِيمُ';
const AL_IKHLAS =
    'قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ';
const AL_FALAQ =
    'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ مِن شَرَّ مَا خَلَقَ ۝ وَمِن شَرَّ غَاسِقٍ إِذَا وَقَبَ ۝ وَمِن شَرَّ النَّفَّاثَاتِ فِي الْعُقَدِ ۝ وَمِن شَرَّ حَاسِدٍ إِذَا حَسَدَ';
const AN_NAS =
    'قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۝ مَلِكِ النَّاسِ ۝ إِلَٰهِ النَّاسِ ۝ مِن شَرَّ الْوَسْوَاسِ الْخَنَّاسِ ۝ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۝ مِنَ الْجِنَّةِ وَالنَّاسِ';

// ── Info per kategori ────────────────────────────────────────────────────────
export const CATEGORY_INFO: Record<ActivityCategory, ActivityInfo> = {
    'Sholat Tepat Waktu': {
        ringkasan:
            'Sholat yang dijaga dan khusyuk jadi fondasi ketenangan dan keberkahan seluruh urusan hidup. Sholat wajib di awal waktu adalah amalan yang paling dicintai Allah.',
        dalil: [
            {
                arab: 'إِنَّ الصَّلَاةَ تَنْهَى عَنِ الْفَحْشَاءِ وَالْمُنْكَرِ',
                arti: '"Sesungguhnya sholat itu mencegah dari (perbuatan) keji dan mungkar."',
                sumber: 'QS. Al-Ankabut: 45',
            },
            {
                arab: 'أَوَّلُ مَا يُحَاسَبُ بِهِ الْعَبْدُ يَوْمَ الْقِيَامَةِ صَلَاتُهُ',
                arti: '"Amal yang pertama kali dihisab dari seorang hamba pada hari kiamat adalah sholatnya."',
                sumber: 'HR. At-Tirmidzi no. 413 (hasan)',
            },
            {
                arab: 'الصَّلَاةُ عَلَى وَقْتِهَا',
                arti: 'Nabi ﷺ ditanya: "Amal apa yang paling dicintai Allah?" Beliau menjawab: "Sholat pada waktunya."',
                sumber: 'HR. Bukhari no. 527, Muslim no. 85',
            },
        ],
    },
    'Sholat Sunnah': {
        ringkasan:
            'Sholat sunnah adalah bentuk kedekatan tambahan kepada Allah, pelengkap kekurangan sholat wajib kita.',
    },
    'Zikir Harian': {
        ringkasan:
            'Zikir adalah cara paling ringan untuk selalu ingat Allah di sela kesibukan. "Ingatlah, hanya dengan mengingat Allah hati menjadi tenang" (QS. Ar-Ra\'d: 28).',
        dalil: [
            {
                arab: 'وَاذْكُرُوا اللَّهَ ذِكْرًا كَثِيرًا ۝ وَسَبِّحُوهُ بُكْرَةً وَأَصِيلًا',
                arti: '"Dan ingatlah Allah dengan sebanyak-banyaknya, dan bertasbihlah kepada-Nya pagi dan petang."',
                sumber: 'QS. Al-Ahzab: 41-42',
            },
        ],
    },
    'Interaksi Al Quran': {
        ringkasan:
            'Al-Qur\'an adalah petunjuk dan penenang hati. "Barangsiapa membaca satu huruf dari Kitabullah, baginya satu kebaikan, dan satu kebaikan dibalas sepuluh kali lipat."',
        dalil: [
            {
                arti: 'Hadits qudsi tentang pahala membaca Al-Qur\'an — satu huruf dibalas sepuluh kebaikan.',
                sumber: 'HR. At-Tirmidzi',
            },
        ],
    },
    Sedekah: {
        ringkasan:
            'Sedekah membuka pintu rezeki dan menjadi pelindung dari musibah. Sedekah tidak melulu soal harta — ada empat jenis yang bisa dijalani sesuai kemampuan. Ketika kamu mendoakan orang lain, sesungguhnya kamu sedang mendoakan kehidupan kamu sendiri.',
        keutamaan: [
            'Ketika kamu melakukan hal-hal baik, secara otomatis saldo tabungan kebaikan kamu akan bertambah, begitu juga sebaliknya — sekecil apapun perbuatan buruk akan mengurangi saldo kebaikan di "rekening bank semesta" kamu.',
            'Permudah urusan orang lain, bantu dan tolonglah orang lain yang kamu lihat membutuhkan pertolongan meskipun mereka tidak minta bantuan kepadamu, rajin-rajinlah menyedekahkan diri kamu.',
        ],
    },
    'Ibadah Lainnya': {
        ringkasan:
            'Ibadah tidak hanya soal sholat dan zikir. Ada juga ibadah sosial dan ikhtiar gerak yang sama pentingnya untuk mendukung usaha suami dan keluarga.',
    },
    'Curhat Berulang': {
        ringkasan:
            'Curhat berulang adalah doa yang kita persiapkan dengan panduan script sedemikian rupa dan spesifik, yang selalu diulang dan dipanjatkan kepada Allah pada waktu-waktu mustajab.',
        keutamaan: [
            'Rasulullah ﷺ bersabda, "Doa adalah ibadah" (HR. Tirmidzi) — jadi mengulang doa bukan tanda putus asa, tapi tanda ibadah yang terus dijaga. Allah justru menyukai hamba yang terus memintanya berulang kali, karena setiap kali kita berdoa, di situ ada kedekatan yang sedang dirawat.',
        ],
        dalil: [
            {
                arti: '"Doa adalah ibadah."',
                sumber: 'HR. At-Tirmidzi',
            },
        ],
    },
};
// ── Info per aktivitas ───────────────────────────────────────────────────────
export const ACTIVITY_INFO: Record<string, ActivityInfo> = {
    // ── Sholat Tepat Waktu ──
    subuh: {
        ringkasan:
            'Sholat Subuh disaksikan oleh para malaikat, dan barangsiapa mengerjakannya berada dalam jaminan (perlindungan) Allah.',
        dalil: [
            {
                arab: 'وَقُرْآَنَ الْفَجْرِ ۝ إِنَّ قُرْآَانَ الْفَجْرِ كَانَ مَشْهُودًا',
                arti: '"…dan (dirikanlah pula sholat) Subuh. Sesungguhnya sholat Subuh itu disaksikan (oleh malaikat)."',
                sumber: 'QS. Al-Isra: 78',
            },
            {
                arab: 'مَنْ صَلَّى الصُّبْحَ فَهُوَ فِي ذِمَّةِ اللَّهِ',
                arti: '"Barangsiapa sholat Subuh, ia berada dalam jaminan (perlindungan) Allah."',
                sumber: 'HR. Muslim no. 657',
            },
        ],
    },
    zuhur: {
        ringkasan:
            'Sholat Zuhur dikerjakan di tengah hari, saat banyak orang sibuk dengan urusan dunia. Menjaganya adalah bentuk mengutamakan Allah di atas kesibukan.',
        dalil: [
            {
                arab: 'حَافِظُوا عَلَى الصَّلَوَاتِ وَالصَّلَاةِ الْوُسْطَى',
                arti: '"Peliharalah semua sholat(mu)…" — termasuk perintah umum menjaga seluruh sholat, di antaranya sholat Zuhur.',
                sumber: 'QS. Al-Baqarah: 238',
            },
        ],
    },
    ashar: {
        ringkasan:
            'Sholat Ashar disebut "sholat wustha" (sholat pertengahan) yang diperintahkan untuk dijaga secara khusus.',
        dalil: [
            {
                arab: 'حَافِظُوا عَلَى الصَّلَوَاتِ وَالصَّلَاةِ الْوُسْطَى',
                arti: '"Peliharalah semua sholat(mu), dan (peliharalah) sholat wustha."',
                sumber: 'QS. Al-Baqarah: 238',
            },
            {
                arab: 'مَنْ تَرَكَ صَلَاةَ الْعَصْرِ فَقَدْ حَبِطَ عَمَلُهُ',
                arti: '"Barangsiapa meninggalkan sholat Ashar, terhapus amalnya."',
                sumber: 'HR. Bukhari no. 553',
            },
        ],
    },
    magrib: {
        ringkasan:
            'Sholat Magrib menandai masuknya malam. Dianjurkan untuk segera dikerjakan begitu waktunya tiba, tidak ditunda-tunda.',
        catatan:
            'Termasuk dalam keutamaan umum menyegerakan sholat di awal waktu — "Sholat pada waktunya" adalah amal yang paling dicintai Allah (HR. Bukhari no. 527, Muslim no. 85).',
    },
    isya: {
        ringkasan:
            'Sholat Isya berjamaah memiliki pahala seolah sholat semalam penuh.',
        dalil: [
            {
                arab: 'مَنْ صَلَّى الْعِشَاءَ فِي جَمَاعَةٍ فَكَأَنَّمَا قَامَ نِصْفَ اللَّيْلِ، وَمَنْ صَلَّى الصُّبْحَ فِي جَمَاعَةٍ فَكَأَنَّمَا صَلَّى اللَّيْلَ كُلَّهُ',
                arti: '"Barangsiapa sholat Isya berjamaah, seakan ia sholat setengah malam. Dan barangsiapa sholat Subuh berjamaah, seakan ia sholat sepanjang malam."',
                sumber: 'HR. Muslim no. 656',
            },
        ],
    },
    // ── Sholat Sunnah ──
    tahajud: {
        ringkasan: 'Sholat malam yang paling utama setelah sholat wajib.',
        dalil: [
            {
                arab: 'وَمِنَ اللَّيْلِ فَتَهَجَّدْ بِهِ نَافِلَةً لَّكَ عَسَىٰ أَن يَبْعَثَكَ رَبُّكَ مَقَامًا مَّحْمُودًا',
                arti: '"Dan pada sebagian malam, lakukanlah sholat tahajud sebagai ibadah tambahan bagimu; mudah-mudahan Tuhanmu mengangkatmu ke tempat yang terpuji."',
                sumber: 'QS. Al-Isra: 79',
            },
        ],
        catatan:
            'Sepertiga malam terakhir juga disebut sebagai waktu mustajab untuk berdoa (lihat penjelasan di kategori Curhat Berulang).',
    },
    taubat: {
        ringkasan: 'Sholat 2 rakaat untuk memohon ampunan atas dosa yang telah lalu.',
        dalil: [
            {
                arab: 'مَا مِنْ عَبْدٍ يُذْنِبُ ذَنْبًا فَيُحْسِنُ الطَّهُورَ ثُمَّ يَقُومُ فَيُصَلِّي رَكْعَتَيْنِ ثُمَّ يَسْتَغْفِرُ اللَّهَ إِلَّا غَفَرَ اللَّهُ لَهُ',
                arti: '"Tidaklah seorang hamba berbuat dosa lalu ia bersuci (berwudhu) dengan baik kemudian sholat 2 rakaat lalu memohon ampun kepada Allah, kecuali Allah akan mengampuninya."',
                sumber: 'HR. Abu Dawud no. 1521, At-Tirmidzi no. 406',
            },
        ],
    },
    hajat: {
        ringkasan:
            'Sholat yang dikerjakan saat memiliki keinginan atau hajat tertentu, diiringi doa yang sungguh-sungguh.',
        dalil: [
            {
                arab: 'مَنْ كَانَتْ لَهُ إِلَى اللَّهِ حَاجَةٌ، أَوْ إِلَى أَحَدٍ مِنْ بَنِي آدَمَ، فَلْيَتَوَضَّأْ فَلْيُحْسِنِ الْوُضُوءَ، ثُمَّ لِيُصَلِّ رَكْعَتَيْنِ…',
                arti: '"Barangsiapa mempunyai hajat kepada Allah atau kepada salah seorang anak Adam, hendaklah ia berwudhu dan menyempurnakan wudhunya, kemudian sholat 2 rakaat…"',
                sumber: 'HR. At-Tirmidzi no. 479 (dinilai hasan)',
            },
        ],
    },
    witr: {
        ringkasan:
            'Penutup sholat malam, ganjil jumlah rakaatnya. Rasulullah ﷺ tidak pernah meninggalkannya baik saat bepergian maupun di rumah.',
        dalil: [
            {
                arab: 'الْوِتْرُ حَقٌّ فَمَنْ لَمْ يُوتِرْ فَلَيْسَ مِنَّا',
                arti: '"Witir itu benar adanya (haq), barangsiapa tidak mengerjakannya maka ia bukan golongan kami."',
                sumber: 'HR. Abu Dawud no. 1418',
            },
        ],
    },
    qob_subuh: {
        ringkasan:
            'Dua rakaat ringan sebelum sholat Subuh, namun keutamaannya sangat besar.',
        dalil: [
            {
                arab: 'رَكْعَتَا الْفَجْرِ خَيْرٌ مِنَ الدُّنْيَا وَمَا فِيهَا',
                arti: '"Dua rakaat sebelum Subuh itu lebih baik dari dunia dan seisinya."',
                sumber: 'HR. Muslim no. 725',
            },
        ],
    },
    dhuha: {
        ringkasan:
            'Sholat di pagi hari sebagai bentuk syukur atas nikmat tubuh yang sehat, sekaligus dianjurkan untuk membuka pintu rezeki.',
        dalil: [
            {
                arab: 'وَيُجْزِئُ مِنْ ذَلِكَ رَكْعَتَانِ يَرْكَعُهُمَا مِنَ الضُّحَى',
                arti: '"…dan itu semua bisa dicukupi dengan sholat dua rakaat Dhuha" — dari hadits panjang tentang setiap ruas tubuh manusia berkewajiban sedekah setiap harinya.',
                sumber: 'HR. Muslim no. 1181',
            },
        ],
    },
    // ── Zikir Harian ──
    zikir_pagi: {
        ringkasan:
            'Membuka hari dengan mengingat Allah: Ayat Kursi dan tiga surah penutup Al-Qur\'an sebagai zikir pagi yang melindungi.',
        dalil: [
            {
                arab: 'أَنَا عِنْدَ ظَنِّ عَبْدِي بِي وَأَنَا مَعَهُ إِذَا ذَكَرَنِي',
                arti: '"Aku bersama prasangka hamba-Ku terhadap-Ku, dan Aku bersamanya apabila ia mengingat-Ku."',
                sumber: 'HR. Bukhari no. 7405, Muslim no. 2675',
            },
        ],
        lafadz: [
            { judul: 'Ayat Kursi (QS. Al-Baqarah: 255)', arab: AYAT_KURSI },
            { judul: 'Al-Ikhlas', arab: AL_IKHLAS },
            { judul: 'Al-Falaq', arab: AL_FALAQ },
            { judul: 'An-Nas', arab: AN_NAS },
        ],
        catatan:
            'Rujukan zikir pagi/petang: HR. Abu Dawud no. 5082 dan At-Tirmidzi no. 3575 (dinilai hasan).',
    },
    zikir_bada_sholat: {
        ringkasan:
            'Setelah sholat wajib, dianjurkan segera berzikir — terutama membaca Ayat Kursi.',
        dalil: [
            {
                arab: 'مَنْ قَرَأَ آيَةَ الْكُرْسِيِّ دُبُرَ كُلِّ صَلَاةٍ مَكْتُوبَةٍ لَمْ يَمْنَعْهُ مِنْ دُخُولِ الْجَنَّةِ إِلَّا أَنْ يَمُوتَ',
                arti: '"Barangsiapa membaca Ayat Kursi setelah setiap sholat wajib, tidak ada yang menghalanginya masuk surga kecuali ia mati."',
                sumber: 'HR. An-Nasa\'i dalam \'Amalul Yaum wal-Lailah; sahih menurut Syaikh Al-Albani dalam Shahih At-Targhib no. 972',
            },
        ],
        lafadz: [
            {
                judul: 'Ayat Kursi (QS. Al-Baqarah: 255)',
                arab: AYAT_KURSI,
                catatan: 'Teks lengkapnya sama dengan yang ada di aktivitas Zikir Pagi.',
            },
        ],
    },
    sholawat: {
        ringkasan:
            'Salawat kepada Nabi Muhammad ﷺ adalah amalan ringan namun pahalanya besar, dan Allah langsung membalasnya.',
        dalil: [
            {
                arab: 'مَنْ صَلَّى عَلَيَّ وَاحِدَةً صَلَّى اللَّهُ عَلَيْهِ عَشْرًا',
                arti: '"Barangsiapa bersalawat atasku sekali, niscaya Allah bersalawat atasku sepuluh kali."',
                sumber: 'HR. Muslim no. 384',
            },
        ],
        lafadz: [
            {
                judul: 'Lafadz ringkas',
                arab: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ',
                catatan: 'Salawat yang utama tetap salawat lengkap (sholawat Jum\'at); lafadz ini adalah bentuk ringkasnya untuk dipakai sehari-hari.',
            },
        ],
    },
    la_haula: {
        ringkasan:
            'Ungkapan bahwa semua kekuatan hanya milik Allah — penenang hati saat merasa lemah dan tak berdaya.',
        dalil: [
            {
                arab: 'أَلَا أَدُلُّكَ عَلَى كَنْزٍ مِنْ كُنُوزِ الْجَنَّةِ؟',
                arti: '"Tidakkah aku tunjukkan kepadamu harta karun dari harta karun surga?" lalu beliau berkata: "Tidak ada kekuatan (daya upaya) melainkan hanya dengan pertolongan Allah."',
                sumber: 'HR. Bukhari no. 6384, Muslim no. 2704',
            },
        ],
        lafadz: [
            {
                arab: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
                arti: 'Artinya: "Tidak ada kekuatan melainkan hanya dari Allah."',
            },
        ],
    },
    hasbi_rabbi: {
        ringkasan:
            'Doa tawakal para sahabat saat dihadapkan ancaman yang sangat berat — mereka percaya Allah akan mempertolong.',
        dalil: [
            {
                arab: 'الَّذِينَ قَالَ لَهُمُ النَّاسُ إِنَّ النَّاسَ قَدْ جَمَعُوا لَكُمْ فَخْشَوْهُمْ فَزَادَهُمْ إِيمَانًا وَقَالُوا حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
                arti: '"Orang-orang yang dikatakan oleh mereka: "Sesungguhnya manusia telah mengumpulkan pasukan untuk menaklukkan kamu, karena itu takutlah kepada mereka." Tetapi (ancaman) itu hanya menambah keimanan mereka, dan mereka menjawab: "Cukuplah Allah menjadi penolong kami, dan Allah adalah sebaik-baik pelindung."',
                sumber: 'QS. Ali \'Imran: 173',
            },
        ],
        lafadz: [
            {
                arab: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
                arti: 'Artinya: "Cukuplah Allah menjadi penolong kami, dan Allah adalah sebaik-baik pelindung."',
            },
        ],
    },
    subhanallah: {
        ringkasan:
            'Zikir dua kalimat yang ringan di lisan, berat di timbangan, dan dicintai Allah.',
        dalil: [
            {
                arab: 'كَلِمَتَانِ خَفِيفَتَانِ عَلَى اللِّسَانِ، ثَقِيلَتَانِ فِي الْمِيزَانِ، حَبِيبَتَانِ إِلَى الرَّحْمَنِ: سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ',
                arti: '"Dua kalimat yang ringan di lisan, berat di timbangan, dan dicintai Allah Yang Maha Pengasih: Subhanallahi wa bihamdihi, Subhanallahil \'azhim."',
                sumber: 'HR. Bukhari no. 6406, Muslim no. 2694',
            },
        ],
        lafadz: [
            {
                arab: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
                arti: 'Artinya: "Maha Suci Allah dan segala puji bagi-Nya."',
            },
            {
                arab: 'سُبْحَانَ اللَّهِ الْعَظِيمِ',
                arti: 'Artinya: "Maha Suci Allah Yang Maha Agung."',
            },
        ],
    },
    astagfirullah: {
        ringkasan:
            'Istighfar membuka pintu rejeki, menghapus dosa, dan mengembalikan hati yang gelisah. Perintah istighfar dalam Al-Qur\'an disertai janji: "Barangsiapa bertakwa kepada Allah niscaya Dia akan mengadakan baginya jalan keluar."',
        dalil: [
            {
                arab: 'وَاللَّهِ إِنِّي لَأَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ فِي الْيَوْمِ أَكْثَرَ مِنْ سَبْعِينَ مَرَّةً',
                arti: '"Demi Allah, sungguh aku memohon ampun kepada Allah dan bertobat kepada-Nya lebih dari tujuh puluh kali sehari." (Ucapan Nabi ﷺ sebagaimana disebutkan Abu Hurairah.)',
                sumber: 'HR. Bukhari no. 6307',
            },
        ],
        lafadz: [
            {
                arab: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ',
                arti: 'Artinya: "Aku memohon ampun kepada Allah dan bertobat kepada-Nya."',
            },
        ],
    },
    yunus: {
        ringkasan:
            'Doa Nabi Yunus a.s. dari dalam perut ikan nun — doa yang tidak pernah ditolak saat diucapkan oleh seorang muslim.',
        dalil: [
            {
                arab: 'فَاسْتَجَبْنَا لَهُ وَنَجَّيْنَاهُ مِنَ الْغَمَّ ۝ وَكَذَٰلِكَ نُنجِي الْمُؤْمِنِينَ',
                arti: '"Kami perkenankan doanya, lalu Kami selamatkan dia dari kedukaan; dan demikianlah Kami selamatkan orang-orang yang beriman."',
                sumber: 'QS. Al-Anbiya: 87-88',
            },
        ],
        lafadz: [
            {
                arab: 'لَا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ',
                arti: 'Artinya: "Tidak ada Tuhan selain Engkau, Maha Suci Engkau, sesungguhnya aku termasuk orang-orang yang zalim." (Lafadz doa Nabi Yunus a.s. dalam perut ikan nun.)',
            },
        ],
    },
    zikir_petang: {
        ringkasan:
            'Zikir petang adalah pasangan zikir pagi — menutup hari dengan mengingat Allah.',
        lafadz: [
            { judul: 'Ayat Kursi (QS. Al-Baqarah: 255)', arab: AYAT_KURSI },
            { judul: 'Al-Ikhlas', arab: AL_IKHLAS },
            { judul: 'Al-Falaq', arab: AL_FALAQ },
            { judul: 'An-Nas', arab: AN_NAS },
        ],
        catatan:
            'Dibaca pada waktu sore/petang. Rujukan haditsnya sama — HR. Abu Dawud no. 5082 dan At-Tirmidzi no. 3575 (dinilai hasan) menyebut "pagi dan petang" dalam satu hadits.',
    },
    // ── Interaksi Al Quran ──
    tilawah: {
        ringkasan:
            'Al-Qur\'an adalah petunjuk dan penenang hati. Setiap huruf yang dibaca mendapat kebaikan, dan satu kebaikan dibalas sepuluh kali lipat.',
        dalil: [
            {
                arab: 'مَنْ قَرَأَ حَرْفًا مِنْ كِتَابِ اللَّهِ فَلَهُ بِهِ حَسَنَةٌ، وَالْحَسَنَةُ بِعَشْرِ أَمْثَالِهَا',
                arti: '"Barangsiapa membaca satu huruf dari Kitabullah, baginya satu kebaikan, dan satu kebaikan itu dibalas sepuluh kali lipat."',
                sumber: 'HR. At-Tirmidzi',
            },
            {
                arab: 'اقْرَءُوا الْقُرْآَانَ فَإِنَّهُ يَأْتِي يَوْمَ الْقِيَامَةِ شَفِيعًا لِأَصْحَابِهِ',
                arti: '"Bacalah Al-Qur\'an, karena ia akan datang pada hari kiamat sebagai pemberi syafa\'at bagi para pembacanya."',
                sumber: 'HR. Muslim no. 804',
            },
        ],
    },
    al_mulk: {
        ringkasan:
            'Surah Al-Mulk memiliki keutamaan besar — membacanya setiap malam dijaga dari siksa kubur, dan membacanya mendatangkan syafa\'at serta ampunan.',
        dalil: [
            {
                arab: 'إِنَّ سُورَةً مِنَ الْقُرْآَانِ ثَلَاثُونَ آيَةً شَفَعَتْ لِصَاحِبِهَا حَتَّى غُفِرَ لَهُ: تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ',
                arti: '"Sesungguhnya ada satu surah dari Al-Qur\'an berisi tiga puluh ayat yang memberi syafa\'at bagi pembacanya sehingga diampuni dosanya: Tabaraka ladzi bi yihil-mulk."',
                sumber: 'HR. At-Tirmidzi no. 2891, Abu Dawud no. 1400 (hasan)',
            },
        ],
        lafadz: [
            {
                judul: 'Frasa pembuka surah Al-Mulk',
                arab: 'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ',
                arti: 'Artinya: "Maha Suci Allah yang menguasai segala kerajaan."',
            },
        ],
        catatan:
            'Mengacu pada hadits yang menjelaskan keutamaan surah Al-Mulk — dibacakan setiap malam sehingga menjaga pembacanya dari siksa kubur.',
    },
    attalaq: {
        ringkasan:
            'Doa tawakal yang sempurna — "Cukuplah Allah menjadi penolong kami, dan Allah adalah sebaik-baik pelindung." Ayat-ayat ini menegaskan bahwa ketakwaan membuka jalan keluar.',
        lafadz: [
            {
                arab: 'فَإِذَا بَلَغْنَ أَجَلَهُنَّ فَأَمْسِكُوهُنَّ بِمَعْرُوفٍ أَوْ فَارِقُوهُنَّ بِمَعْرُوفٍ وَأَشْهِدُوا ذَوَيْ عَدْلٍ مِّنكُمْ وَأَقِيمُوا الشَّهَادَةَ لِلَّهِ ۝ ذَٰلِكُمْ يُوعَظُ بِهِ مَن كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ ۝ وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا ۝ وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ ۝ وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ ۝ إِنَّ اللَّهَ بَالِغُ أَمْرِهِ ۝ قَدْ جَعَلَ اللَّهُ لِكُلِّ شَيْءٍ قَدْرًا',
                arti: 'Artinya: "…Barangsiapa bertakwa kepada Allah niscaya Dia akan mengadakan baginya jalan keluar, dan memberi rezeki kepadanya dari arah yang tiada disangka-sangkanya. Dan barangsiapa yang bertawakal kepada Allah niscaya Allah mencukupkan (keperluan)nya. Sesungguhnya Allah melaksanakan urusan yang (dikehendaki)Nya. Sesungguhnya Allah telah mengadakan ketentuan bagi tiap-tiap sesuatu."',
                sumber: 'QS. At-Talaq: 2-3',
            },
        ],
        catatan:
            'Disarankan untuk dibaca dan ditadabburi setelah sholat Tahajud.',
    },
    alqashas: {
        ringkasan:
            'Al-Qashash menceritakan kisah para nabi — sumber pelajaran dan ketenangan. Di dalamnya ada doa Nabi Musa a.s. yang sarat tawakal.',
        lafadz: [
            {
                arab: 'وَلَمَّا وَرَدَ مَاء مَّدْيَنَ وَجَدَ عَلَيْهِ أُمَّةً مِّنَ النَّاسِ يَسْقُونَ وَوَجَدَ مِن دُونِهِمُ امْرَأَتَيْنِ تَذُودَانِ قَالَ مَا خَطْبُكُمَا قَالَتَا لَا نَسْقِي حَتَّىٰ يُصْرِعَ الرِّعَاءُ وَأَبُونَا شَيْخٌ كَبِيرٌ- فَأَسْلَمَ مُوسَىٰ لَهُمَا- فَكَانَ مِنَ الْمَظْلُومِينَ- فَأَتَىٰ عَلَيْهِ إِحْدَاهُمَا تَمْشِي عَلَىٰ حَيَاءٍ قَالَتْ إِنَّ أَبِي يَدْعُوكَ لِيَجْزِيَكَ أَجْرَ مَا سَقَيْتَ لَنَا',
                arti: 'Artinya: "Dan ketika ia (Musa) sampai ke mata air (penduduk) Madyan, ia mendapati sekumpulan orang sedang memberi minum (ternak) mereka, dan di sebelah mereka ia mendapati dua orang wanita sedang menghalau (ternak). (Musa) berkata: "Apakah yang menyebabkan kalian berdua?" Keduanya menjawab: "Kami tidak akan memberi minum (ternak) sebelum penggembala menarik (ternaknya) ke tempat, dan bapak kami sudah tua." Maka (Musa) menolong mereka…"',
                sumber: 'QS. Al-Qashas: 24-26',
            },
        ],
        catatan:
            'Doa Nabi Musa a.s. yang penuh tawakal. Disarankan untuk dibaca dan ditadabburi setelah sholat Tahajud.',
    },
    // ── Sedekah ──
    sedekah_uang: {
        ringkasan:
            'Sedekah harta dimulai dari nominal kecil yang penting rutin — yang terpenting dari hati. Rutin walau kecil, Allah akan melipatgandakan keberkahan rezeki.',
        dalil: [
            {
                arab: 'مَا نَقَصَتْ صَدَقَةٌ مِنْ مَالٍ',
                arti: '"Sedekah itu tidak mengurangi harta."',
                sumber: 'HR. Muslim no. 2588',
            },
        ],
    },
    sedekah_tenaga: {
        ringkasan:
            'Menolong dengan tenaga, tenang, dan ikhlas — membantu orang lain dengan cara yang ringan bagi kita dan berarti bagi mereka.',
        dalil: [
            {
                arab: 'كُلُّ سُلَامَى مِنَ النَّاسِ عَلَيْهِ صَدَقَةٌ، كُلُّ يَوْمٍ تَطْلُعُ فِيهِ الشَّمْسُ تَصَدَّقُ بِهَا، وَتُمِيطُ الْأَذَى عَنِ الطَّرِيقِ صَدَقَةٌ',
                arti: '"Setiap anggota tubuh manusia adalah sedekah setiap hari — dari waktu matahari terbit sampai terbenam, kamu bersedekah dengan setiap anggota. Dan menyingkirkan duri di jalan termasuk sedekah."',
                sumber: 'HR. Bukhari no. 2989, Muslim no. 1009',
            },
        ],
    },
    sedekah_ilmu: {
        ringkasan:
            'Menyebarkan ilmu adalah sedekah yang tidak akan putus pahalanya — manfaatnya terus mengalir bahkan setelah kita tiada.',
        dalil: [
            {
                arab: 'إِذَا مَاتَ ابْنُ آدَمَ انْقَطَعَ عَمَلُهُ إِلَّا مِنْ ثَلَاثٍ: صَدَقَةٍ جَارِيَةٍ، أَوْ عِلْمٍ يُنْتَفَعُ بِهِ، أَوْ وَلَدٍ صَالِحٍ يَدْعُو لَهُ',
                arti: '"Apabila seorang anak Adam mati, terputuslah amalnya kecuali tiga: sedekah jariyah, atau ilmu yang bermanfaat, atau anak saleh yang mendoakannya."',
                sumber: 'HR. Muslim no. 1631',
            },
        ],
    },
    sedekah_makanan: {
        ringkasan:
            'Memberi makan orang yang berhajat — termasuk amalan yang dicintai Allah, dan rezeki itu tidak akan berkurang.',
        dalil: [
            {
                arab: 'وَيُطْعِمُونَ الطَّعَامَ عَلَىٰ حُبَّهِ مِسْكِينًا وَيَتِيمًا وَأَسِيرًا',
                arti: '"…dan mereka memberi makanan disukainya (karena Allah) kepada orang miskin, anak yatim, dan orang yang tertawan."',
                sumber: 'QS. Al-Insan: 8',
            },
        ],
    },
    // ── Ibadah Lainnya ──
    bersih: {
        ringkasan:
            'Rumah yang bersih mencerminkan jiwa yang sehat — kebersihan adalah bagian dari iman.',
        dalil: [
            {
                arab: 'إِنَّ اللَّهَ يُحِبُّ التَّوَّابِينَ وَيُحِبُّ الْمُتَطَهِّرِينَ',
                arti: '"Sesungguhnya Allah menyukai orang-orang yang banyak bertaubat dan menyukai orang-orang yang menyucikan diri."',
                sumber: 'QS. Al-Baqarah: 222',
            },
        ],
        keutamaan: [
            'Rumah yang bersih adalah cerminan syukur atas nikmat — mengundang energi positif dan keberlimpahan.',
        ],
    },
    mendoakan: {
        ringkasan:
            'Mendoakan orang lain — keluarga, sahabat, tetangga, bahkan orang yang pernah menyakiti — adalah amalan ringan yang dampaknya luar biasa.',
        dalil: [
            {
                arab: 'دَعْوَةُ الْمَرْءِ الْمُسْلِمِ لِأَخِيهِ بِظَهْرِ الْغَيْبِ مُسْتَجَابَةٌ',
                arti: '"Doa seorang muslim untuk saudaranya di belakang punggungnya (dibelakangnya) akan dikabulkan."',
                sumber: 'HR. Muslim no. 2733',
            },
        ],
        catatan:
            'Kalau kamu bingung harus mendoakan apa untuk orang lain, doakan kebaikan, kesehatan, kesuksesan, dan keberlimpahan bagi mereka.',
    },
    memaafkan: {},
    gerak: {
        ringkasan:
            'Ikhtiar gerak adalah usaha nyata yang dilakukan di jalan Allah — berusaha bukan berarti melemahkan doa, justru keduanya beriringan.',
        dalil: [
            {
                arab: 'إِنَّ اللَّهَ لَا يُغَيِّرُ مَا بِقَوْمٍ حَتَّى يُغَيِّرُوا مَا بِأَنْفُسِهِمْ',
                arti: '"Sesungguhnya Allah tidak akan mengubah keadaan suatu kaum sehingga mereka mengubah keadaan yang ada pada diri mereka sendiri."',
                sumber: 'QS. Ar-Ra\'d: 11',
            },
        ],
        catatan:
            'Usaha ini dilakukan atas dasar prinsip — berusaha sungguh-sungguh di jalan Allah, lalu hasilnya diserahkan kepada Allah.',
    },

    // ── Curhat Berulang ──
    doa_setelah_sholat: {
        ringkasan:
            'Salah satu waktu mustajab untuk berdoa: segera setelah sholat wajib, hati lebih tenang dan lebih dekat kepada Allah.',
        dalil: [
            {
                arab: 'أَيُّ الدُّعَاءِ أَسْمَعُ؟ قَالَ: جَوْفَ اللَّيْلِ الْآخِرِ، وَدُبُرَ الصَّلَوَاتِ الْمَكْتُوبَاتِ',
                arti: '"Doa manakah yang paling didengar (oleh Allah)?" Beliau menjawab: "Sepertiga malam yang terakhir dan sesudah sholat-sholat wajib."',
                sumber: 'HR. At-Tirmidzi no. 3499 (hasan)',
            },
        ],
    },
    doa_sepertiga_malam: {
        ringkasan:
            'Sepertiga malam terakhir — waktu ketika Allah turun ke langit dunia dan menurunkan rahmat-Nya.',
        dalil: [
            {
                arab: 'يَنْزِلُ رَبُّنَا تَبَارَكَ وَتَعَالَى كُلَّ لَيْلَةٍ إِلَى السَّمَاءِ الدُّنْيَا حِينَ يَبْقَى ثُلُثُ اللَّيْلِ الْآخِرُ، يَقُولُ: مَنْ يَدْعُونِي فَأَسْتَجِيبَ لَهُ؟ مَنْ يَسْأَلُنِي فَأُعْطِيَهُ؟ مَنْ يَسْتَغْفِرُنِي فَأَغْفِرَ لَهُ؟',
                arti: '"Tuhan kami yang Maha Mulia dan Maha Tinggi turun setiap malam ke langit dunia ketika sepertiga malam yang terakhir tersisa, lalu berdoa: "Siapakah yang berdoa kepada-Ku, niscaya akan Aku kabulkan? Siapa yang memohon kepada-Ku, niscaya akan Aku beri? Siapa yang memohon ampun kepada-Ku, niscaya akan Aku ampuni?""',
                sumber: 'HR. Bukhari no. 1145, Muslim no. 758',
            },
        ],
    },
    doa_setelah_azan: {
        ringkasan:
            'Doa setelah azan — diantara azan dan iqamah doa tidak akan tertolak.',
        dalil: [
            {
                arab: 'الدُّعَاءُ لَا يُرَّدُّ بَيْنَ الْأَذَانِ وَالْإِقَامَةِ، فَادْعُوا',
                arti: '"Doa di antara azan dan iqamah tidak ditolak, maka berdoalah."',
                sumber: 'HR. Abu Dawud no. 521, At-Tirmidzi no. 212 (hasan sahih)',
            },
        ],
    },
    selftalk_berlimpah: {
        ringkasan:
            'Selftalk keberlimpahan sebelum tidur — mensyukuri apa yang telah diterima, merasa layak mendapat kebaikan, dan menumbuhkan prasangka baik kepada Allah.',
        keutamaan: [
            'Bermimpi dan berprasangka baiklah kepada Allah tentang kehidupanmu — Allah bersama prasangka hamba-Nya.',
        ],
        dalil: [
            {
                arab: 'أَنَا عِنْدَ ظَنِّ عَبْدِي بِي',
                arti: '"Aku bersama prasangka hamba-Ku terhadap-Ku." (Hadits qudsi)',
                sumber: 'HR. Bukhari no. 7405, Muslim no. 2675',
            },
        ],
        catatan:
            'Ya Allah, hari ini aku sudah melakukan kebaikan sesuai kewajibanku, berbuat baik untukmu, berbuat baik untuk keluargaku, untuk diriku, untuk saudaraku, untuk orang-orang yang aku cintai, untuk orang-orang yang ada di sekitarku. Berusaha maksimal semampuku, berupaya dan berikhtiar sungguh-sungguh untuk mewujudkan impian besarku, sebisa yang aku mampu. Berikhtiar sungguh-sungguh, berusaha dengan sebaik-baiknya, sekuat tenagaku.\n\nHari ini, malam ini aku serahkan semua hasilnya kepadamu ya Allah. Aku ikhlas ya Allah, apapun keputusanmu, aku terima apapun ketetapanmu, aku pasrah atas apapun ketentuan yang kau takdirkan padaku, ya Allah.\n\nTerimakasih ya Allah, atas semua kemudahan demi kemudahan yang aku terima hari ini, atas semua nikmat sehat yang aku rasakan hari ini, atas semua rezeki yang kau berikan padaku hari ini.\n\nYa Allah, aku bersyukur sekali, telah kau jadikan aku sebagai kepanjangan tanganmu, sebab engkau izinkan aku untuk menjadi pengusaha dengan banyak karyawan yang menggantungkan hidupnya kepadaku.\n\nAku yakin dan percaya, semua keajaiban hidup dan kehidupanku ini, semuanya adalah sebab engkau mengasihiku, sebab diriku layak dan pantas untuk mendapatkan keajaiban hidup ini, sebab diriku adalah diri yang penuh welas asih kepada sesama dan alam semesta ini, sebab diriku adalah diri yang penuh rasa syukur, sebab diriku adalah diri yang penuh terima kasih atas segala nikmat, kebaikan dan kemudahan yang engkau berikan padaku hari ini, ya Allah.\n\nYa Allah, sebab diriku adalah diri yang selalu mensyukuri apapun yang kau berikan padaku saat ini, aku yakin dan percaya, semua kebaikan, kebaikan, keberkahan, kesuksesan, kesehatan, keberlimpahan, kemudahan, yang belum pernah aku alami sebelumnya akan kau curahkan padaku ya Allah dengan semudah-mudahnya. Aku bersyukur ya Allah, telah kau berikan aku hari ini, dengan semudah-mudahnya, dengan mudah ya Allah.\n\nEntah kenapa, mulai sekarang dan seterusnya, aku semakin yakin dan percaya, bahwa aku layak dan pantas jadi pengusaha sukses, pengusaha besar, yang memberikan banyak manfaat bagi banyak orang, yang selalu berusaha membahagiakan orang lain dengan penuh keikhlasan.\n\nEntah kenapa, mulai sekarang dan seterusnya, aku semakin yakin dan percaya, bahwa semua urusanku, semuanya akan engkau mudahkan, semuanya akan engkau permudah, semua jalan menuju impian besarku ini terbuka lebar dan semakin mewujud nyata, dan itu dimulai sejak saat ini. Aku bersyukur sebab engkau telah mengizinkan aku untuk membahagiakan orang-orang yang ada di sekitarku, untuk membahagiakan keluargaku, untuk membahagiakan anak-anakku, untuk membahagiakan orang tuaku, untuk membahagiakan mertuaku, aku bersyukur sebab kau telah mengizinkan aku menjadi penolong hidup orang lain, menjadi jalan pembuka rezeki yang mempermudah kesulitan orang lain.',
    },
};