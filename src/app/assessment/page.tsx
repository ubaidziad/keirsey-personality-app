'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, CheckCircle, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAssessmentStore } from '@/lib/store';
import { t } from '@/lib/translations';
import { allQuestions, shuffleQuestions } from '@/lib/questions';
import { Question } from '@/lib/questions-base';

export default function AssessmentPage() {
  const router = useRouter();
  const {
    language,
    participant,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    responses,
    setResponse,
    questionOrder,
    setQuestionOrder,
  } = useAssessmentStore();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [showSaveIndicator, setShowSaveIndicator] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize questions on mount
  useEffect(() => {
    if (!participant) {
      router.push('/');
      return;
    }

    // If we have existing question order, use it; otherwise shuffle
    if (questionOrder.length > 0) {
      const orderedQuestions = questionOrder
        .map(id => allQuestions.find(q => q.id.toString() === id))
        .filter((q): q is Question => q !== undefined);
      setQuestions(orderedQuestions);
    } else {
      const shuffled = shuffleQuestions(allQuestions);
      setQuestions(shuffled);
      setQuestionOrder(shuffled.map(q => q.id.toString()));
    }
    setIsLoading(false);
  }, [participant, questionOrder, setQuestionOrder, router]);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progress = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;
  const answeredCount = Object.keys(responses).length;

  // Auto-save indicator
  const showAutoSave = useCallback(() => {
    setShowSaveIndicator(true);
    setTimeout(() => setShowSaveIndicator(false), 2000);
  }, []);

  const handleOptionSelect = (option: 'a' | 'b') => {
    if (!currentQuestion) return;
    setResponse(currentQuestion.id.toString(), option);
    showAutoSave();

    // Auto-advance to next question after selection
    if (currentQuestionIndex < totalQuestions - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }, 300);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmit = () => {
    if (answeredCount < totalQuestions) {
      const confirmMsg = language === 'en'
        ? `You have answered ${answeredCount} of ${totalQuestions} questions. Are you sure you want to submit?`
        : `Anda telah menjawab ${answeredCount} daripada ${totalQuestions} soalan. Adakah anda pasti mahu menghantar?`;
      if (!confirm(confirmMsg)) return;
    }
    router.push('/results');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('common.loading', language)}</p>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <p className="text-gray-600">{t('common.error', language)}</p>
          <Button onClick={() => router.push('/')} className="mt-4">
            {t('common.back', language)}
          </Button>
        </div>
      </div>
    );
  }

  const selectedOption = responses[currentQuestion.id.toString()];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        {/* Header with Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {t('assessment.question', language)} {currentQuestionIndex + 1} {t('assessment.of', language)} {totalQuestions}
            </div>
            <div className="flex items-center gap-2">
              {showSaveIndicator && (
                <span className="text-xs text-green-600 flex items-center gap-1 animate-fade-in">
                  <Save className="h-3 w-3" />
                  {t('assessment.autoSaved', language)}
                </span>
              )}
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {answeredCount}/{totalQuestions} {language === 'en' ? 'answered' : 'dijawab'}
              </span>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="shadow-xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur mb-6">
          <CardContent className="p-8">
            {/* Question Text */}
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-8 text-center leading-relaxed">
              {language === 'en' ? currentQuestion.text_en : currentQuestion.text_ms}
            </h2>

            {/* Options */}
            <div className="space-y-4">
              {/* Option A */}
              <button
                onClick={() => handleOptionSelect('a')}
                className={`w-full p-5 rounded-xl border-2 text-left transition-all duration-200 ${
                  selectedOption === 'a'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 shadow-md'
                    : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                      selectedOption === 'a'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    A
                  </div>
                  <span className="text-gray-700 dark:text-gray-200 text-lg leading-relaxed">
                    {language === 'en' ? currentQuestion.option_a_en : currentQuestion.option_a_ms}
                  </span>
                  {selectedOption === 'a' && (
                    <CheckCircle className="flex-shrink-0 ml-auto h-6 w-6 text-blue-500" />
                  )}
                </div>
              </button>

              {/* Option B */}
              <button
                onClick={() => handleOptionSelect('b')}
                className={`w-full p-5 rounded-xl border-2 text-left transition-all duration-200 ${
                  selectedOption === 'b'
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 shadow-md'
                    : 'border-gray-200 dark:border-gray-600 hover:border-purple-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                      selectedOption === 'b'
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    B
                  </div>
                  <span className="text-gray-700 dark:text-gray-200 text-lg leading-relaxed">
                    {language === 'en' ? currentQuestion.option_b_en : currentQuestion.option_b_ms}
                  </span>
                  {selectedOption === 'b' && (
                    <CheckCircle className="flex-shrink-0 ml-auto h-6 w-6 text-purple-500" />
                  )}
                </div>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {language === 'en' ? 'Answer each question to proceed' : 'Jawab setiap soalan untuk meneruskan'}
          </div>

          {currentQuestionIndex === totalQuestions - 1 ? (
            <Button
              onClick={handleSubmit}
              className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              {t('assessment.submit', language)}
              <CheckCircle className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!selectedOption}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {t('assessment.next', language)}
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>

      </div>
    </div>
  );
}
