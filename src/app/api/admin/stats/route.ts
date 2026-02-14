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

    const hasFilters = search || type !== 'all' || department !== 'all' || organization !== 'all'

    // Always fetch unique organizations (unfiltered) for the filter dropdown
    const { data: orgData } = await supabase
      .from('participants')
      .select('organization')
      .not('organization', 'is', null)
      .not('organization', 'eq', '')
    const uniqueOrgs = [...new Set((orgData || []).map((o: { organization: string }) => o.organization).filter(Boolean))] as string[]

    // Always fetch unique departments (unfiltered) for the filter dropdown
    const { data: deptData } = await supabase
      .from('participants')
      .select('department')
      .not('department', 'is', null)
      .not('department', 'eq', '')
    const uniqueDepartments = [...new Set((deptData || []).map((d: { department: string }) => d.department).filter(Boolean))] as string[]

    if (hasFilters) {
      // Compute stats dynamically from filtered recent_assessments data
      let query = supabase.from('recent_assessments').select('*')

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

      const { data: filtered, error } = await query

      if (error) {
        console.error('Error fetching filtered stats:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      const rows = filtered || []
      const total = rows.length

      // Compute personality distribution from filtered data
      const typeCounts: Record<string, number> = { guardian: 0, rational: 0, idealist: 0, artisan: 0 }
      rows.forEach((r: { dominant_type: string }) => {
        if (typeCounts[r.dominant_type] !== undefined) {
          typeCounts[r.dominant_type]++
        }
      })
      const distributionRecord: Record<string, number> = { guardian: 0, rational: 0, idealist: 0, artisan: 0 }
      if (total > 0) {
        for (const t of Object.keys(typeCounts)) {
          distributionRecord[t] = parseFloat(((typeCounts[t] / total) * 100).toFixed(2))
        }
      }

      // Compute department breakdown from filtered data
      const deptMap: Record<string, { participant_count: number; completed_assessments: number }> = {}
      rows.forEach((r: { department: string | null }) => {
        const dept = r.department || 'Not Specified'
        if (!deptMap[dept]) {
          deptMap[dept] = { participant_count: 0, completed_assessments: 0 }
        }
        deptMap[dept].participant_count++
        deptMap[dept].completed_assessments++
      })
      const departments = Object.entries(deptMap).map(([department, counts]) => ({
        department,
        ...counts
      }))

      return NextResponse.json({
        totalParticipants: total,
        completedAssessments: total,
        distribution: distributionRecord,
        departments,
        organizations: uniqueOrgs.sort(),
        allDepartments: uniqueDepartments.sort()
      })
    }

    // No filters — use existing optimised views
    const { count: totalParticipants } = await supabase
      .from('participants')
      .select('*', { count: 'exact', head: true })

    const { count: completedAssessments } = await supabase
      .from('assessment_results')
      .select('*', { count: 'exact', head: true })

    const { data: distribution } = await supabase
      .from('personality_distribution')
      .select('*')

    const { data: departments } = await supabase
      .from('department_breakdown')
      .select('*')

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

    return NextResponse.json({
      totalParticipants: totalParticipants || 0,
      completedAssessments: completedAssessments || 0,
      distribution: distributionRecord,
      departments: departments || [],
      organizations: uniqueOrgs.sort(),
      allDepartments: uniqueDepartments.sort()
    })
  } catch (error) {
    console.error('Error in stats API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
