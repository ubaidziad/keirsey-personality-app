# Changelog - Feature Enhancement Update

## Date: February 2026

### Summary
This update implements 11 major feature enhancements and fixes across the Keirsey Personality Assessment application.

---

### 1. Prominent Language Selection Screen
**Files:** `src/app/landing/page.tsx`

- Added a full-screen language selection screen as the **first step** before users proceed
- Users choose between English (🇬🇧) and Bahasa Melayu (🇲🇾) with clear, large buttons
- Language selection must happen before the main landing page content is shown
- Language toggle button on the main page returns to the selection screen

### 2. Auto Session Reset (Fix Cache/Retake Issue)
**Files:** `src/app/landing/page.tsx`

- `resetAssessment()` is now called automatically when users click "Get Started"
- This clears all previous session data from localStorage (participant, responses, scores, sessionId)
- Users can now retake the test without manually clearing browser cache
- No more stuck sessions or inability to retake assessments

### 3. Question Wording Review
**Files:** `src/lib/questions-part1.ts` through `questions-part4.ts`

- Reviewed all 100 questions across 4 files
- Questions already use simple, everyday language suitable for the general public
- Scenarios include: parties, shopping, phone calls, weekends, deadlines, etc.
- **No changes needed** - wording is already clear and accessible

### 4. Single Download Tab (Simplified Analysis View)
**Files:** `src/app/analysis/page.tsx`

- Removed the 4-tab navigation (Strengths, Weaknesses, Careers, Approach)
- Replaced with a **single scrollable view** showing all analysis sections at once
- Sections displayed: Strengths, Areas for Development, Career Suggestions, Communication Do's, Communication Don'ts
- Simpler UX - no tab switching needed, everything visible on one page
- Download button still uses `window.print()` for PDF export

### 5. Mandatory Organisation Name Field
**Files:** `src/app/register/page.tsx`, `src/app/results/page.tsx`, `src/lib/db.ts`, `supabase-schema.sql`

- Added mandatory "Organisation Name" field to the registration form
- Field is validated (required) before submission
- Organisation data is saved to the database via `saveFullAssessment()`
- Database already had the `organization` column - now actively used

### 6. Varied Personality Summary Text
**Files:** `src/lib/ai-service.ts`

- Updated AI system prompt with explicit instruction: "Every response must use unique phrasing and sentence structure"
- Increased temperature from 0.7 to **0.9** for more creative variation
- Added instructions in both English and Bahasa Melayu
- Ensures no two participants with the same personality type receive identical text

### 7. HR-Friendly Structured PDF Report
**Files:** `src/components/admin/AdminPDFExport.tsx`

- Restructured the admin PDF export into a **7-section formal report**:
  1. Introduction & Purpose of Assessment
  2. About Keirsey Temperament Theory (with explanation table)
  3. Overall Summary (total participants, completed assessments)
  4. Personality Type Distribution (bar chart)
  5. Department Breakdown (table)
  6. Individual Participant Analysis (table with Organisation, MBTI)
  7. Conclusion & Interpretation Notes for HR (recommendations + disclaimer)
- Added Organisation column to participant table
- Added MBTI code column
- Increased participant limit from 50 to 100

### 8. Email Restriction (1 Email = 1 Participant)
**Files:** `src/app/register/page.tsx`, `src/app/api/check-email/route.ts`

- Created `/api/check-email` endpoint that checks if an email already has a completed assessment
- Registration form now checks email before allowing submission
- If email exists, shows a warning message directing user to contact admin
- Prevents duplicate participant entries in the system

### 9. Admin Email Reset Capability
**Files:** `src/app/admin/page.tsx`, `src/app/api/admin/reset-email/route.ts`

- Created `/api/admin/reset-email` endpoint
- Added "Reset Participant Email" card in the admin Settings tab
- Admin enters participant email → confirms → system deletes:
  - Assessment results
  - Assessment sessions
  - Participant record
- Participant can then re-register with the same email
- Includes confirmation dialog and success/error toast notifications

### 10. Individual Report Opens in New Tab
**Files:** `src/app/admin/page.tsx`

- "View Details" (Eye icon) now opens a **formatted report in a new browser tab**
- Report layout is clean and printable with sections:
  - Header with name, email, organisation, department, date
  - Personality Profile with type name, MBTI code, hybrid status
  - Score Breakdown with visual bars
  - Key Strengths, Areas for Development, Career Suggestions
  - Communication Do's and Don'ts
- Uses `page-break-before: always` for clean multi-page printing
- Report is self-contained HTML - no external dependencies needed

### 11. Organisation-Based Filtering in Admin Panel
**Files:** `src/app/admin/page.tsx`, `src/app/api/admin/participants/route.ts`, `src/app/api/admin/stats/route.ts`, `supabase-schema.sql`, `supabase-migration.sql`

- Added "Organisation" filter dropdown in admin panel (alongside Type and Department filters)
- Stats API now returns unique organisations list
- Participants API accepts `organization` query parameter for filtering
- Admin table now shows Organisation column
- CSV export includes Organisation column
- Database view `recent_assessments` updated to include `organization` field
- Added database index on `participants.organization` for performance

---

### Database Migration
**File:** `supabase-migration.sql`

Run this SQL in your Supabase SQL Editor to update an existing database:
- Adds index on `participants.organization`
- Updates `recent_assessments` view to include `organization`
- Adds RLS delete policies for participants, assessment_results, assessment_sessions, and responses tables (required for admin email reset)

---

### Files Modified
| File | Changes |
|------|---------|
| `src/app/landing/page.tsx` | Language selection screen, auto-reset on Get Started |
| `src/app/register/page.tsx` | Organisation field, email check, submit validation |
| `src/app/results/page.tsx` | Pass organisation to saveFullAssessment |
| `src/app/analysis/page.tsx` | Single scrollable view, removed tabs |
| `src/app/admin/page.tsx` | Org filter, org column, individual report new tab, email reset |
| `src/app/api/admin/participants/route.ts` | Organisation filter support |
| `src/app/api/admin/stats/route.ts` | Returns organisations list |
| `src/components/admin/AdminPDFExport.tsx` | HR-friendly 7-section report |
| `src/lib/ai-service.ts` | Varied text prompt, temperature 0.9 |
| `supabase-schema.sql` | Organisation index, updated view |

### Files Created
| File | Purpose |
|------|---------|
| `src/app/api/check-email/route.ts` | Email uniqueness check endpoint |
| `src/app/api/admin/reset-email/route.ts` | Admin email reset endpoint |
| `supabase-migration.sql` | Database migration for existing installations |
| `CHANGELOG.md` | This documentation file |
