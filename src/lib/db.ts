import { createClient } from './supabase'
import { PersonalityType } from './types'

const supabase = createClient()

// ============================================
// PARTICIPANT FUNCTIONS
// ============================================

export interface ParticipantInput {
  full_name: string
  email: string
  phone?: string
  job_title?: string
  department?: string
  organization?: string
}

export interface Participant extends ParticipantInput {
  id: string
  created_at: string
  updated_at: string
}

export async function createParticipant(data: ParticipantInput): Promise<Participant | null> {
  const { data: participant, error } = await supabase
    .from('participants')
    .insert(data)
    .select()
    .single()

  if (error) {
    console.error('Error creating participant:', error)
    return null
  }
  return participant
}

export async function getParticipantByEmail(email: string): Promise<Participant | null> {
  const { data, error } = await supabase
    .from('participants')
    .select('*')
    .eq('email', email)
    .maybeSingle()

  if (error) {
    console.error('Error fetching participant:', error)
    return null
  }
  return data
}

// ============================================
// ASSESSMENT SESSION FUNCTIONS
// ============================================

export interface SessionInput {
  participant_id: string
  language: 'en' | 'ms'
  question_order: number[]
}

export interface Session extends SessionInput {
  id: string
  started_at: string
  completed_at: string | null
  status: 'in_progress' | 'completed' | 'abandoned'
  created_at: string
}

