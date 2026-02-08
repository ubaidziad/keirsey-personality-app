import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export async function GET(request: Request) {
  try {
    const supabase = createServerClient()
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json({ exists: false })
    }

    // Check if this email already has a completed assessment
    const { data, error } = await supabase
      .from('participants')
      .select('id')
      .eq('email', email.toLowerCase().trim())
      .limit(1)

    if (error) {
      console.error('Error checking email:', error)
      return NextResponse.json({ exists: false })
    }

    if (data && data.length > 0) {
      // Check if they have a completed assessment result
      const { data: results } = await supabase
        .from('assessment_results')
        .select('id')
        .eq('participant_id', data[0].id)
        .limit(1)

      return NextResponse.json({ exists: results && results.length > 0 })
    }

    return NextResponse.json({ exists: false })
  } catch (error) {
    console.error('Error in check-email API:', error)
    return NextResponse.json({ exists: false })
  }
}
