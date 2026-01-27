# Deployment Checklist

Complete setup guide for deploying the Keirsey Personality Assessment application.

---

## 🚀 Prerequisites

- ✅ Supabase project created
- ✅ Node.js 18+ installed
- ✅ OpenAI API key (optional, for AI features)
- ✅ Git installed

---

## 📋 Step-by-Step Setup

### Step 1: Database Setup (REQUIRED)

1. **Run the main schema:**
   ```bash
   # In Supabase SQL Editor, run:
   supabase-schema.sql
   ```

2. **Update RLS policies:**
   ```bash
   # In Supabase SQL Editor, run:
   UPDATE-RLS-POLICIES.sql
   ```

3. **Add AI insights columns (REQUIRED for AI features):**
   ```bash
   # In Supabase SQL Editor, run:
   supabase-ai-insights-migration.sql
   ```

### Step 2: Storage Setup (REQUIRED for logo upload)

1. **Create storage bucket:**
   - Go to Supabase Dashboard → Storage
   - Create new bucket: `company-assets`
   - Set to **Public**

2. **Set RLS policies:**
   ```sql
   -- Public read access
   CREATE POLICY "Public read access for company assets"
   ON storage.objects FOR SELECT
   TO public
   USING (bucket_id = 'company-assets');

   -- Authenticated upload
   CREATE POLICY "Authenticated users can upload"
   ON storage.objects FOR INSERT
   TO authenticated
   WITH CHECK (bucket_id = 'company-assets');

   -- Authenticated delete
   CREATE POLICY "Authenticated users can delete"
   ON storage.objects FOR DELETE
   TO authenticated
   USING (bucket_id = 'company-assets');
   ```

### Step 3: Environment Variables

Create `.env.local` in project root:

```bash
# Supabase (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI (OPTIONAL - for AI features)
OPENAI_API_KEY=sk-your-openai-key-here
```

**⚠️ Never commit `.env.local` to Git!**

### Step 4: Install Dependencies

```bash
cd keirsey-assessment
npm install
```

### Step 5: Create Admin User

1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add user" → "Create new user"
3. Enter email and password
4. Save credentials for `/admin/login`

### Step 6: Run Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

### Step 7: Test All Features

**Basic Flow:**
- [ ] Home page loads
- [ ] Start assessment
- [ ] Complete all questions
- [ ] View results page
- [ ] View analysis page (with AI if key provided)
- [ ] Check data saved to database

**Admin Panel:**
- [ ] Login at `/admin/login`
- [ ] View participants list
- [ ] Click eye icon - view participant details
- [ ] Click trash icon - delete confirmation modal
- [ ] Upload company logo (requires storage bucket)
- [ ] Set data retention policy
- [ ] Click "Delete Old Data Now" button
- [ ] Export CSV
- [ ] View analytics charts
- [ ] View AI training recommendations

---

## 🐛 Troubleshooting

### Error: "Bucket not found" (Logo Upload)
**Solution:**
- Create `company-assets` bucket in Supabase Storage
- Set bucket to public
- Add RLS policies (see Step 2)

### Error: "duplicate key value violates unique constraint"
**Solution:**
- This is now fixed - using UPDATE instead of upsert
- If still occurs, run: `UPDATE-RLS-POLICIES.sql`

### Error: AI insights not saving
**Solution:**
- Run: `supabase-ai-insights-migration.sql`
- This adds required columns to `assessment_results` table

### Error: "Permission denied" on data insertion
**Solution:**
- Run: `UPDATE-RLS-POLICIES.sql`
- Ensures anonymous users can insert data

### Admin dashboard shows different strengths than analysis page
**Solution:**
- Fixed! AI insights now saved to database during assessment completion
- Re-complete assessment to see consistent data

### Deep Dive Analysis prints static data instead of AI
**Solution:**
- AI insights are now saved to database
- Printing feature should fetch from database (future enhancement)
- For now, data is consistent in admin panel

---

## 🎯 Feature Status

