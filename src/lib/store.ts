import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Language, Participant, Question, AssessmentResult, PersonalityType } from './types'

interface AssessmentStore {
  language: Language
  setLanguage: (lang: Language) => void
  
  participant: Participant | null
  setParticipant: (participant: Participant | null) => void
  
  questions: Question[]
  setQuestions: (questions: Question[]) => void
  
  questionOrder: string[]
  setQuestionOrder: (order: string[]) => void
  
  currentQuestionIndex: number
  setCurrentQuestionIndex: (index: number) => void
  
  responses: Record<string, 'a' | 'b'>
  setResponse: (questionId: string, option: 'a' | 'b') => void
  clearResponses: () => void
  
  result: AssessmentResult | null
  setResult: (result: AssessmentResult | null) => void
  
  sessionId: string | null
  setSessionId: (id: string | null) => void
  
  isAdmin: boolean
  setIsAdmin: (isAdmin: boolean) => void
  
  resetAssessment: () => void
}

export const useAssessmentStore = create<AssessmentStore>()(
  persist(
    (set) => ({
      language: 'en',
      setLanguage: (lang) => set({ language: lang }),
      
      participant: null,
      setParticipant: (participant) => set({ participant }),
      
      questions: [],
      setQuestions: (questions) => set({ questions }),
      
      questionOrder: [],
      setQuestionOrder: (order) => set({ questionOrder: order }),
      
      currentQuestionIndex: 0,
      setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),
      
      responses: {},
      setResponse: (questionId, option) =>
        set((state) => ({
          responses: { ...state.responses, [questionId]: option },
        })),
      clearResponses: () => set({ responses: {} }),
      
      result: null,
      setResult: (result) => set({ result }),
      
      sessionId: null,
      setSessionId: (id) => set({ sessionId: id }),
      
      isAdmin: false,
      setIsAdmin: (isAdmin) => set({ isAdmin }),
      
      resetAssessment: () =>
        set({
          participant: null,
          questions: [],
          questionOrder: [],
          currentQuestionIndex: 0,
          responses: {},
          result: null,
          sessionId: null,
        }),
    }),
    {
      name: 'keirsey-assessment-storage',
      partialize: (state) => ({
        language: state.language,
        participant: state.participant,
        questionOrder: state.questionOrder,
        currentQuestionIndex: state.currentQuestionIndex,
        responses: state.responses,
        sessionId: state.sessionId,
      }),
    }
  )
)

export function calculateResults(
  responses: Record<string, 'a' | 'b'>,
  questions: Question[]
): Omit<AssessmentResult, 'id' | 'participant_id' | 'completed_at'> {
  const scores: Record<PersonalityType, number> = {
    guardian: 0,
    rational: 0,
    idealist: 0,
    artisan: 0,
  }

  questions.forEach((question) => {
    const response = responses[question.id]
    if (response) {
      const selectedType = response === 'a' ? question.option_a_type : question.option_b_type
      scores[selectedType]++
    }
  })

  const totalResponses = Object.values(responses).length
  const percentages: Record<PersonalityType, number> = {
    guardian: Math.round((scores.guardian / totalResponses) * 100),
    rational: Math.round((scores.rational / totalResponses) * 100),
    idealist: Math.round((scores.idealist / totalResponses) * 100),
    artisan: Math.round((scores.artisan / totalResponses) * 100),
  }

  const sortedTypes = (Object.keys(percentages) as PersonalityType[]).sort(
    (a, b) => percentages[b] - percentages[a]
  )

  const dominantType = sortedTypes[0]
  const secondaryType = sortedTypes[1]
  const gap = percentages[dominantType] - percentages[secondaryType]
  const isHybrid = gap <= 5

  return {
    guardian_score: scores.guardian,
    rational_score: scores.rational,
    idealist_score: scores.idealist,
    artisan_score: scores.artisan,
    guardian_percentage: percentages.guardian,
    rational_percentage: percentages.rational,
    idealist_percentage: percentages.idealist,
    artisan_percentage: percentages.artisan,
    dominant_type: dominantType,
    secondary_type: secondaryType,
    is_hybrid: isHybrid,
  }
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}
