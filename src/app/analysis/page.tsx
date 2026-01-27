'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Download, Briefcase, ThumbsUp, ThumbsDown, CheckCircle, XCircle, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
      <div className="container mx-auto px-4 py-8 max-w-4xl">
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

        {/* Content Tabs */}
        <Tabs defaultValue="strengths" className="print:hidden">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="strengths">{t('analysis.strengths', language)}</TabsTrigger>
            <TabsTrigger value="weaknesses">{t('analysis.weaknesses', language)}</TabsTrigger>
            <TabsTrigger value="careers">{t('analysis.careers', language)}</TabsTrigger>
            <TabsTrigger value="approach">{t('analysis.approach', language)}</TabsTrigger>
          </TabsList>

          <TabsContent value="strengths">
            <Card className="shadow-lg border-0 bg-white/90 dark:bg-gray-800/90">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <ThumbsUp className="h-5 w-5" />
                  {t('analysis.strengths', language)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {insightsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {(aiInsights?.strengths || dominantData.strengths[language]).map((item, index) => (
                      <li key={index} className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 dark:text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="weaknesses">
            <Card className="shadow-lg border-0 bg-white/90 dark:bg-gray-800/90">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-600">
                  <ThumbsDown className="h-5 w-5" />
                  {t('analysis.weaknesses', language)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {insightsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600" />
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {(aiInsights?.weaknesses || dominantData.weaknesses[language]).map((item, index) => (
                      <li key={index} className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                        <XCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 dark:text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="careers">
            <Card className="shadow-lg border-0 bg-white/90 dark:bg-gray-800/90">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-600">
                  <Briefcase className="h-5 w-5" />
                  {t('analysis.careers', language)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {insightsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {(aiInsights?.careerSuggestions || dominantData.careers[language]).map((item, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-gray-700 dark:text-gray-300">{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approach">
            <div className="space-y-6">
              <Card className="shadow-lg border-0 bg-white/90 dark:bg-gray-800/90">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    {t('analysis.dos', language)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {insightsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      {(aiInsights?.approachDos || dominantData.dos[language]).map((item, index) => (
                        <li key={index} className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 dark:text-gray-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white/90 dark:bg-gray-800/90">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <XCircle className="h-5 w-5" />
                    {t('analysis.donts', language)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {insightsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" />
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      {(aiInsights?.approachDonts || dominantData.donts[language]).map((item, index) => (
                        <li key={index} className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                          <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 dark:text-gray-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Print View - Shows all sections */}
        <div className="hidden print:block space-y-8">
          {/* Strengths */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-green-600">{t('analysis.strengths', language)}</h2>
            <ul className="space-y-2">
              {dominantData.strengths[language].map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-amber-600">{t('analysis.weaknesses', language)}</h2>
            <ul className="space-y-2">
              {dominantData.weaknesses[language].map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-amber-500">!</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Careers */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-blue-600">{t('analysis.careers', language)}</h2>
            <ul className="grid grid-cols-2 gap-2">
              {dominantData.careers[language].map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Do's */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-green-600">{t('analysis.dos', language)}</h2>
            <ul className="space-y-2">
              {dominantData.dos[language].map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Don'ts */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-red-600">{t('analysis.donts', language)}</h2>
            <ul className="space-y-2">
              {dominantData.donts[language].map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-red-500">✗</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
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