| Feature | Status | Setup Required |
|---------|--------|----------------|
| Assessment Flow | ✅ Working | Database schema |
| Results Display | ✅ Working | Database schema |
| AI Insights | ✅ Working | OpenAI API key + migration |
| Admin Login | ✅ Working | Create admin user |
| Participant Management | ✅ Working | Database schema |
| Details Modal | ✅ Working | None |
| Delete Confirmation | ✅ Working | None |
| Logo Upload | ✅ Working | Storage bucket |
| Data Retention Policy | ✅ Working | Migration SQL |
| Auto-refresh Dashboard | ✅ Working | None |
| Export CSV | ✅ Working | None |
| Analytics Charts | ✅ Working | Database schema |
| AI Training Recommendations | ✅ Working | OpenAI API key |

---

## 📦 Production Deployment

### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Project Settings → Environment Variables
```

### Option 2: Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod
```

### Option 3: Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🔒 Security Checklist

- [ ] `.env.local` added to `.gitignore`
- [ ] Service role key never exposed in frontend
- [ ] RLS policies enabled on all tables
- [ ] Admin routes protected by middleware
- [ ] Logo uploads validated (type and size)
- [ ] CORS properly configured
- [ ] HTTPS enabled in production
- [ ] OpenAI API key kept server-side only

---

## 📊 Database Schema Summary

### Tables Created:
1. `participants` - User information
2. `assessment_sessions` - Session tracking
3. `responses` - Individual answers
4. `assessment_results` - Calculated results + AI insights
5. `admin_settings` - Configuration (logo, retention)

### New Columns (AI Migration):
- `ai_strengths` - JSONB
- `ai_weaknesses` - JSONB
- `ai_career_suggestions` - JSONB
- `ai_approach_dos` - JSONB
- `ai_approach_donts` - JSONB
- `ai_insights_source` - VARCHAR ('ai' or 'fallback')

---

## 🎨 Features Summary

### For Participants:
- Bilingual assessment (English/Malay)
- 70 personality questions
- Instant results with MBTI + Keirsey
- AI-powered personalized insights
- Visual charts and icons
- Downloadable reports (future)

### For Admins:
- Secure login system
- Participant management
- Detailed participant info modal
- Safe delete with confirmation
- Company logo branding
- Data retention policy (PDPA compliant)
- Manual old data cleanup
- Auto-refresh every 30 seconds
- Export to CSV
- Analytics dashboard
- AI training recommendations
- Department breakdown

---

## 📖 Documentation Files

- `AI-ACHIEVEMENTS.md` - AI features summary for stakeholders
- `AI-SETUP-GUIDE.md` - Technical AI setup guide
- `SUPABASE-STORAGE-SETUP.md` - Storage bucket setup
- `ADMIN-PANEL-IMPROVEMENTS.md` - Admin features overview
- `DEPLOYMENT-CHECKLIST.md` - This file

---

## ⏱️ Estimated Setup Time

- Database setup: **10 minutes**
- Storage setup: **5 minutes**
- Environment variables: **5 minutes**
- Dependencies install: **2 minutes**
- Admin user creation: **2 minutes**
- Testing: **15 minutes**

**Total: ~40 minutes**

---

## 🆘 Support

If you encounter issues:

1. Check browser console for errors
2. Check Supabase logs for database errors
3. Verify all SQL migrations ran successfully
4. Ensure storage bucket exists and is public
5. Verify environment variables are set correctly
6. Check that admin user exists in Supabase Auth

---

## ✅ Final Verification

Run through this checklist before considering deployment complete:

**Database:**
- [ ] All tables created
- [ ] RLS policies applied
- [ ] AI insights columns added
- [ ] Sample data loads correctly

**Storage:**
- [ ] `company-assets` bucket exists
- [ ] Bucket is public
- [ ] RLS policies set
- [ ] Can upload test logo

**Authentication:**
- [ ] Admin user created
- [ ] Can login to `/admin/login`
- [ ] Middleware protects admin routes
- [ ] Logout works correctly

**Features:**
- [ ] Assessment completes successfully
- [ ] Results display correctly
- [ ] AI insights generate (if key provided)
- [ ] AI insights saved to database
- [ ] Admin dashboard loads
- [ ] All modals work
- [ ] Data retention saves and works
- [ ] Logo upload succeeds
- [ ] Export CSV downloads
- [ ] Auto-refresh working

**Performance:**
- [ ] Page loads in < 3 seconds
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Database queries optimized

---

**Status:** ✅ Ready for Production

**Last Updated:** January 2026

**Version:** 1.0.0
