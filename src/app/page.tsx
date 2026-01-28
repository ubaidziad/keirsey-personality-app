'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Brain, Globe, ArrowRight, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAssessmentStore } from '@/lib/store';
import { t } from '@/lib/translations';
import { Language } from '@/lib/types';

export default function Home() {
  const router = useRouter();
  const { language, setLanguage, setParticipant } = useAssessmentStore();
  
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    job_title: '',
    department: '',
  });
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.full_name.trim()) {
      newErrors.full_name = language === 'en' ? 'Full name is required' : 'Nama penuh diperlukan';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = language === 'en' ? 'Phone number is required' : 'Nombor telefon diperlukan';
    }
    if (!formData.email.trim()) {
      newErrors.email = language === 'en' ? 'Email is required' : 'E-mel diperlukan';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = language === 'en' ? 'Invalid email format' : 'Format e-mel tidak sah';
    }
    if (!formData.job_title.trim()) {
      newErrors.job_title = language === 'en' ? 'Job title is required' : 'Jawatan diperlukan';
    }
    if (!consent) {
      newErrors.consent = language === 'en' ? 'You must agree to the consent' : 'Anda mesti bersetuju dengan persetujuan';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const participant = {
      id: crypto.randomUUID(),
      ...formData,
      language,
      consent_given: consent,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setParticipant(participant);
    router.push('/assessment');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ms' : 'en');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Language Toggle */}
      <div className="absolute top-4 right-4">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleLanguage}
          className="flex items-center gap-2"
        >
          <Globe className="h-4 w-4" />
          {language === 'en' ? 'BM' : 'EN'}
        </Button>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <Brain className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            {t('app.title', language)}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t('app.subtitle', language)}
          </p>
        </div>

        {/* Registration Card */}
        <Card className="max-w-xl mx-auto shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl">{t('registration.title', language)}</CardTitle>
            <CardDescription>{t('registration.subtitle', language)}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="full_name">{t('registration.fullName', language)} *</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder={language === 'en' ? 'Enter your full name' : 'Masukkan nama penuh anda'}
                  className={errors.full_name ? 'border-red-500' : ''}
                />
                {errors.full_name && <p className="text-sm text-red-500">{errors.full_name}</p>}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">{t('registration.phone', language)} *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder={language === 'en' ? 'e.g., +60123456789' : 'cth., +60123456789'}
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">{t('registration.email', language)} *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder={language === 'en' ? 'your.email@example.com' : 'emel.anda@contoh.com'}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>

              {/* Job Title */}
              <div className="space-y-2">
                <Label htmlFor="job_title">{t('registration.jobTitle', language)} *</Label>
                <Input
                  id="job_title"
                  value={formData.job_title}
                  onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                  placeholder={language === 'en' ? 'e.g., Software Engineer' : 'cth., Jurutera Perisian'}
                  className={errors.job_title ? 'border-red-500' : ''}
                />
                {errors.job_title && <p className="text-sm text-red-500">{errors.job_title}</p>}
              </div>

              {/* Department (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="department">{t('registration.department', language)}</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder={language === 'en' ? 'e.g., Engineering' : 'cth., Kejuruteraan'}
                />
              </div>

              {/* Consent */}
              <div className="space-y-2">
                <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <Checkbox
                    id="consent"
                    checked={consent}
                    onCheckedChange={(checked) => setConsent(checked as boolean)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label htmlFor="consent" className="flex items-start gap-2 text-sm cursor-pointer leading-relaxed">
                      <Shield className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{t('registration.consent', language)}</span>
                    </Label>
                  </div>
                </div>
                {errors.consent && <p className="text-sm text-red-500">{errors.consent}</p>}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {t('registration.start', language)}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer Info */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8 max-w-lg mx-auto">
          {language === 'en'
            ? 'This assessment takes approximately 15-20 minutes to complete. Your responses are saved automatically.'
            : 'Penilaian ini mengambil masa kira-kira 15-20 minit untuk diselesaikan. Respons anda disimpan secara automatik.'}
        </p>
      </div>
    </div>
  );
}
