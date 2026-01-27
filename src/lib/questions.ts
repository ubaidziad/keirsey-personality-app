// Keirsey Assessment Questions - Combined Export
// This file combines all question parts into a single export

export type { Question } from './questions-base';
export { dimensions } from './questions-base';
import { Question } from './questions-base';
import { questionsPart1 } from './questions-part1';
import { questionsPart2 } from './questions-part2';
import { questionsPart3 } from './questions-part3';
import { questionsPart4 } from './questions-part4';

// Combine all questions into a single array
export const allQuestions: Question[] = [
  ...questionsPart1,
  ...questionsPart2,
  ...questionsPart3,
  ...questionsPart4
];

// Helper function to get questions by dimension
export function getQuestionsByDimension(dimension: 'EI' | 'SN' | 'TF' | 'JP'): Question[] {
  return allQuestions.filter(q => q.dimension === dimension);
}

// Helper function to shuffle questions for randomization
export function shuffleQuestions(questions: Question[]): Question[] {
  const shuffled = [...questions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Get question count per dimension (should be 25 each)
export function getQuestionCountByDimension(): Record<string, number> {
  return {
    EI: allQuestions.filter(q => q.dimension === 'EI').length,
    SN: allQuestions.filter(q => q.dimension === 'SN').length,
    TF: allQuestions.filter(q => q.dimension === 'TF').length,
    JP: allQuestions.filter(q => q.dimension === 'JP').length,
  };
}
