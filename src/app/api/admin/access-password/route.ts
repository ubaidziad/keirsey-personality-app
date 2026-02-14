import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { createHash, timingSafeEqual } from 'crypto'

const PASSWORD_KEY = 'access_password'

function hashPassword(password: string): string {
  return `sha256:${createHash('sha256').update(password).digest('hex')}`
}

function verifyPassword(input: string, stored: string): boolean {
  // Backward compatibility: legacy plaintext values
  if (!stored.startsWith('sha256:')) {
    return stored === input
  }

  const expected = Buffer.from(stored)
  const actual = Buffer.from(hashPassword(input))
  if (expected.length !== actual.length) return false
  return timingSafeEqual(expected, actual)
}

export async function GET() {
  try {
    const supabase = createServerClient()
    
    const { data, error } = await supabase
      .from('admin_settings')
      .select('setting_value')
      .eq('setting_key', PASSWORD_KEY)
      .maybeSingle()

    if (error) {
      console.error('Error fetching access password:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ 
      hasPassword: !!data?.setting_value,
    })
  } catch (error) {
    console.error('Error in access password API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = createServerClient()
    const { password } = await request.json()

    if (!password || typeof password !== 'string') {
      return NextResponse.json({ valid: false })
    }

    const { data, error } = await supabase
      .from('admin_settings')
      .select('setting_value')
      .eq('setting_key', PASSWORD_KEY)
      .maybeSingle()

    if (error) {
      console.error('Error verifying access password:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const storedValue = (data?.setting_value as string | null) || null
    if (!storedValue) {
      return NextResponse.json({ valid: true })
    }

    return NextResponse.json({ valid: verifyPassword(password.trim(), storedValue) })
  } catch (error) {
    console.error('Error in access password verify API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createServerClient()
    const { password } = await request.json()

    const trimmedPassword = typeof password === 'string' ? password.trim() : ''
    const settingValue = trimmedPassword ? hashPassword(trimmedPassword) : null

    const { error } = await supabase
      .from('admin_settings')
      .upsert({
        setting_key: PASSWORD_KEY,
        setting_value: settingValue,
      }, { onConflict: 'setting_key' })

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
