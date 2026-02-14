import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

type FieldType = 'organization' | 'department'

export async function PATCH(request: Request) {
  try {
    const supabase = createServerClient()
    const body = await request.json()

    const field = body.field as FieldType
    const fromValue = typeof body.fromValue === 'string' ? body.fromValue : ''
    const toValue = typeof body.toValue === 'string' ? body.toValue.trim() : ''
    const fromValueTrimmed = fromValue.trim()

    if (!field || !['organization', 'department'].includes(field)) {
      return NextResponse.json({ error: 'Invalid field' }, { status: 400 })
    }

    if (!fromValueTrimmed) {
      return NextResponse.json({ error: 'Source value is required' }, { status: 400 })
    }

    if (!toValue) {
      return NextResponse.json({ error: 'Target value is required' }, { status: 400 })
    }

    if (fromValueTrimmed === toValue) {
      return NextResponse.json({ error: 'Source and target cannot be the same' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('participants')
      .update({ [field]: toValue })
      .eq(field, fromValue)
      .select('id')

    if (error) {
      console.error('Error normalizing metadata:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, updatedCount: data?.length || 0 })
  } catch (error) {
    console.error('Error in metadata normalize API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
