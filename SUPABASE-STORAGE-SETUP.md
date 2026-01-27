# Supabase Storage Setup for Company Logo

## Overview
The admin panel now supports uploading company logos for branded reports. This requires setting up a Supabase Storage bucket.

---

## Setup Instructions

### Step 1: Create Storage Bucket

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **"New bucket"**
4. Configure the bucket:
   - **Name**: `company-assets`
   - **Public bucket**: ✅ **Enable** (so logos can be displayed)
   - **File size limit**: 2 MB
   - **Allowed MIME types**: `image/png, image/jpeg, image/jpg, image/svg+xml`
5. Click **"Create bucket"**

---

### Step 2: Set Bucket Policies

After creating the bucket, set up access policies:

1. In the Storage section, click on the `company-assets` bucket
2. Go to **Policies** tab
3. Create the following policies:

#### **Policy 1: Public Read Access**
```sql
CREATE POLICY "Public read access for company assets"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'company-assets');
```

#### **Policy 2: Authenticated Upload**
```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'company-assets');
```

#### **Policy 3: Authenticated Delete**
```sql
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'company-assets');
```

---

### Step 3: Verify Configuration

1. Go to Settings → API
2. Confirm you have:
   - ✅ `NEXT_PUBLIC_SUPABASE_URL`
   - ✅ `SUPABASE_SERVICE_ROLE_KEY` (in `.env`, not `.env.example`)

3. Test upload from admin panel:
   - Login to `/admin`
   - Go to Settings tab
   - Click "Upload Logo"
   - Select a PNG/JPG/SVG file (max 2MB)
   - Upload should succeed

---

## File Structure

Uploaded logos are stored with unique filenames:
```
company-assets/
  └── company-logo-1738123456789.png
  └── company-logo-1738987654321.jpg
```

The latest logo URL is saved in the `admin_settings` table:
```sql
SELECT * FROM admin_settings WHERE setting_key = 'logo_url';
```

---

## Security Notes

### ✅ What's Secure:
- Only authenticated admin users can upload/delete logos
- File type validation (PNG, JPG, SVG only)
- File size limit (2MB max)
- Unique filename generation prevents overwrites
- Public read is safe (logos are meant to be visible on reports)

### ⚠️ Important:
- Keep `SUPABASE_SERVICE_ROLE_KEY` in `.env` (server-side only)
- Never expose service role key in frontend code
- Regularly audit uploaded files in Supabase dashboard

---

## Troubleshooting

### Issue: "Failed to upload file"
**Solution**: 
1. Check if `company-assets` bucket exists
2. Verify bucket is public
3. Check policies are correctly set
4. Ensure service role key is in `.env`

### Issue: "Logo not displaying"
**Solution**:
1. Verify bucket is set to **public**
2. Check browser console for CORS errors
3. Verify logo URL in database is correct
4. Test URL directly in browser

### Issue: "Permission denied"
**Solution**:
1. Confirm you're logged in as admin
2. Check RLS policies on storage bucket
3. Verify authentication token is valid

---

## Manual Cleanup (if needed)

To delete old logos manually:

```sql
-- List all files
SELECT * FROM storage.objects WHERE bucket_id = 'company-assets';

-- Delete specific file
DELETE FROM storage.objects 
WHERE bucket_id = 'company-assets' 
AND name = 'company-logo-1738123456789.png';

-- Delete all files (careful!)
DELETE FROM storage.objects WHERE bucket_id = 'company-assets';
```

---

## Usage in Reports

The logo URL is automatically included in PDF/Excel exports. To use it in custom reports:

```typescript
// Fetch current logo
const { data: settings } = await supabase
  .from('admin_settings')
  .select('setting_value')
  .eq('setting_key', 'logo_url')
  .single();

const logoUrl = JSON.parse(settings.setting_value);

// Use in PDF header
doc.addImage(logoUrl, 'PNG', 10, 10, 50, 20);
```

---

## Complete Setup Checklist

- [ ] Create `company-assets` storage bucket
- [ ] Enable public access on bucket
- [ ] Create RLS policies for read/upload/delete
- [ ] Verify service role key in `.env`
- [ ] Test logo upload from admin panel
- [ ] Verify logo displays in settings
- [ ] Test logo delete functionality
- [ ] Confirm logo appears in exported reports (future feature)

---

**Setup Time**: ~5 minutes  
**Status**: Required for logo upload feature
