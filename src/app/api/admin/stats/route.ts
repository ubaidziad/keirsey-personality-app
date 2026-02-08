import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export async function GET() {
  try {
    const supabase = createServerClient()

    // Get total participants
    const { count: totalParticipants } = await supabase
      .from('participants')
      .select('*', { count: 'exact', head: true })

    // Get completed assessments count
    const { count: completedAssessments } = await supabase
      .from('assessment_results')
      .select('*', { count: 'exact', head: true })

    // Get personality distribution
    const { data: distribution } = await supabase
      .from('personality_distribution')
      .select('*')

    // Get department breakdown
    const { data: departments } = await supabase
      .from('department_breakdown')
      .select('*')

    // Get unique organizations
    const { data: orgData } = await supabase
      .from('participants')
      .select('organization')
      .not('organization', 'is', null)
      .not('organization', 'eq', '')

    // Format distribution as record
    const distributionRecord: Record<string, number> = {
      guardian: 0,
      rational: 0,
      idealist: 0,
      artisan: 0
    }

    if (distribution) {
      distribution.forEach((item: { dominant_type: string; percentage: number }) => {
        distributionRecord[item.dominant_type] = item.percentage || 0
      })
    }

    // Deduplicate organizations
    const uniqueOrgs = [...new Set((orgData || []).map((o: { organization: string }) => o.organization).filter(Boolean))] as string[]

    return NextResponse.json({
      totalParticipants: totalParticipants || 0,
      completedAssessments: completedAssessments || 0,
      distribution: distributionRecord,
      departments: departments || [],
      organizations: uniqueOrgs.sort()
    })
  } catch (error) {
    console.error('Error in stats API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
