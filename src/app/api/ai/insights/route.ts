import { NextRequest, NextResponse } from 'next/server';
import { createAIProvider, getFallbackInsights } from '@/lib/ai-service';
import { PersonalityType, Language } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      dominantType, 
      secondaryType, 
      scores, 
      isHybrid, 
      language, 
      jobTitle, 
      department 
    } = body;

    // Validate required fields
    if (!dominantType || !secondaryType || !scores || typeof isHybrid !== 'boolean' || !language) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let insights;
    let source = 'ai';

    try {
      // Try AI generation first
      const aiProvider = createAIProvider('openai');
      insights = await aiProvider.generatePersonalityInsights({
        dominantType: dominantType as PersonalityType,
        secondaryType: secondaryType as PersonalityType,
        scores,
        isHybrid,
        language: language as Language,
        jobTitle,
        department,
      });
    } catch (aiError) {
      // Fallback to rule-based template if AI fails
      console.error('AI generation failed, using fallback:', aiError);
      insights = getFallbackInsights(dominantType as PersonalityType, language as Language);
      source = 'fallback';
    }

    return NextResponse.json({
      ...insights,
      source, // Let frontend know if AI or fallback was used
    });

  } catch (error) {
    console.error('Error in AI insights API:', error);
    return NextResponse.json(
      { error: 'Failed to generate insights' },
      { status: 500 }
    );
  }
}
