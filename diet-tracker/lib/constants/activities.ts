export type ActivityCategory =
  | 'Pola Makan'
  | 'Gizi Seimbang'
  | 'Olahraga';

export interface Activity {
  id: string;
  name: string;
  category: ActivityCategory;
  description?: string;
}

export const ACTIVITIES: Activity[] = [
  // Pola Makan
  { id: 'sarapan', name: 'Sarapan jam 7:00-8:30', category: 'Pola Makan' },
  { id: 'makan_siang', name: 'Makan Siang jam 12:30-13:30', category: 'Pola Makan' },
  { id: 'makan_malam', name: 'Makan Malam jam 17:30-18:30', category: 'Pola Makan' },

  // Gizi Seimbang
  { id: 'protein_nabati', name: 'Protein Nabati', category: 'Gizi Seimbang' },
  { id: 'protein_hewani', name: 'Protein Hewani', category: 'Gizi Seimbang' },
  { id: 'karbohidrat', name: 'Karbohidrat', category: 'Gizi Seimbang' },
  { id: 'sayuran', name: 'Sayuran', category: 'Gizi Seimbang' },
  { id: 'air_mineral', name: 'Air Mineral 2ltr', category: 'Gizi Seimbang' },
  { id: 'stop_tepung_gula', name: 'Stop Tepung & Gula', category: 'Gizi Seimbang' },

  // Olahraga
  { id: 'olahraga_30_menit', name: 'Olahraga 30 Menit', category: 'Olahraga' },
];

export const CATEGORIES: ActivityCategory[] = [
  'Pola Makan',
  'Gizi Seimbang',
  'Olahraga',
];