export async function createSession(data: SessionInput): Promise<Session | null> {
  const { data: session, error } = await supabase
    .from('assessment_sessions')
    .insert({
      participant_id: data.participant_id,
      language: data.language,
      question_order: data.question_order,
      status: 'in_progress'
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating session:', error)
    return null
  }
  return session
}

export async function updateSessionStatus(
  sessionId: string, 
  status: 'in_progress' | 'completed' | 'abandoned'
): Promise<boolean> {
  const updateData: Record<string, unknown> = { status }
  if (status === 'completed') {
    updateData.completed_at = new Date().toISOString()
  }

  const { error } = await supabase
    .from('assessment_sessions')
    .update(updateData)
    .eq('id', sessionId)

  if (error) {
    console.error('Error updating session:', error)
    return false
  }
  return true
}

// ============================================
// RESPONSE FUNCTIONS
// ============================================

export interface ResponseInput {
  session_id: string
  question_id: number
  answer: 'a' | 'b'
}

export async function saveResponse(data: ResponseInput): Promise<boolean> {
  const { error } = await supabase
    .from('responses')
    .upsert(data, { onConflict: 'session_id,question_id' })

  if (error) {
    console.error('Error saving response:', error)
    return false
  }
  return true
}

export async function saveAllResponses(
  sessionId: string, 
  responses: Record<string, 'a' | 'b'>
): Promise<boolean> {
  const responseData = Object.entries(responses).map(([questionId, answer]) => ({
    session_id: sessionId,
    question_id: parseInt(questionId),
    answer
  }))

  const { error } = await supabase
    .from('responses')
    .upsert(responseData, { onConflict: 'session_id,question_id' })

  if (error) {
    console.error('Error saving responses:', error)
    return false
  }
  return true
}

// ============================================
// ASSESSMENT RESULTS FUNCTIONS
// ============================================

export interface ResultInput {
  session_id: string
  participant_id: string
  e_score: number
  i_score: number
  s_score: number
  n_score: number
  t_score: number
  f_score: number
  j_score: number
  p_score: number
  mbti_code: string
  guardian_score: number
  rational_score: number
  idealist_score: number
  artisan_score: number
  dominant_type: PersonalityType
  secondary_type: PersonalityType
  is_hybrid: boolean
  ai_strengths?: string
  ai_weaknesses?: string
  ai_career_suggestions?: string
  ai_approach_dos?: string
  ai_approach_donts?: string
  ai_insights_source?: string
}

export interface AssessmentResult extends ResultInput {
  id: string
  created_at: string
}

export async function saveResult(data: ResultInput): Promise<AssessmentResult | null> {
  const { data: result, error } = await supabase
    .from('assessment_results')
    .insert(data)
    .select()
    .single()

  if (error) {
    console.error('Error saving result:', error)
    return null
  }
  return result
}

// ============================================
// COMBINED SAVE FUNCTION (for assessment completion)
// ============================================

export interface FullAssessmentData {
  participant: ParticipantInput
  language: 'en' | 'ms'
  questionOrder: number[]
  responses: Record<string, 'a' | 'b'>
  scores: {
    dimensions: {
      E: number
      I: number
      S: number
      N: number
      T: number
      F: number
      J: number
      P: number
    }
    mbtiCode: string
    temperaments: Record<PersonalityType, number>
    dominantType: PersonalityType
    secondaryType: PersonalityType
    isHybrid: boolean
  }
  aiInsights?: {
    strengths: string[]
    weaknesses: string[]
    careerSuggestions: string[]
    approachDos: string[]
    approachDonts: string[]
    source?: 'ai' | 'fallback'
  }
}

export async function saveFullAssessment(data: FullAssessmentData): Promise<{
  success: boolean
  participantId?: string
  sessionId?: string
  resultId?: string
  error?: string
}> {
  try {
    // 1. Create or get participant
    let participant = await getParticipantByEmail(data.participant.email)
    if (!participant) {
      participant = await createParticipant(data.participant)
    }
    if (!participant) {
      return { success: false, error: 'Failed to create participant' }
    }

    // 2. Create session
    const session = await createSession({
      participant_id: participant.id,
      language: data.language,
      question_order: data.questionOrder
    })
    if (!session) {
      return { success: false, error: 'Failed to create session', participantId: participant.id }
    }

    // 3. Save responses
    const responsesSuccess = await saveAllResponses(session.id, data.responses)
    if (!responsesSuccess) {
      return { 
        success: false, 
        error: 'Failed to save responses', 
        participantId: participant.id,
        sessionId: session.id 
      }
    }

    // 4. Save result
    const result = await saveResult({
      session_id: session.id,
      participant_id: participant.id,
      e_score: data.scores.dimensions.E,
      i_score: data.scores.dimensions.I,
      s_score: data.scores.dimensions.S,
      n_score: data.scores.dimensions.N,
      t_score: data.scores.dimensions.T,
      f_score: data.scores.dimensions.F,
      j_score: data.scores.dimensions.J,
      p_score: data.scores.dimensions.P,
      mbti_code: data.scores.mbtiCode,
      guardian_score: data.scores.temperaments.guardian,
      rational_score: data.scores.temperaments.rational,
      idealist_score: data.scores.temperaments.idealist,
      artisan_score: data.scores.temperaments.artisan,
      dominant_type: data.scores.dominantType,
      secondary_type: data.scores.secondaryType,
      is_hybrid: data.scores.isHybrid,
      ai_strengths: data.aiInsights?.strengths ? JSON.stringify(data.aiInsights.strengths) : undefined,
      ai_weaknesses: data.aiInsights?.weaknesses ? JSON.stringify(data.aiInsights.weaknesses) : undefined,
      ai_career_suggestions: data.aiInsights?.careerSuggestions ? JSON.stringify(data.aiInsights.careerSuggestions) : undefined,
      ai_approach_dos: data.aiInsights?.approachDos ? JSON.stringify(data.aiInsights.approachDos) : undefined,
      ai_approach_donts: data.aiInsights?.approachDonts ? JSON.stringify(data.aiInsights.approachDonts) : undefined,
      ai_insights_source: data.aiInsights?.source || undefined,
    })
    if (!result) {
      return { 
        success: false, 
        error: 'Failed to save result', 
        participantId: participant.id,
        sessionId: session.id 
      }
    }

    // 5. Update session status to completed
    await updateSessionStatus(session.id, 'completed')

    return {
      success: true,
      participantId: participant.id,
      sessionId: session.id,
      resultId: result.id
    }
  } catch (error) {
    console.error('Error in saveFullAssessment:', error)
    return { success: false, error: 'Unexpected error occurred' }
  }
}
