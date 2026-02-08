import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export async function POST(request: Request) {
  try {
    const supabase = createServerClient()
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Find participant by email
    const { data: participant, error: findError } = await supabase
      .from('participants')
      .select('id')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle()

    if (findError || !participant) {
      return NextResponse.json({ error: 'Participant not found' }, { status: 404 })
    }

    // Delete their assessment results (allows retaking)
    const { error: deleteResultsError } = await supabase
      .from('assessment_results')
      .delete()
      .eq('participant_id', participant.id)

    if (deleteResultsError) {
      console.error('Error deleting results:', deleteResultsError)
      return NextResponse.json({ error: 'Failed to reset' }, { status: 500 })
    }

    // Delete their sessions
    const { error: deleteSessionsError } = await supabase
      .from('assessment_sessions')
      .delete()
      .eq('participant_id', participant.id)

    if (deleteSessionsError) {
      console.error('Error deleting sessions:', deleteSessionsError)
    }

    // Delete the participant record so they can re-register
    const { error: deleteParticipantError } = await supabase
      .from('participants')
      .delete()
      .eq('id', participant.id)

    if (deleteParticipantError) {
      console.error('Error deleting participant:', deleteParticipantError)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in reset-email API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
