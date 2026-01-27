import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export async function GET() {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from('admin_settings')
      .select('setting_key, setting_value')

    if (error) {
      console.error('Error fetching settings:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Convert to object
    const settings: Record<string, unknown> = {}
    if (data) {
      data.forEach((item: { setting_key: string; setting_value: unknown }) => {
        settings[item.setting_key] = item.setting_value
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error in settings GET API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createServerClient()
    const body = await request.json()

    const { key, value } = body

    if (!key) {
      return NextResponse.json({ error: 'Missing setting key' }, { status: 400 })
    }

    const { error } = await supabase
      .from('admin_settings')
      .upsert({
        setting_key: key,
        setting_value: value
      }, { onConflict: 'setting_key' })

    if (error) {
      console.error('Error updating setting:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in settings POST API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
