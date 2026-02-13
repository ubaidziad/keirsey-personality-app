import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export async function GET(request: Request) {
  try {
    const supabase = createServerClient()
    const { searchParams } = new URL(request.url)
    
    const search = searchParams.get('search') || ''
    const type = searchParams.get('type') || 'all'
    const department = searchParams.get('department') || 'all'
    const organization = searchParams.get('organization') || 'all'
    const exportAll = searchParams.get('export') === 'true'
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('recent_assessments')
      .select('*', { count: 'exact' })

    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`)
    }

    if (type !== 'all') {
      query = query.eq('dominant_type', type)
    }

    if (department !== 'all') {
      query = query.eq('department', department)
    }

    if (organization !== 'all') {
      query = query.eq('organization', organization)
    }

    query = query.order('created_at', { ascending: false })

    // When export=true, return all matching records without pagination
    if (!exportAll) {
      query = query.range(offset, offset + limit - 1)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching participants:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ 
      data: data || [], 
      total: count || 0 
    })
  } catch (error) {
    console.error('Error in participants API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = createServerClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing participant ID' }, { status: 400 })
    }

    // The id from the admin panel is the assessment_results.id (from recent_assessments view)
    // First, find the participant_id from this result
    const { data: result, error: lookupError } = await supabase
      .from('assessment_results')
      .select('participant_id')
      .eq('id', id)
      .single()

    if (lookupError || !result) {
      console.error('Error finding participant:', lookupError)
      return NextResponse.json({ error: 'Assessment result not found' }, { status: 404 })
    }

    // Delete the participant row — cascades to assessment_sessions, responses, and assessment_results
    const { error } = await supabase
      .from('participants')
      .delete()
      .eq('id', result.participant_id)

    if (error) {
      console.error('Error deleting participant:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in delete API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
