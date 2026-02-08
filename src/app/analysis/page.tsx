'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Download, Briefcase, ThumbsUp, ThumbsDown, CheckCircle, XCircle, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// Tabs removed - using single scrollable view
import { useAssessmentStore } from '@/lib/store';
import { t } from '@/lib/translations';
import { allQuestions } from '@/lib/questions';
import { calculateFullScores, AssessmentScores } from '@/lib/scoring';
import { personalityTypeColors, personalityTypeData } from '@/lib/personality-data';

interface AIInsights {
  strengths: string[];
  weaknesses: string[];
  careerSuggestions: string[];
  approachDos: string[];
  approachDonts: string[];
  source?: 'ai' | 'fallback';
}

export default function AnalysisPage() {
  const router = useRouter();
  const { language, participant, responses } = useAssessmentStore();
  const [scores, setScores] = useState<AssessmentScores | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [aiInsights, setAiInsights] = useState<AIInsights | null>(null);
  const [insightsLoading, setInsightsLoading] = useState(false);

  useEffect(() => {
    if (!participant) {
      router.push('/');
      return;
    }

    if (Object.keys(responses).length === 0) {
      router.push('/assessment');
      return;
    }

    const numericResponses: Record<number, 'a' | 'b'> = {};
    Object.entries(responses).forEach(([key, value]) => {
      numericResponses[parseInt(key)] = value;
    });

    const calculatedScores = calculateFullScores(numericResponses, allQuestions);
    setScores(calculatedScores);
    setIsLoading(false);

    // Fetch AI insights
    fetchAIInsights(calculatedScores);
  }, [participant, responses, router, language]);

  const fetchAIInsights = async (calculatedScores: AssessmentScores) => {
    setInsightsLoading(true);
    try {
      const response = await fetch('/api/ai/insights', {
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

      if (response.ok) {
        const data = await response.json();
        setAiInsights(data);
      } else {
        // Use static data as fallback
        setAiInsights({
          strengths: personalityTypeData[calculatedScores.dominantType].strengths[language],
          weaknesses: personalityTypeData[calculatedScores.dominantType].weaknesses[language],
          careerSuggestions: personalityTypeData[calculatedScores.dominantType].careers[language],
          approachDos: personalityTypeData[calculatedScores.dominantType].dos[language],
          approachDonts: personalityTypeData[calculatedScores.dominantType].donts[language],
          source: 'fallback',
        });
      }
    } catch (error) {
      console.error('Error fetching AI insights:', error);
      // Use static data as fallback
      setAiInsights({
        strengths: personalityTypeData[calculatedScores.dominantType].strengths[language],
        weaknesses: personalityTypeData[calculatedScores.dominantType].weaknesses[language],
        careerSuggestions: personalityTypeData[calculatedScores.dominantType].careers[language],
        approachDos: personalityTypeData[calculatedScores.dominantType].dos[language],
        approachDonts: personalityTypeData[calculatedScores.dominantType].donts[language],
        source: 'fallback',
      });
    } finally {
      setInsightsLoading(false);
    }
  };

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
  const dominantColor = personalityTypeColors[scores.dominantType];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 print:bg-white">
      {/* Print-only header */}
      <style jsx global>{`
        @media print {
          @page {
            margin: 20mm;
            size: A4;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .print-page-break {
            page-break-before: always;
          }
          .print-avoid-break {
            page-break-inside: avoid;
          }
        }
      `}</style>
      
      {/* Print Header with Logo and Title */}
      <div className="hidden print:block mb-8 pb-4 border-b-2 border-gray-300">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">
              {language === 'en' ? 'Keirsey Personality Assessment' : 'Penilaian Personaliti Keirsey'}
            </h1>
            <p className="text-sm text-gray-600">
              {participant?.full_name} | {participant?.email}
            </p>
            <p className="text-xs text-gray-500">
              {language === 'en' ? 'Generated on' : 'Dijana pada'} {new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'ms-MY', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full" style={{ backgroundColor: dominantColor + '20', border: `3px solid ${dominantColor}` }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke={dominantColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
                <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/>
                <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8 max-w-4xl print:px-0 print:py-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 print:hidden">
          <Button
            variant="outline"
            onClick={() => router.push('/results')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('common.back', language)}
          </Button>
          <Button
            variant="outline"
            onClick={() => window.print()}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {t('analysis.downloadPdf', language)}
          </Button>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            {t('analysis.title', language)}
          </h1>
          <p className="text-xl" style={{ color: dominantColor }}>
            {dominantData.name[language]}
            {scores.isHybrid && ` + ${secondaryData.name[language]}`}
          </p>
          {participant && (
            <p className="text-sm text-gray-500 mt-2">
              {participant.full_name} | {new Date().toLocaleDateString()}
            </p>
          )}
          {aiInsights?.source === 'ai' && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <span className="text-xs font-medium text-purple-700 dark:text-purple-300">
                {language === 'en' ? 'AI-Enhanced Insights' : 'Pandangan Dipertingkat AI'}
              </span>
            </div>
          )}
        </div>

        {/* Full Analysis - Single Scrollable View */}
        <div className="space-y-6 print:hidden">
          {insightsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
            </div>
          ) : (
            <>
              {/* Strengths */}
              <Card className="shadow-lg border-0 bg-white/90 dark:bg-gray-800/90">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600">
                    <ThumbsUp className="h-5 w-5" />
                    {t('analysis.strengths', language)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {(aiInsights?.strengths || dominantData.strengths[language]).map((item: string, index: number) => (
                      <li key={index} className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 dark:text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Areas for Development */}
              <Card className="shadow-lg border-0 bg-white/90 dark:bg-gray-800/90">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-600">
                    <ThumbsDown className="h-5 w-5" />
                    {language === 'en' ? 'Areas for Development' : 'Bidang Pembangunan'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {(aiInsights?.weaknesses || dominantData.weaknesses[language]).map((item: string, index: number) => (
                      <li key={index} className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                        <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 dark:text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Career Suggestions */}
              <Card className="shadow-lg border-0 bg-white/90 dark:bg-gray-800/90">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-600">
                    <Briefcase className="h-5 w-5" />
                    {t('analysis.careers', language)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {(aiInsights?.careerSuggestions || dominantData.careers[language]).map((item: string, index: number) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-gray-700 dark:text-gray-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Communication Do's */}
              <Card className="shadow-lg border-0 bg-white/90 dark:bg-gray-800/90">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    {language === 'en' ? 'Communication Do\'s' : 'Perkara Yang Perlu'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {(aiInsights?.approachDos || dominantData.dos[language]).map((item: string, index: number) => (
                      <li key={index} className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 dark:text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Communication Don'ts */}
              <Card className="shadow-lg border-0 bg-white/90 dark:bg-gray-800/90">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <XCircle className="h-5 w-5" />
                    {language === 'en' ? 'Communication Don\'ts' : 'Perkara Yang Tidak Perlu'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {(aiInsights?.approachDonts || dominantData.donts[language]).map((item: string, index: number) => (
                      <li key={index} className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 dark:text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Print View - Shows all sections */}
        <div className="hidden print:block space-y-6">
          {/* Personality Type Summary Box */}
          <div className="print-avoid-break mb-8 p-6 border-2 rounded-lg" style={{ borderColor: dominantColor }}>
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2" style={{ color: dominantColor }}>
                {dominantData.name[language]}
                {scores.isHybrid && (
                  <span className="text-2xl font-normal"> + {secondaryData.name[language]}</span>
                )}
              </h2>
              <p className="text-xl font-semibold text-gray-700 mb-2">
                {language === 'en' ? 'MBTI Code:' : 'Kod MBTI:'} {scores.mbtiCode}
              </p>
              {scores.isHybrid && (
                <p className="text-sm text-amber-700 font-medium">
                  {language === 'en' 
                    ? '⚡ Hybrid Profile - Balanced traits across multiple types' 
                    : '⚡ Profil Hibrid - Ciri seimbang merentasi beberapa jenis'}
                </p>
              )}
              {aiInsights?.source === 'ai' && (
                <div className="mt-2 inline-flex items-center gap-1 text-xs text-purple-700 font-medium">
                  <span>✨</span>
                  <span>{language === 'en' ? 'AI-Enhanced Insights' : 'Pandangan AI'}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Personality Breakdown */}
          <div className="print-avoid-break mb-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <line x1="12" y1="20" x2="12" y2="10"/>
                <line x1="18" y1="20" x2="18" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="16"/>
              </svg>
              {language === 'en' ? 'Personality Breakdown' : 'Pecahan Personaliti'}
            </h3>
            <div className="space-y-3">
              {[
                { type: 'guardian', name: personalityTypeData.guardian.name[language], score: scores.temperaments.guardian, color: personalityTypeColors.guardian },
                { type: 'rational', name: personalityTypeData.rational.name[language], score: scores.temperaments.rational, color: personalityTypeColors.rational },
                { type: 'idealist', name: personalityTypeData.idealist.name[language], score: scores.temperaments.idealist, color: personalityTypeColors.idealist },
                { type: 'artisan', name: personalityTypeData.artisan.name[language], score: scores.temperaments.artisan, color: personalityTypeColors.artisan },
              ]
                .sort((a, b) => b.score - a.score)
                .map(({ type, name, score, color }) => (
                  <div key={type} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-sm text-gray-700">{name}</span>
                        <span className="font-bold text-sm" style={{ color }}>{score.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${score}%`, backgroundColor: color }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          {/* Strengths */}
          <div className="print-avoid-break mb-6">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-green-700">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M7 10v12"/>
                <path d="M15 5v17"/>
                <path d="M17 3v2"/>
                <path d="M15 3h2"/>
              </svg>
              {t('analysis.strengths', language)}
            </h3>
            <div className="border-l-4 border-green-500 pl-4">
              <ul className="space-y-2">
                {(aiInsights?.strengths || dominantData.strengths[language]).map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-green-600 font-bold text-lg flex-shrink-0">✓</span>
                    <span className="text-gray-700 text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Areas for Development */}
          <div className="print-avoid-break mb-6">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-amber-700">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              {language === 'en' ? 'Areas for Development' : 'Bidang Pembangunan'}
            </h3>
            <div className="border-l-4 border-amber-500 pl-4">
              <ul className="space-y-2">
                {(aiInsights?.weaknesses || dominantData.weaknesses[language]).map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-amber-600 font-bold text-lg flex-shrink-0">⚠</span>
                    <span className="text-gray-700 text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Career Suggestions */}
          <div className="print-avoid-break print-page-break mb-6">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-blue-700">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
              {t('analysis.careers', language)}
            </h3>
            <div className="border-l-4 border-blue-500 pl-4">
              <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
                {(aiInsights?.careerSuggestions || dominantData.careers[language]).map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold flex-shrink-0">•</span>
                    <span className="text-gray-700 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Communication Do's */}
          <div className="print-avoid-break mb-6">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-emerald-700">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              {language === 'en' ? 'Communication Do\'s' : 'Perkara Yang Perlu'}
            </h3>
            <div className="border-l-4 border-emerald-500 pl-4">
              <ul className="space-y-2">
                {(aiInsights?.approachDos || dominantData.dos[language]).map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-emerald-600 font-bold text-lg flex-shrink-0">✓</span>
                    <span className="text-gray-700 text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Communication Don'ts */}
          <div className="print-avoid-break mb-6">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-red-700">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              {language === 'en' ? 'Communication Don\'ts' : 'Perkara Yang Tidak Perlu'}
            </h3>
            <div className="border-l-4 border-red-500 pl-4">
              <ul className="space-y-2">
                {(aiInsights?.approachDonts || dominantData.donts[language]).map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-red-600 font-bold text-lg flex-shrink-0">✗</span>
                    <span className="text-gray-700 text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Print Footer */}
          <div className="mt-8 pt-4 border-t-2 border-gray-300 text-center text-xs text-gray-500">
            <p>{language === 'en' ? 'Keirsey Personality Assessment Report' : 'Laporan Penilaian Personaliti Keirsey'}</p>
            <p className="mt-1">© 2026 {language === 'en' ? 'All Rights Reserved' : 'Hak Cipta Terpelihara'}</p>
          </div>
        </div>

        {/* Restart Button */}
        <div className="mt-10 text-center print:hidden">
          <Button
            variant="outline"
            onClick={() => {
              if (confirm(language === 'en' ? 'Start a new assessment?' : 'Mulakan penilaian baru?')) {
                useAssessmentStore.getState().resetAssessment();
                router.push('/');
              }
            }}
          >
            {language === 'en' ? 'Start New Assessment' : 'Mulakan Penilaian Baru'}
          </Button>
        </div>
      </div>
    </div>
  );
}
