import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export async function PATCH(request: Request) {
  try {
    const supabase = createServerClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const body = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'Missing participant ID' }, { status: 400 })
    }

    const { organization, department } = body

    // Update the participant record
    const { data: result, error: lookupError } = await supabase
      .from('assessment_results')
      .select('participant_id')
      .eq('id', id)
      .single()

    if (lookupError || !result) {
      console.error('Error finding participant:', lookupError)
      return NextResponse.json({ error: 'Assessment result not found' }, { status: 404 })
    }

    const updateData: { organization?: string; department?: string } = {}
    if (organization !== undefined) updateData.organization = organization
    if (department !== undefined) updateData.department = department

    const { error: updateError } = await supabase
      .from('participants')
      .update(updateData)
      .eq('id', result.participant_id)

    if (updateError) {
      console.error('Error updating participant:', updateError)
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in update API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
