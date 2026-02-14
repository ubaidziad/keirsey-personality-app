'use client';

import { useState } from 'react';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Language } from '@/lib/types';

interface PasswordGateProps {
  onSuccess: () => void;
  language: Language;
}

export function PasswordGate({ onSuccess, language }: PasswordGateProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsVerifying(true);

    try {
      const response = await fetch('/api/admin/access-password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: password.trim() }),
      });
      const data = await response.json();

      if (response.ok && data.valid) {
        sessionStorage.setItem('assessment_access_verified', 'true');
        onSuccess();
      } else {
        setError(
          language === 'en'
            ? 'Incorrect password. Please try again.'
            : 'Kata laluan salah. Sila cuba lagi.'
        );
      }
    } catch (error) {
      console.error('Password verification error:', error);
      setError(
        language === 'en'
          ? 'An error occurred. Please try again.'
          : 'Ralat berlaku. Sila cuba lagi.'
      );
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
            <Lock className="h-8 w-8 text-white" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
          {language === 'en' ? 'Access Protected' : 'Akses Dilindungi'}
        </h1>
        <p className="text-center text-gray-600 mb-6">
          {language === 'en'
            ? 'Please enter the password to access the assessment'
            : 'Sila masukkan kata laluan untuk mengakses penilaian'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder={language === 'en' ? 'Enter password' : 'Masukkan kata laluan'}
              className="text-center text-lg"
              autoFocus
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600 text-center">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={!password.trim() || isVerifying}
          >
            {isVerifying
              ? (language === 'en' ? 'Verifying...' : 'Mengesahkan...')
              : (language === 'en' ? 'Continue' : 'Teruskan')}
          </Button>
        </form>

        <p className="text-xs text-gray-500 text-center mt-6">
          {language === 'en'
            ? 'Contact your administrator if you need the access password'
            : 'Hubungi pentadbir anda jika anda memerlukan kata laluan akses'}
        </p>
      </div>
    </div>
  );
}
