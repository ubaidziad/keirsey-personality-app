import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { retentionMonths } = await request.json();

    if (!retentionMonths || retentionMonths < 1) {
      return NextResponse.json(
        { error: 'Invalid retention period' },
        { status: 400 }
      );
    }

    // Update retention setting using UPDATE instead of upsert
    const { error: updateError } = await supabase
      .from('admin_settings')
      .update({
        setting_value: retentionMonths.toString(),
        updated_at: new Date().toISOString(),
      })
      .eq('setting_key', 'data_retention_months');

    if (updateError) {
      console.error('Failed to update retention setting:', updateError);
      return NextResponse.json(
        { error: 'Failed to update retention policy' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      retentionMonths 
    });
  } catch (error) {
    console.error('Retention policy update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Get retention period
    const { data: settings, error: fetchError } = await supabase
      .from('admin_settings')
      .select('setting_value')
      .eq('setting_key', 'data_retention_months')
      .single();

    if (fetchError) {
      return NextResponse.json(
        { error: 'Failed to fetch retention settings' },
        { status: 500 }
      );
    }

    const retentionMonths = parseInt(settings.setting_value) || 12;
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - retentionMonths);

    // Find participants older than retention period
    const { data: oldParticipants, error: findError } = await supabase
      .from('participants')
      .select('id')
      .lt('created_at', cutoffDate.toISOString());

    if (findError) {
      console.error('Failed to find old participants:', findError);
      return NextResponse.json(
        { error: 'Failed to find old data' },
        { status: 500 }
      );
    }

    if (!oldParticipants || oldParticipants.length === 0) {
      return NextResponse.json({ 
        success: true,
        deletedCount: 0,
        message: 'No data older than retention period found'
      });
    }

    const participantIds = oldParticipants.map(p => p.id);

    // Delete related data (cascade should handle this, but explicit is safer)
    await Promise.all([
      supabase.from('responses').delete().in('participant_id', participantIds),
      supabase.from('assessment_results').delete().in('participant_id', participantIds),
      supabase.from('assessment_sessions').delete().in('participant_id', participantIds),
    ]);

    // Delete participants
    const { error: deleteError } = await supabase
      .from('participants')
      .delete()
      .in('id', participantIds);

    if (deleteError) {
      console.error('Failed to delete old participants:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete old data' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      deletedCount: participantIds.length,
      message: `Deleted ${participantIds.length} participants and their data`
    });
  } catch (error) {
    console.error('Retention cleanup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
