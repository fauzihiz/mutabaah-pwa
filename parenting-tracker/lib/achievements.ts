export interface Achievement {
    id: string;
    title: string;
    description: string;
    condition_type: 'min_streak' | 'total_count' | 'activity_count' | 'activity_streak';
    threshold: number;
    target_activity_id?: string;
    icon_name: string;
    color_theme: string;
}

/**
 * Local achievement definitions.
 * Previously stored in Supabase — now hard-coded.
 * To add or edit badges, modify this array and redeploy.
 */
export const ACHIEVEMENTS: Achievement[] = [
    {
        id: 'lail_al_awwal',
        title: 'Lail al-Awwal',
        description: '3 malam beruntun Tahajud',
        condition_type: 'activity_streak',
        threshold: 3,
        target_activity_id: 'tahajud',
        icon_name: 'moon',
        color_theme: 'purple',
    },
    {
        id: 'muqarrabun',
        title: 'Muqarrabun',
        description: '7 malam beruntun Tahajud',
        condition_type: 'activity_streak',
        threshold: 7,
        target_activity_id: 'tahajud',
        icon_name: 'flame',
        color_theme: 'orange',
    },
    {
        id: 'sahib_al_fajr',
        title: 'Sahib al-Fajr',
        description: '7 hari Subuh tepat waktu',
        condition_type: 'activity_streak',
        threshold: 7,
        target_activity_id: 'subuh',
        icon_name: 'sunrise',
        color_theme: 'yellow',
    },
    {
        id: 'ahlul_quran',
        title: 'Ahlul Quran',
        description: '30 hari beruntun Tilawah',
        condition_type: 'activity_streak',
        threshold: 30,
        target_activity_id: 'tilawah',
        icon_name: 'book-open',
        color_theme: 'green',
    },
    {
        id: 'al_karim',
        title: 'Al-Karim',
        description: '7 hari berturut Sedekah',
        condition_type: 'activity_streak',
        threshold: 7,
        target_activity_id: 'sedekah',
        icon_name: 'heart',
        color_theme: 'pink',
    },
    {
        id: 'al_mujtahid',
        title: 'Al-Mujtahid',
        description: '30 hari mutabaah beruntun',
        condition_type: 'min_streak',
        threshold: 30,
        icon_name: 'trophy',
        color_theme: 'blue',
    },
];
