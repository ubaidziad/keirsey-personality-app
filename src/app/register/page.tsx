'use client';

import { useState, useEffect } from 'react';
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
import { PasswordGate } from '@/components/PasswordGate';

export default function RegisterPage() {
  const router = useRouter();
  const { language, setLanguage, setParticipant } = useAssessmentStore();
  const [hasPassword, setHasPassword] = useState<boolean | null>(null);
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    job_title: '',
    department: '',
    organization: '',
  });
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const checkPasswordProtection = async () => {
      const verified = sessionStorage.getItem('assessment_access_verified') === 'true';
      if (verified) {
        setIsPasswordVerified(true);
        setHasPassword(false);
        return;
      }

      try {
        const response = await fetch('/api/admin/access-password');
        const data = await response.json();
        setHasPassword(data.hasPassword);
        if (!data.hasPassword) {
          setIsPasswordVerified(true);
        }
      } catch (error) {
        console.error('Error checking password protection:', error);
        setHasPassword(false);
        setIsPasswordVerified(true);
      }
    };

    checkPasswordProtection();
  }, []);

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
    if (!formData.organization.trim()) {
      newErrors.organization = language === 'en' ? 'Organisation name is required' : 'Nama organisasi diperlukan';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Check if email already has a completed assessment
    setEmailChecking(true);
    try {
      const res = await fetch(`/api/check-email?email=${encodeURIComponent(formData.email)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.exists) {
          setEmailExists(true);
          setEmailChecking(false);
          return;
        }
      }
    } catch {
      // If check fails, proceed anyway
    }
    setEmailChecking(false);
    setEmailExists(false);

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

  // Show loading state while checking password protection
  if (hasPassword === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {language === 'en' ? 'Loading...' : 'Memuatkan...'}
          </p>
        </div>
      </div>
    );
  }

  // Show password gate if password protection is enabled and not verified
  if (hasPassword && !isPasswordVerified) {
    return <PasswordGate onSuccess={() => setIsPasswordVerified(true)} language={language} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Language Toggle */}
      <div className="absolute top-4 right-4">
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

      <div className="container mx-auto px-4 py-12 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
              <Brain className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {language === 'en' ? 'Keirsey Personality Assessment' : 'Penilaian Personaliti Keirsey'}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {language === 'en' 
              ? 'Discover your natural temperament and unlock your potential'
              : 'Temui perangai semula jadi anda dan buka potensi anda'}
          </p>
        </div>

        {/* Registration Form */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>{language === 'en' ? 'Get Started' : 'Mulakan'}</CardTitle>
            <CardDescription>
              {language === 'en' 
                ? 'Please fill in your details to begin the assessment'
                : 'Sila isi butiran anda untuk memulakan penilaian'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="full_name">{language === 'en' ? 'Full Name' : 'Nama Penuh'} *</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder={language === 'en' ? 'John Doe' : 'Ahmad Abdullah'}
                  className={errors.full_name ? 'border-red-500' : ''}
                />
                {errors.full_name && (
                  <p className="text-sm text-red-500">{errors.full_name}</p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">{language === 'en' ? 'Phone Number' : 'Nombor Telefon'} *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder={language === 'en' ? '+60123456789' : '+60123456789'}
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">{language === 'en' ? 'Email Address' : 'Alamat E-mel'} *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder={language === 'en' ? 'john@example.com' : 'ahmad@contoh.com'}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Job Title */}
              <div className="space-y-2">
                <Label htmlFor="job_title">{language === 'en' ? 'Job Title' : 'Jawatan'} *</Label>
                <Input
                  id="job_title"
                  value={formData.job_title}
                  onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                  placeholder={language === 'en' ? 'Software Engineer' : 'Jurutera Perisian'}
                  className={errors.job_title ? 'border-red-500' : ''}
                />
                {errors.job_title && (
                  <p className="text-sm text-red-500">{errors.job_title}</p>
                )}
              </div>

              {/* Organisation Name */}
              <div className="space-y-2">
                <Label htmlFor="organization">{language === 'en' ? 'Organisation Name' : 'Nama Organisasi'} *</Label>
                <Input
                  id="organization"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  placeholder={language === 'en' ? 'ABC Sdn Bhd' : 'ABC Sdn Bhd'}
                  className={errors.organization ? 'border-red-500' : ''}
                />
                {errors.organization && (
                  <p className="text-sm text-red-500">{errors.organization}</p>
                )}
              </div>

              {/* Department */}
              <div className="space-y-2">
                <Label htmlFor="department">{language === 'en' ? 'Department' : 'Jabatan'}</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder={language === 'en' ? 'Engineering' : 'Kejuruteraan'}
                />
              </div>

              {/* Email Already Exists Warning */}
              {emailExists && (
                <div className="p-4 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-300 dark:border-amber-700">
                  <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">
                    {language === 'en'
                      ? 'This email has already been used to complete an assessment. Each email can only be used once. Please contact your administrator if you need to retake the test.'
                      : 'E-mel ini telah digunakan untuk melengkapkan penilaian. Setiap e-mel hanya boleh digunakan sekali. Sila hubungi pentadbir anda jika anda perlu mengambil semula ujian.'}
                  </p>
                </div>
              )}

              {/* Consent */}
              <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                <Checkbox
                  id="consent"
                  checked={consent}
                  onCheckedChange={(checked) => setConsent(checked as boolean)}
                  className={errors.consent ? 'border-red-500' : ''}
                />
                <div className="flex-1">
                  <label
                    htmlFor="consent"
                    className="text-sm leading-relaxed cursor-pointer flex items-start gap-2"
                  >
                    <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <span>
                      {language === 'en'
                        ? 'I agree to the collection and processing of my personal data for the purpose of this personality assessment. My data will be kept confidential and used solely for assessment purposes.'
                        : 'Saya bersetuju dengan pengumpulan dan pemprosesan data peribadi saya untuk tujuan penilaian personaliti ini. Data saya akan dirahsiakan dan digunakan semata-mata untuk tujuan penilaian.'}
                    </span>
                  </label>
                  {errors.consent && (
                    <p className="text-sm text-red-500 mt-2">{errors.consent}</p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                disabled={emailChecking}
                className="w-full gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {emailChecking 
                  ? (language === 'en' ? 'Checking...' : 'Menyemak...')
                  : (language === 'en' ? 'Start Assessment' : 'Mulakan Penilaian')}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Button
            variant="ghost"
            onClick={() => router.push('/landing')}
            className="text-gray-600 dark:text-gray-400"
          >
            {language === 'en' ? '← Back to Home' : '← Kembali ke Laman Utama'}
          </Button>
        </div>
      </div>
    </div>
  );
}
