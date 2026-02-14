import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export async function GET() {
  try {
    const supabase = createServerClient()
    
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'access_password')
      .maybeSingle()

    if (error) {
      console.error('Error fetching access password:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ 
      hasPassword: !!data?.value,
      password: data?.value || null 
    })
  } catch (error) {
    console.error('Error in access password API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createServerClient()
    const { password } = await request.json()

    const { error } = await supabase
      .from('settings')
      .upsert({
        key: 'access_password',
        value: password || null,
        updated_at: new Date().toISOString()
      })

    if (error) {
      console.error('Error updating access password:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in access password API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
