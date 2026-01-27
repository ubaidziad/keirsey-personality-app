'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { personalityTypeColors, personalityTypeData } from '@/lib/personality-data';
import { Language, PersonalityType } from '@/lib/types';
import { User, Mail, Briefcase, Calendar, BarChart3 } from 'lucide-react';

interface ParticipantDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  participant: {
    id: string;
    full_name: string;
    email: string;
    phone?: string;
    job_title?: string;
    department: string | null;
    dominant_type: PersonalityType;
    secondary_type: PersonalityType;
    is_hybrid: boolean;
    mbti_code: string;
    created_at: string;
    guardian_score: number;
    rational_score: number;
    idealist_score: number;
    artisan_score: number;
  };
  language: Language;
}

export function ParticipantDetailsModal({
  open,
  onOpenChange,
  participant,
  language,
}: ParticipantDetailsModalProps) {
  const dominantData = personalityTypeData[participant.dominant_type];
  const secondaryData = personalityTypeData[participant.secondary_type];
  const dominantColor = personalityTypeColors[participant.dominant_type];

  const scores = [
    { type: 'guardian' as PersonalityType, value: participant.guardian_score },
    { type: 'rational' as PersonalityType, value: participant.rational_score },
    { type: 'idealist' as PersonalityType, value: participant.idealist_score },
    { type: 'artisan' as PersonalityType, value: participant.artisan_score },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-3">
            <User className="h-6 w-6" />
            {participant.full_name}
          </DialogTitle>
          <DialogDescription>
            {language === 'en' ? 'Detailed assessment results and participant information' : 'Keputusan penilaian terperinci dan maklumat peserta'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {language === 'en' ? 'Contact Information' : 'Maklumat Hubungan'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{participant.email}</span>
              </div>
              {participant.phone && (
                <div className="flex items-center gap-3">
                  <span className="h-4 w-4 text-gray-500">📱</span>
                  <span className="text-sm">{participant.phone}</span>
                </div>
              )}
              {participant.job_title && (
                <div className="flex items-center gap-3">
                  <Briefcase className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{participant.job_title}</span>
                </div>
              )}
              {participant.department && (
                <div className="flex items-center gap-3">
                  <span className="h-4 w-4 text-gray-500">🏢</span>
                  <span className="text-sm">{participant.department}</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm">
                  {language === 'en' ? 'Completed: ' : 'Selesai: '}
                  {new Date(participant.created_at).toLocaleDateString(language === 'en' ? 'en-US' : 'ms-MY', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Personality Type */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {language === 'en' ? 'Personality Type' : 'Jenis Personaliti'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div>
                  <p className="text-3xl font-bold mb-2" style={{ color: dominantColor }}>
                    {dominantData.name[language]}
                    {participant.is_hybrid && ` + ${secondaryData.name[language]}`}
                  </p>
                  <Badge variant="outline" className="text-lg px-4 py-1">
                    {participant.mbti_code}
                  </Badge>
                </div>
                {participant.is_hybrid && (
                  <p className="text-sm text-amber-600 dark:text-amber-400">
                    {language === 'en' 
                      ? '⚡ Hybrid Profile - Balanced traits across multiple types' 
                      : '⚡ Profil Hibrid - Ciri seimbang merentasi beberapa jenis'}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Score Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                {language === 'en' ? 'Score Breakdown' : 'Pecahan Skor'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scores
                  .sort((a, b) => b.value - a.value)
                  .map(({ type, value }) => (
                    <div key={type} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-sm">
                          {personalityTypeData[type].name[language]}
                        </span>
                        <span className="text-sm font-bold">{value.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${value}%`,
                            backgroundColor: personalityTypeColors[type],
                          }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Key Traits */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {language === 'en' ? 'Key Strengths' : 'Kelebihan Utama'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {dominantData.strengths[language].slice(0, 3).map((strength, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
