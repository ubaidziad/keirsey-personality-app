# AI Features Setup Guide

## Overview
The Keirsey Personality Assessment app now includes AI-powered insights using OpenAI's GPT-4o-mini model (lowest cost option for testing).

## Features Implemented

### 1. **AI-Enhanced Personality Insights** (Analysis Page)
- Personalized strengths, weaknesses, and career suggestions
- Context-aware approach strategies (Do's & Don'ts)
- Adapts to job title and department when provided
- Bilingual support (English/Bahasa Melayu)
- **Fallback**: If AI fails, uses rule-based templates automatically

### 2. **AI Training Recommendations** (Admin Panel)
- Analyzes team personality distribution
- Suggests training programs based on PRD logic:
  - **>35% Guardians**: Stress Management Workshop
  - **>20% Rationals**: Strategic Leadership & Logic Training
  - **>20% Idealists**: Communication & Emotional Intelligence
  - **>20% Artisans**: Agility & Innovation Workshop
- Bilingual recommendations

### 3. **Easy Model Switching**
- Abstraction layer allows switching from OpenAI to Gemini (or others)
- Change provider in one place: `src/lib/ai-service.ts`

---

## Setup Instructions

### Step 1: Add OpenAI API Key

1. Get your API key from: https://platform.openai.com/api-keys
2. Add to `.env` file:

```bash
OPENAI_API_KEY=sk-your-actual-api-key-here
```

### Step 2: Restart Development Server

```bash
# Stop the server (Ctrl+C)
npm run dev
```

### Step 3: Test AI Features

1. **Complete an Assessment**
   - Go to http://localhost:3000
   - Fill in participant details
   - Complete all 100 questions
   - View results, then click "Deep Dive Analysis"

2. **Check AI Badge**
   - Look for purple "AI-Enhanced Insights" badge
   - If you see it: AI is working ✓
   - If not: Check console for errors, verify API key

3. **Admin Panel Training Recommendations**
   - Complete multiple assessments with different results
   - Go to `/admin` → Analytics tab
   - Training recommendations appear when thresholds are met

---

## Cost Optimization

### Current Model: `gpt-4o-mini`
- **Cost**: ~$0.15 per 1M input tokens, ~$0.60 per 1M output tokens
- **Usage per assessment**: ~500-1000 tokens (~$0.0005-0.001 per user)
- **Monthly estimate (100 users)**: ~$0.05-0.10

### To Monitor Usage:
1. Visit: https://platform.openai.com/usage
2. Set budget limits in OpenAI dashboard
3. Enable email alerts for spending thresholds

---

## Switching to Gemini (Future)

### Step 1: Install Gemini SDK
```bash
npm install @google/generative-ai
```

### Step 2: Update AI Service
Edit `src/lib/ai-service.ts`:

```typescript
// Add Gemini provider class
class GeminiProvider implements AIProvider {
  private client: GoogleGenerativeAI;
  
  constructor(apiKey: string) {
    this.client = new GoogleGenerativeAI(apiKey);
  }
  
  async generatePersonalityInsights(params: InsightParams) {
    const model = this.client.getGenerativeModel({ model: 'gemini-1.5-flash' });
    // Implementation...
  }
}

// Update factory function
export function createAIProvider(provider: 'openai' | 'gemini' = 'openai') {
  if (provider === 'gemini') {
    const apiKey = process.env.GEMINI_API_KEY;
    return new GeminiProvider(apiKey);
  }
  // ... existing code
}
```

### Step 3: Update Environment Variables
```bash
# .env
GEMINI_API_KEY=your-gemini-api-key
```

### Step 4: Switch Provider
In `src/app/api/ai/insights/route.ts`, change:
```typescript
const aiProvider = createAIProvider('gemini'); // Changed from 'openai'
```

---

## API Endpoints

### POST `/api/ai/insights`
Generates personalized personality insights.

**Request Body:**
```json
{
  "dominantType": "guardian",
  "secondaryType": "rational",
  "scores": {
    "guardian": 45,
    "rational": 30,
    "idealist": 15,
    "artisan": 10
  },
  "isHybrid": false,
  "language": "en",
  "jobTitle": "Project Manager",
  "department": "IT"
}
```

**Response:**
```json
{
  "strengths": ["...", "...", "..."],
  "weaknesses": ["...", "...", "..."],
  "careerSuggestions": ["...", "...", "..."],
  "approachDos": ["...", "...", "..."],
  "approachDonts": ["...", "...", "..."],
  "source": "ai" // or "fallback"
}
```

---

## Security & Privacy (PRD Compliance)

### ✅ What AI Receives:
- Temperament scores (percentages)
- Dominant/secondary types
- Job title (optional)
- Department (optional)
- Language preference

### ❌ What AI Never Receives:
- Full name
- Email address
- Phone number
- Any personally identifiable information (PII)

### Data Handling:
- AI prompts contain NO raw personal identifiers
- Responses are not stored by OpenAI (when using API)
- All data encrypted in transit (HTTPS)

---

## Fallback System

If AI fails (timeout, API error, offline), the system automatically:
1. Catches the error
2. Switches to rule-based templates
3. Returns static personality data from `src/lib/personality-data.ts`
4. Sets `source: 'fallback'` in response

**Users never see errors** - they always get insights!

---

## Troubleshooting

### Issue: "AI API key not configured" Error
**Solution**: Add `OPENAI_API_KEY` to `.env` file and restart server

### Issue: No AI badge appears
**Solution**: 
1. Check browser console for errors
2. Verify API key is correct
3. Check OpenAI account has credits
4. System will use fallback data automatically

### Issue: Slow response times
**Solution**:
1. Normal: 2-5 seconds for AI generation
2. If >10 seconds: Check internet connection
3. Consider caching results in database (future enhancement)

### Issue: Training recommendations not showing
**Solution**:
- Need enough participants to meet thresholds
- Example: Need 36+ participants with >35% being Guardians
- Complete more assessments to trigger recommendations

---

## Production Deployment

### Before Going Live:

1. **Set Production API Key**
   - Use separate API key for production
   - Set spending limits in OpenAI dashboard

2. **Enable Rate Limiting**
   - Add rate limiting to `/api/ai/*` routes
   - Prevent abuse and control costs

3. **Monitor Usage**
   - Set up usage alerts
   - Review monthly spending
   - Adjust model if needed

4. **Consider Caching**
   - Cache AI responses in database
   - Reduce API calls for same personality profiles
   - Update cache when AI model improves

---

## Future Enhancements

### Potential Features:
1. **Team Dynamics Analysis**: AI analyzes entire team composition
2. **Personalized Development Plans**: Multi-month growth roadmaps
3. **Manager Coaching Tips**: Specific advice for managing each type
4. **Question Generation**: AI generates adaptive questions
5. **Conflict Resolution**: Tips for resolving team conflicts

---

## Support

For issues or questions:
1. Check console logs in browser DevTools
2. Review API response in Network tab
3. Verify `.env` configuration
4. Test fallback system is working

**Remember**: The app works without AI - it just uses static data instead!
