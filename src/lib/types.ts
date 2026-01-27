export type Language = 'en' | 'ms'

export type PersonalityType = 'guardian' | 'rational' | 'idealist' | 'artisan'

export interface Participant {
  id: string
  full_name: string
  phone?: string
  email: string
  job_title?: string
  department?: string
  organization?: string
  language: Language
  consent_given: boolean
  created_at: string
  updated_at: string
}

export interface Question {
  id: string
  order_number: number
  question_en: string
  question_ms: string
  option_a_en: string
  option_a_ms: string
  option_b_en: string
  option_b_ms: string
  option_a_type: PersonalityType
  option_b_type: PersonalityType
  is_active: boolean
  created_at: string
}

export interface Response {
  id: string
  participant_id: string
  question_id: string
  selected_option: 'a' | 'b'
  created_at: string
}

export interface AssessmentResult {
  id: string
  participant_id: string
  guardian_score: number
  rational_score: number
  idealist_score: number
  artisan_score: number
  guardian_percentage: number
  rational_percentage: number
  idealist_percentage: number
  artisan_percentage: number
  dominant_type: PersonalityType
  secondary_type: PersonalityType
  is_hybrid: boolean
  completed_at: string
}

export interface AssessmentSession {
  id: string
  participant_id: string
  question_order: string[]
  current_question_index: number
  started_at: string
  completed_at?: string
}

export interface AdminSettings {
  id: string
  company_logo_url?: string
  data_retention_months: number
  updated_at: string
}

export interface PersonalityTypeInfo {
  name: {
    en: string
    ms: string
  }
  strengths: {
    en: string[]
    ms: string[]
  }
  weaknesses: {
    en: string[]
    ms: string[]
  }
  careers: {
    en: string[]
    ms: string[]
  }
  dos: {
    en: string[]
    ms: string[]
  }
  donts: {
    en: string[]
    ms: string[]
  }
}
