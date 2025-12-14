
export enum ModuleType {
  LANDING = 'landing',
  THEORY = 'theory',
  LAB_SURFACE = 'lab_surface',
  LAB_CONCENTRATION = 'lab_concentration',
  LAB_TEMP = 'lab_temp',
  LAB_CATALYST = 'lab_catalyst',
  LKPD = 'lkpd',
  QUIZ = 'quiz',
  ABOUT = 'about',
}

export interface NavItem {
  id: ModuleType;
  label: string;
  icon: string;
  color: string;
}

export interface Question {
  id: number;
  text: string;
  options: { label: string; value: string }[];
  correctAnswer: string;
  explanation: string;
}

export interface LabReport {
  variable: string;
  observation: string;
  analysis: string;
  conclusion: string;
}

export interface LKPDData {
  name: string;
  absentNo: string;
  className: string;
  hypothesis: string;      // Hipotesis awal tentang teori tumbukan
  aspectContext: string;   // Analisis SSI Konteks (Dampak lingkungan/sosial)
  aspectContent: string;   // Analisis SSI Konten (Teori Kimia)
  solution: string;        // Solusi dan Pengambilan Keputusan
  reflection: string;      // Refleksi diri
}
