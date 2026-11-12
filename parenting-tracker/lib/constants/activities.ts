export type ActivityCategory =
  | 'Afeksi'
  | 'Emosi'
  | 'Fisik'
  | 'Kognisi'
  | 'Bahasa'
  | 'Sosial'
  | 'Spiritual'
  | 'Estetika'
  | 'Life Skill'
  | 'Private Time';

export interface Activity {
  id: string;
  name: string;
  category: ActivityCategory;
  description?: string;
}

export const ACTIVITIES: Activity[] = [];

export const CATEGORIES: ActivityCategory[] = [
  'Afeksi',
  'Emosi',
  'Fisik',
  'Kognisi',
  'Bahasa',
  'Sosial',
  'Spiritual',
  'Estetika',
  'Life Skill',
  'Private Time',
];
