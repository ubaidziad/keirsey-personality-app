'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Download, BarChart3, User, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAssessmentStore } from '@/lib/store';
import { t } from '@/lib/translations';
import { allQuestions } from '@/lib/questions';
import { calculateFullScores, AssessmentScores, getDimensionPercentages } from '@/lib/scoring';
import { personalityTypeColors, personalityTypeData, personalityTypeIcons } from '@/lib/personality-data';
import { saveFullAssessment } from '@/lib/db';
import Image from 'next/image';
import { PersonalityType } from '@/lib/types';

export default function ResultsPage() {
  const router = useRouter();
  const { language, participant, responses, questionOrder } = useAssessmentStore();
  const [scores, setScores] = useState<AssessmentScores | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'pending' | 'saving' | 'saved' | 'error'>('pending');
  const hasSaved = useRef(false);
  const saveStatusRef = useRef<'idle' | 'saving' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (!participant) {
      router.push('/');
      return;
    }

    if (Object.keys(responses).length === 0) {
      router.push('/assessment');
      return;
    }

    // Convert string keys to numbers for scoring
    const numericResponses: Record<number, 'a' | 'b'> = {};
    Object.entries(responses).forEach(([key, value]) => {
      numericResponses[parseInt(key)] = value;
    });

    const calculatedScores = calculateFullScores(numericResponses, allQuestions);
    setScores(calculatedScores);
    setIsLoading(false);

    const saveData = async () => {
      if (saveStatusRef.current !== 'idle') return;
      
      saveStatusRef.current = 'saving';
      setSaveStatus('saving');

      try {
        // First, try to get AI insights
        let aiInsights = null;
        try {
          const aiResponse = await fetch('/api/ai/insights', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              dominantType: calculatedScores.dominantType,
              secondaryType: calculatedScores.secondaryType,
              scores: calculatedScores.temperaments,
              isHybrid: calculatedScores.isHybrid,
              language,
              jobTitle: participant?.job_title,
              department: participant?.department,
            }),
          });

          if (aiResponse.ok) {
            aiInsights = await aiResponse.json();
          }
        } catch (aiError) {
          console.warn('AI insights generation failed, proceeding without AI data:', aiError);
        }

        const result = await saveFullAssessment({
          participant: {
            full_name: participant.full_name,
            email: participant.email,
            phone: participant.phone,
            job_title: participant.job_title,
            department: participant.department,
          },
          language,
          questionOrder: Object.keys(responses).map(Number),
          responses,
          scores: {
            dimensions: calculatedScores.dimensions,
            mbtiCode: calculatedScores.mbtiCode,
            temperaments: calculatedScores.temperaments,
            dominantType: calculatedScores.dominantType,
            secondaryType: calculatedScores.secondaryType,
            isHybrid: calculatedScores.isHybrid,
          },
          aiInsights: aiInsights ? {
            strengths: aiInsights.strengths,
            weaknesses: aiInsights.weaknesses,
            careerSuggestions: aiInsights.careerSuggestions,
            approachDos: aiInsights.approachDos,
            approachDonts: aiInsights.approachDonts,
            source: aiInsights.source,
          } : undefined,
        });

        if (result.success) {
          saveStatusRef.current = 'success';
          setSaveStatus('saved');
        } else {
          saveStatusRef.current = 'error';
          setSaveStatus('error');
          console.error('Failed to save assessment:', result.error);
        }
      } catch (error) {
        saveStatusRef.current = 'error';
        setSaveStatus('error');
        console.error('Error saving assessment:', error);
      }
    };

    if (!hasSaved.current && calculatedScores) {
      hasSaved.current = true;
      saveData();
    }
  }, [participant, responses, language]);

  if (isLoading || !scores) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('common.loading', language)}</p>
        </div>
      </div>
    );
  }

  const dominantData = personalityTypeData[scores.dominantType];
  const secondaryData = personalityTypeData[scores.secondaryType];
  const dimensionPercentages = getDimensionPercentages(scores.dimensions);

  const temperamentOrder: PersonalityType[] = ['guardian', 'rational', 'idealist', 'artisan'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="w-32 h-32 relative">
              <Image
                src={personalityTypeIcons[scores.dominantType]}
                alt={dominantData.name[language]}
                fill
                className="object-contain"
              />
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            {t('results.title', language)}
          </p>
          <h1 
            className="text-4xl md:text-5xl font-bold mb-2"
            style={{ color: personalityTypeColors[scores.dominantType] }}
          >
            {dominantData.name[language]}
          </h1>
          {scores.isHybrid && (
            <div className="flex items-center justify-center gap-2 mt-3">
              <Sparkles className="h-5 w-5 text-amber-500" />
              <span className="text-lg font-medium text-amber-600 dark:text-amber-400">
                {t('results.hybrid', language)}: {dominantData.name[language]} + {secondaryData.name[language]}
              </span>
            </div>
          )}
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
            MBTI: <span className="font-mono font-bold">{scores.mbtiCode}</span>
          </p>
        </div>

        {/* Temperament Breakdown */}
        <Card className="shadow-xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              {t('results.breakdown', language)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {temperamentOrder.map((type) => {
                const percentage = scores.temperaments[type];
                const typeData = personalityTypeData[type];
                const color = personalityTypeColors[type];
                const isDominant = type === scores.dominantType;
                
                return (
                  <div key={type} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className={`font-medium ${isDominant ? 'text-lg' : ''}`} style={{ color: isDominant ? color : undefined }}>
                        {typeData.name[language]}
                        {isDominant && <span className="ml-2 text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">{t('results.strongPreference', language)}</span>}
                      </span>
                      <span className="font-bold" style={{ color }}>{percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ 
                          width: `${percentage}%`, 
                          backgroundColor: color,
                          opacity: isDominant ? 1 : 0.7
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* MBTI Dimensions */}
        <Card className="shadow-xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {language === 'en' ? 'Personality Dimensions' : 'Dimensi Personaliti'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* E/I */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className={dimensionPercentages.E >= 50 ? 'font-bold text-blue-600' : ''}>
                    Extraversion ({dimensionPercentages.E}%)
                  </span>
                  <span className={dimensionPercentages.I > 50 ? 'font-bold text-purple-600' : ''}>
                    Introversion ({dimensionPercentages.I}%)
                  </span>
                </div>
                <div className="flex h-3 rounded-full overflow-hidden bg-gray-200">
                  <div className="bg-blue-500" style={{ width: `${dimensionPercentages.E}%` }} />
                  <div className="bg-purple-500" style={{ width: `${dimensionPercentages.I}%` }} />
                </div>
              </div>

              {/* S/N */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className={dimensionPercentages.S >= 50 ? 'font-bold text-green-600' : ''}>
                    Sensing ({dimensionPercentages.S}%)
                  </span>
                  <span className={dimensionPercentages.N > 50 ? 'font-bold text-amber-600' : ''}>
                    Intuition ({dimensionPercentages.N}%)
                  </span>
                </div>
                <div className="flex h-3 rounded-full overflow-hidden bg-gray-200">
                  <div className="bg-green-500" style={{ width: `${dimensionPercentages.S}%` }} />
                  <div className="bg-amber-500" style={{ width: `${dimensionPercentages.N}%` }} />
                </div>
              </div>

              {/* T/F */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className={dimensionPercentages.T >= 50 ? 'font-bold text-cyan-600' : ''}>
                    Thinking ({dimensionPercentages.T}%)
                  </span>
                  <span className={dimensionPercentages.F > 50 ? 'font-bold text-rose-600' : ''}>
                    Feeling ({dimensionPercentages.F}%)
                  </span>
                </div>
                <div className="flex h-3 rounded-full overflow-hidden bg-gray-200">
                  <div className="bg-cyan-500" style={{ width: `${dimensionPercentages.T}%` }} />
                  <div className="bg-rose-500" style={{ width: `${dimensionPercentages.F}%` }} />
                </div>
              </div>

              {/* J/P */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className={dimensionPercentages.J >= 50 ? 'font-bold text-indigo-600' : ''}>
                    Judging ({dimensionPercentages.J}%)
                  </span>
                  <span className={dimensionPercentages.P > 50 ? 'font-bold text-orange-600' : ''}>
                    Perceiving ({dimensionPercentages.P}%)
                  </span>
                </div>
                <div className="flex h-3 rounded-full overflow-hidden bg-gray-200">
                  <div className="bg-indigo-500" style={{ width: `${dimensionPercentages.J}%` }} />
                  <div className="bg-orange-500" style={{ width: `${dimensionPercentages.P}%` }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Strengths Preview */}
        <Card className="shadow-xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur mb-8">
          <CardHeader>
            <CardTitle>{t('analysis.strengths', language)}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {dominantData.strengths[language].slice(0, 6).map((strength, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => router.push('/analysis')}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-12 px-8"
          >
            {t('results.viewDetails', language)}
            <ArrowRight className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2 h-12 px-8"
            onClick={() => window.print()}
          >
            <Download className="h-5 w-5" />
            {t('analysis.downloadPdf', language)}
          </Button>
        </div>

        {/* Participant Info */}
        {participant && (
          <div className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>{participant.full_name} | {participant.job_title}</p>
            <p>{new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'ms-MY', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
          </div>
        )}
      </div>
    </div>
  );
}
