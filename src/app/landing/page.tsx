'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Brain, Globe, ArrowRight, Shield, Users, Target, TrendingUp, Zap, CheckCircle, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAssessmentStore } from '@/lib/store';
import { Language } from '@/lib/types';

export default function LandingPage() {
  const router = useRouter();
  const { language, setLanguage } = useAssessmentStore();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ms' : 'en');
  };

  const handleGetStarted = () => {
    router.push('/register');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Language Toggle */}
      <div className="absolute top-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleLanguage}
          className="gap-2 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80"
        >
          <Globe className="h-4 w-4" />
          {language === 'en' ? 'Bahasa Malaysia' : 'English'}
        </Button>
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
              <Brain className="h-16 w-16 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {language === 'en' 
              ? 'Discover Your Personality Type'
              : 'Temui Jenis Personaliti Anda'}
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            {language === 'en'
              ? 'Unlock insights into your natural temperament with the Keirsey Personality Assessment. Understand your strengths, career paths, and interpersonal dynamics.'
              : 'Buka wawasan tentang perangai semula jadi anda dengan Penilaian Personaliti Keirsey. Fahami kekuatan, laluan kerjaya, dan dinamik interpersonal anda.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-6"
            >
              {language === 'en' ? 'Get Started' : 'Mulakan'}
              <ArrowRight className="h-5 w-5" />
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push('/admin/login')}
              className="gap-2 text-lg px-8 py-6"
            >
              <Shield className="h-5 w-5" />
              {language === 'en' ? 'Admin Login' : 'Log Masuk Pentadbir'}
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>{language === 'en' ? '70 Questions' : '70 Soalan'}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>{language === 'en' ? '15-20 Minutes' : '15-20 Minit'}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>{language === 'en' ? 'AI-Powered Insights' : 'Wawasan Berkuasa AI'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {language === 'en' ? 'What You Will Discover' : 'Apa Yang Akan Anda Temui'}
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-2 hover:border-blue-500 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg w-fit mb-2">
                  <Target className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-lg">
                  {language === 'en' ? 'Your Temperament' : 'Perangai Anda'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  {language === 'en'
                    ? 'Identify if you are a Guardian, Rational, Idealist, or Artisan personality type.'
                    : 'Kenal pasti sama ada anda jenis personaliti Penguasa, Pemikir, Pemulihara, atau Penghibur.'}
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-purple-500 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg w-fit mb-2">
                  <Award className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-lg">
                  {language === 'en' ? 'Key Strengths' : 'Kelebihan Utama'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  {language === 'en'
                    ? 'Understand your natural talents and how to leverage them in your career and relationships.'
                    : 'Fahami bakat semula jadi anda dan cara memanfaatkannya dalam kerjaya dan perhubungan.'}
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-green-500 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg w-fit mb-2">
                  <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-lg">
                  {language === 'en' ? 'Career Paths' : 'Laluan Kerjaya'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  {language === 'en'
                    ? 'Get personalized career suggestions that align with your personality traits.'
                    : 'Dapatkan cadangan kerjaya peribadi yang selaras dengan ciri personaliti anda.'}
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-amber-500 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="p-3 bg-amber-100 dark:bg-amber-900 rounded-lg w-fit mb-2">
                  <Users className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                </div>
                <CardTitle className="text-lg">
                  {language === 'en' ? 'Relationship Insights' : 'Wawasan Perhubungan'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  {language === 'en'
                    ? 'Learn how to interact effectively with different personality types.'
                    : 'Belajar cara berinteraksi dengan berkesan dengan jenis personaliti berbeza.'}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {language === 'en' ? 'How It Works' : 'Bagaimana Ia Berfungsi'}
          </h2>

          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  {language === 'en' ? 'Register & Consent' : 'Daftar & Persetujuan'}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {language === 'en'
                    ? 'Provide your basic information and agree to our data privacy terms.'
                    : 'Berikan maklumat asas anda dan bersetuju dengan syarat privasi data kami.'}
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  {language === 'en' ? 'Complete Assessment' : 'Lengkapkan Penilaian'}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {language === 'en'
                    ? 'Answer 70 carefully designed questions that measure your personality dimensions.'
                    : 'Jawab 70 soalan yang direka dengan teliti untuk mengukur dimensi personaliti anda.'}
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  {language === 'en' ? 'Get AI-Powered Results' : 'Dapatkan Keputusan Berkuasa AI'}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {language === 'en'
                    ? 'Receive detailed insights about your personality type, powered by advanced AI analysis.'
                    : 'Terima wawasan terperinci tentang jenis personaliti anda, dikuasakan oleh analisis AI canggih.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl my-8">
        <div className="max-w-3xl mx-auto text-center text-white">
          <Zap className="h-16 w-16 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {language === 'en' 
              ? 'Ready to Discover Your True Self?'
              : 'Bersedia Untuk Menemui Diri Sebenar Anda?'}
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            {language === 'en'
              ? 'Join thousands who have gained clarity about their personality and career path.'
              : 'Sertai ribuan yang telah mendapat kejelasan tentang personaliti dan laluan kerjaya mereka.'}
          </p>
          <Button
            size="lg"
            onClick={handleGetStarted}
            className="gap-2 bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6"
          >
            {language === 'en' ? 'Start Your Assessment' : 'Mulakan Penilaian Anda'}
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-500 dark:text-gray-400">
        <p>© 2026 Keirsey Personality Assessment. {language === 'en' ? 'All rights reserved.' : 'Hak cipta terpelihara.'}</p>
      </footer>
    </div>
  );
}
