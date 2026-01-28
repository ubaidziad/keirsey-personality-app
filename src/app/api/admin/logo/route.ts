import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { file, filename, contentType } = await request.json();

    if (!file || !filename) {
      return NextResponse.json(
        { error: 'Missing file or filename' },
        { status: 400 }
      );
    }

    // Extract base64 data (remove data:image/xxx;base64, prefix)
    const base64Data = file.split(',')[1];
    const buffer = Buffer.from(base64Data, 'base64');

    // Generate unique filename
    const timestamp = Date.now();
    const ext = filename.split('.').pop();
    const uniqueFilename = `company-logo-${timestamp}.${ext}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('company-assets')
      .upload(uniqueFilename, buffer, {
        contentType,
        upsert: true,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload file' },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('company-assets')
      .getPublicUrl(uniqueFilename);

    const logoUrl = urlData.publicUrl;

    // Update admin_settings table
    const { error: dbError } = await supabase
      .from('admin_settings')
      .update({
        setting_value: JSON.stringify(logoUrl),
      })
      .eq('setting_key', 'logo_url');

    if (dbError) {
      console.error('Database update error:', dbError);
      return NextResponse.json(
        { error: 'Failed to save logo URL' },
        { status: 500 }
      );
    }

    return NextResponse.json({ logoUrl });
  } catch (error) {
    console.error('Logo upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Get current logo URL from database
    const { data: settings, error: fetchError } = await supabase
      .from('admin_settings')
      .select('setting_value')
      .eq('setting_key', 'logo_url')
      .single();

    if (fetchError || !settings) {
      return NextResponse.json(
        { error: 'Logo not found' },
        { status: 404 }
      );
    }

    const logoUrl = JSON.parse(settings.setting_value);
    
    if (logoUrl) {
      // Extract filename from URL
      const filename = logoUrl.split('/').pop();
      
      // Delete from storage
      await supabase.storage
        .from('company-assets')
        .remove([filename]);
    }

    // Update database to remove logo URL
    const { error: dbError } = await supabase
      .from('admin_settings')
      .update({
        setting_value: '""',
      })
      .eq('setting_key', 'logo_url');

    if (dbError) {
      console.error('Database update error:', dbError);
      return NextResponse.json(
        { error: 'Failed to remove logo' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logo delete error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
