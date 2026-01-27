// Keirsey Assessment Questions - Type Definitions and Base Data

export interface Question {
  id: number;
  dimension: 'EI' | 'SN' | 'TF' | 'JP';
  text_en: string;
  text_ms: string;
  option_a_en: string;
  option_a_ms: string;
  option_b_en: string;
  option_b_ms: string;
  scoring: {
    a: string;
    b: string;
  };
}

// Dimension descriptions for reference
export const dimensions = {
  EI: {
    name_en: 'Extraversion vs Introversion',
    name_ms: 'Ekstraversi vs Introversi',
    description_en: 'How you direct and receive energy',
    description_ms: 'Bagaimana anda mengarah dan menerima tenaga',
    poles: { E: 'Extraversion', I: 'Introversion' }
  },
  SN: {
    name_en: 'Sensing vs Intuition',
    name_ms: 'Deria vs Intuisi',
    description_en: 'How you take in information',
    description_ms: 'Bagaimana anda menerima maklumat',
    poles: { S: 'Sensing', N: 'Intuition' }
  },
  TF: {
    name_en: 'Thinking vs Feeling',
    name_ms: 'Pemikiran vs Perasaan',
    description_en: 'How you make decisions',
    description_ms: 'Bagaimana anda membuat keputusan',
    poles: { T: 'Thinking', F: 'Feeling' }
  },
  JP: {
    name_en: 'Judging vs Perceiving',
    name_ms: 'Pertimbangan vs Persepsi',
    description_en: 'How you approach the outside world',
    description_ms: 'Bagaimana anda mendekati dunia luar',
    poles: { J: 'Judging', P: 'Perceiving' }
  }
};
