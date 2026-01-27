// Keirsey Temperament Scoring Logic
// Maps MBTI dimension scores to Keirsey temperaments

import { PersonalityType } from './types';
import { Question } from './questions-base';

export interface DimensionScores {
  E: number;
  I: number;
  S: number;
  N: number;
  T: number;
  F: number;
  J: number;
  P: number;
}

export interface TemperamentScores {
  guardian: number;
  rational: number;
  idealist: number;
  artisan: number;
}

export interface AssessmentScores {
  dimensions: DimensionScores;
  temperaments: TemperamentScores;
  dominantType: PersonalityType;
  secondaryType: PersonalityType;
  isHybrid: boolean;
  mbtiCode: string;
}

// Calculate dimension scores from responses
export function calculateDimensionScores(
  responses: Record<number, 'a' | 'b'>,
  questions: Question[]
): DimensionScores {
  const scores: DimensionScores = {
    E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0
  };

  questions.forEach((question) => {
    const response = responses[question.id];
    if (response) {
      const selectedScore = question.scoring[response];
      scores[selectedScore as keyof DimensionScores]++;
    }
  });

  return scores;
}

// Get MBTI code from dimension scores
export function getMBTICode(dimensions: DimensionScores): string {
  const e_or_i = dimensions.E >= dimensions.I ? 'E' : 'I';
  const s_or_n = dimensions.S >= dimensions.N ? 'S' : 'N';
  const t_or_f = dimensions.T >= dimensions.F ? 'T' : 'F';
  const j_or_p = dimensions.J >= dimensions.P ? 'J' : 'P';
  
  return `${e_or_i}${s_or_n}${t_or_f}${j_or_p}`;
}

// Calculate temperament scores from dimension scores
// Keirsey Temperaments:
// - Guardian (SJ): Sensing + Judging preference
// - Rational (NT): iNtuition + Thinking preference
// - Idealist (NF): iNtuition + Feeling preference
// - Artisan (SP): Sensing + Perceiving preference
export function calculateTemperamentScores(dimensions: DimensionScores): TemperamentScores {
  // Calculate weighted temperament scores based on relevant dimension preferences
  const totalSN = dimensions.S + dimensions.N;
  const totalTF = dimensions.T + dimensions.F;
  const totalJP = dimensions.J + dimensions.P;

  // Normalize to percentages (0-100)
  const sPercent = totalSN > 0 ? (dimensions.S / totalSN) * 100 : 50;
  const nPercent = totalSN > 0 ? (dimensions.N / totalSN) * 100 : 50;
  const tPercent = totalTF > 0 ? (dimensions.T / totalTF) * 100 : 50;
  const fPercent = totalTF > 0 ? (dimensions.F / totalTF) * 100 : 50;
  const jPercent = totalJP > 0 ? (dimensions.J / totalJP) * 100 : 50;
  const pPercent = totalJP > 0 ? (dimensions.P / totalJP) * 100 : 50;

  // Calculate temperament scores (weighted combinations)
  // Guardian (SJ): High S and high J
  const guardian = Math.round((sPercent + jPercent) / 2);
  
  // Rational (NT): High N and high T
  const rational = Math.round((nPercent + tPercent) / 2);
  
  // Idealist (NF): High N and high F
  const idealist = Math.round((nPercent + fPercent) / 2);
  
  // Artisan (SP): High S and high P
  const artisan = Math.round((sPercent + pPercent) / 2);

  return { guardian, rational, idealist, artisan };
}

// Determine dominant and secondary types
export function determineTypes(temperaments: TemperamentScores): {
  dominantType: PersonalityType;
  secondaryType: PersonalityType;
  isHybrid: boolean;
} {
  const sorted = (Object.entries(temperaments) as [PersonalityType, number][])
    .sort((a, b) => b[1] - a[1]);

  const dominantType = sorted[0][0];
  const secondaryType = sorted[1][0];
  const gap = sorted[0][1] - sorted[1][1];
  const isHybrid = gap <= 10; // Within 10% is considered hybrid

  return { dominantType, secondaryType, isHybrid };
}

// Full scoring calculation
export function calculateFullScores(
  responses: Record<number, 'a' | 'b'>,
  questions: Question[]
): AssessmentScores {
  const dimensions = calculateDimensionScores(responses, questions);
  const temperaments = calculateTemperamentScores(dimensions);
  const { dominantType, secondaryType, isHybrid } = determineTypes(temperaments);
  const mbtiCode = getMBTICode(dimensions);

  return {
    dimensions,
    temperaments,
    dominantType,
    secondaryType,
    isHybrid,
    mbtiCode
  };
}

// Get percentage for each dimension preference
export function getDimensionPercentages(dimensions: DimensionScores): Record<string, number> {
  const totalEI = dimensions.E + dimensions.I;
  const totalSN = dimensions.S + dimensions.N;
  const totalTF = dimensions.T + dimensions.F;
  const totalJP = dimensions.J + dimensions.P;

  return {
    E: totalEI > 0 ? Math.round((dimensions.E / totalEI) * 100) : 50,
    I: totalEI > 0 ? Math.round((dimensions.I / totalEI) * 100) : 50,
    S: totalSN > 0 ? Math.round((dimensions.S / totalSN) * 100) : 50,
    N: totalSN > 0 ? Math.round((dimensions.N / totalSN) * 100) : 50,
    T: totalTF > 0 ? Math.round((dimensions.T / totalTF) * 100) : 50,
    F: totalTF > 0 ? Math.round((dimensions.F / totalTF) * 100) : 50,
    J: totalJP > 0 ? Math.round((dimensions.J / totalJP) * 100) : 50,
    P: totalJP > 0 ? Math.round((dimensions.P / totalJP) * 100) : 50,
  };
}
