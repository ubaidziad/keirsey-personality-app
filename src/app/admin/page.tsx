'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, BarChart3, Settings, Download, Search, Filter, 
  ChevronDown, Eye, Trash2, FileSpreadsheet, FileText,
  PieChart, TrendingUp, Calendar, RefreshCw, Globe, Loader2, LogOut, Sparkles
} from 'lucide-react';
import { createClient } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAssessmentStore } from '@/lib/store';
import { t } from '@/lib/translations';
import { personalityTypeColors, personalityTypeData, getTrainingRecommendations } from '@/lib/personality-data';
import { PersonalityType, Language } from '@/lib/types';
import { ParticipantDetailsModal } from '@/components/admin/ParticipantDetailsModal';
import { DeleteConfirmationModal } from '@/components/admin/DeleteConfirmationModal';
import { CompanyLogoModal } from '@/components/admin/CompanyLogoModal';
import { toast } from 'sonner';

interface ParticipantData {
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
  ai_strengths?: string;
  ai_weaknesses?: string;
  ai_career_suggestions?: string;
  ai_approach_dos?: string;
  ai_approach_donts?: string;
  ai_insights_source?: string;
}

interface StatsData {
  totalParticipants: number;
  completedAssessments: number;
  distribution: Record<PersonalityType, number>;
  departments: Array<{ department: string; participant_count: number; completed_assessments: number }>;
}

export default function AdminPage() {
  const router = useRouter();
  const supabase = createClient();
  const { language, setLanguage } = useAssessmentStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [participants, setParticipants] = useState<ParticipantData[]>([]);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [retentionPeriod, setRetentionPeriod] = useState('12');
  const [selectedParticipant, setSelectedParticipant] = useState<ParticipantData | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [participantToDelete, setParticipantToDelete] = useState<ParticipantData | null>(null);
  const [logoModalOpen, setLogoModalOpen] = useState(false);
  const [companyLogoUrl, setCompanyLogoUrl] = useState<string>('');

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set('search', searchQuery);
      if (filterType !== 'all') params.set('type', filterType);
      if (filterDepartment !== 'all') params.set('department', filterDepartment);

      const [participantsRes, statsRes] = await Promise.all([
        fetch(`/api/admin/participants?${params}`),
        fetch('/api/admin/stats')
      ]);

      if (participantsRes.ok) {
        const data = await participantsRes.json();
        setParticipants(data.data || []);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      // Fetch settings
      const settingsRes = await fetch('/api/admin/settings');
      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        setCompanyLogoUrl(settingsData.logo_url || '');
        setRetentionPeriod(settingsData.data_retention_months?.toString() || '12');
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, filterType, filterDepartment]);

  useEffect(() => {
    fetchData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchData();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchData]);

  const handleDelete = async (participantId: string) => {
    const participant = participants.find(p => p.id === participantId);
    if (!participant) return;
    
    setParticipantToDelete(participant);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!participantToDelete) return;

    setIsDeleting(participantToDelete.id);
    try {
      const response = await fetch(`/api/admin/participants/${participantToDelete.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setParticipants(participants.filter(p => p.id !== participantToDelete.id));
        toast.success(
          language === 'en'
            ? 'Participant deleted successfully'
            : 'Peserta berjaya dipadam'
        );
      } else {
        toast.error(
          language === 'en'
            ? 'Failed to delete participant'
            : 'Gagal memadam peserta'
        );
      }
    } catch (error) {
      console.error('Failed to delete participant:', error);
      toast.error(
        language === 'en'
          ? 'An error occurred'
          : 'Ralat berlaku'
      );
    } finally {
      setIsDeleting(null);
      setDeleteConfirmOpen(false);
      setParticipantToDelete(null);
    }
  };

  const handleSaveRetention = async () => {
    try {
      const response = await fetch('/api/admin/retention', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ retentionMonths: parseInt(retentionPeriod) }),
      });

      if (response.ok) {
        toast.success(
          language === 'en'
            ? 'Retention policy updated successfully'
            : 'Dasar penyimpanan berjaya dikemas kini'
        );
      } else {
        toast.error(
          language === 'en'
            ? 'Failed to update retention policy'
            : 'Gagal mengemas kini dasar penyimpanan'
        );
      }
    } catch (error) {
      console.error('Failed to update retention:', error);
      toast.error(
        language === 'en'
          ? 'An error occurred'
          : 'Ralat berlaku'
      );
    }
  };

  const handleCleanupOldData = async () => {
    if (!confirm(
      language === 'en'
        ? `Delete all data older than ${retentionPeriod} months? This cannot be undone.`
        : `Padam semua data lebih lama daripada ${retentionPeriod} bulan? Ini tidak boleh dibatalkan.`
    )) return;

    try {
      const response = await fetch('/api/admin/retention', {
        method: 'DELETE',
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(
          language === 'en'
            ? `Deleted ${result.deletedCount} old records`
            : `Padam ${result.deletedCount} rekod lama`
        );
        fetchData();
      } else {
        toast.error(
          language === 'en'
            ? 'Failed to cleanup old data'
            : 'Gagal membersihkan data lama'
        );
      }
    } catch (error) {
      console.error('Failed to cleanup:', error);
      toast.error(
        language === 'en'
          ? 'An error occurred'
          : 'Ralat berlaku'
      );
    }
  };

  const distribution = stats?.distribution || { guardian: 0, rational: 0, idealist: 0, artisan: 0 };
  const departments = stats?.departments?.map(d => d.department).filter(Boolean) || [];
  const recommendations = getTrainingRecommendations(distribution, language);

  const exportToCSV = () => {
    const headers = [
      language === 'en' ? 'Name' : 'Nama',
      language === 'en' ? 'Email' : 'E-mel',
      language === 'en' ? 'Department' : 'Jabatan',
      language === 'en' ? 'Personality Type' : 'Jenis Personaliti',
      language === 'en' ? 'Secondary Type' : 'Jenis Kedua',
      'MBTI',
      language === 'en' ? 'Hybrid' : 'Hibrid',
      language === 'en' ? 'Guardian Score' : 'Skor Guardian',
      language === 'en' ? 'Rational Score' : 'Skor Rational',
      language === 'en' ? 'Idealist Score' : 'Skor Idealist',
      language === 'en' ? 'Artisan Score' : 'Skor Artisan',
      language === 'en' ? 'Date' : 'Tarikh'
    ];
    const rows = participants.map(p => [
      p.full_name,
      p.email,
      p.department || '-',
      personalityTypeData[p.dominant_type].name[language],
      personalityTypeData[p.secondary_type].name[language],
      p.mbti_code,
      p.is_hybrid ? (language === 'en' ? 'Yes' : 'Ya') : (language === 'en' ? 'No' : 'Tidak'),
      `${p.guardian_score}%`,
      `${p.rational_score}%`,
      `${p.idealist_score}%`,
      `${p.artisan_score}%`,
      new Date(p.created_at).toLocaleDateString()
    ]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `keirsey-assessment-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ms' : 'en');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-6 py-10 max-w-[1600px]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              {language === 'en' ? 'Admin Panel' : 'Panel Pentadbir'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {language === 'en' ? 'Manage assessments and view analytics' : 'Urus penilaian dan lihat analitik'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center gap-2"
            >
              <Globe className="h-4 w-4" />
              {language === 'en' ? 'BM' : 'EN'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchData}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  {t('admin.export', language)}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={exportToCSV}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  {t('admin.exportExcel', language)}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.print()}>
                  <FileText className="h-4 w-4 mr-2" />
                  {t('admin.exportPdf', language)}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              {language === 'en' ? 'Logout' : 'Log Keluar'}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="participants">
          <TabsList className="mb-6">
            <TabsTrigger value="participants" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {t('admin.participants', language)}
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              {t('admin.analytics', language)}
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              {t('admin.settings', language)}
            </TabsTrigger>
          </TabsList>

          {/* Participants Tab */}
          <TabsContent value="participants">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{language === 'en' ? 'Total' : 'Jumlah'}</p>
                      <p className="text-2xl font-bold">{stats?.totalParticipants || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {(['guardian', 'rational', 'idealist', 'artisan'] as PersonalityType[]).map(type => (
                <Card key={type}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="p-2 rounded-lg" 
                        style={{ backgroundColor: `${personalityTypeColors[type]}20` }}
                      >
                        <PieChart className="h-5 w-5" style={{ color: personalityTypeColors[type] }} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{personalityTypeData[type].name[language]}</p>
                        <p className="text-2xl font-bold">{distribution[type] || 0}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Filters */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder={t('admin.search', language)}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-full md:w-48">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder={language === 'en' ? 'Filter by type' : 'Tapis mengikut jenis'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{language === 'en' ? 'All Types' : 'Semua Jenis'}</SelectItem>
                      {(['guardian', 'rational', 'idealist', 'artisan'] as PersonalityType[]).map(type => (
                        <SelectItem key={type} value={type}>
                          {personalityTypeData[type].name[language]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder={language === 'en' ? 'Filter by dept' : 'Tapis mengikut jabatan'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{language === 'en' ? 'All Departments' : 'Semua Jabatan'}</SelectItem>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Participants Table */}
            <Card>
              <CardContent className="p-6">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  </div>
                ) : participants.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>{language === 'en' ? 'No participants found' : 'Tiada peserta dijumpai'}</p>
                    <p className="text-sm mt-1">
                      {language === 'en' 
                        ? 'Participants will appear here after completing assessments' 
                        : 'Peserta akan muncul di sini selepas melengkapkan penilaian'}
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{language === 'en' ? 'Name' : 'Nama'}</TableHead>
                        <TableHead>{language === 'en' ? 'Email' : 'E-mel'}</TableHead>
                        <TableHead>{language === 'en' ? 'Department' : 'Jabatan'}</TableHead>
                        <TableHead>{language === 'en' ? 'Type' : 'Jenis'}</TableHead>
                        <TableHead>MBTI</TableHead>
                        <TableHead>{language === 'en' ? 'Date' : 'Tarikh'}</TableHead>
                        <TableHead className="text-right">{language === 'en' ? 'Actions' : 'Tindakan'}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {participants.map((participant) => (
                        <TableRow key={participant.id}>
                          <TableCell className="font-medium">{participant.full_name}</TableCell>
                          <TableCell>{participant.email}</TableCell>
                          <TableCell>{participant.department || '-'}</TableCell>
                          <TableCell>
                            <span 
                              className="px-2 py-1 rounded-full text-xs font-medium text-white"
                              style={{ backgroundColor: personalityTypeColors[participant.dominant_type] }}
                            >
                              {personalityTypeData[participant.dominant_type].name[language]}
                            </span>
                          </TableCell>
                          <TableCell className="font-mono text-sm">{participant.mbti_code}</TableCell>
                          <TableCell>{new Date(participant.created_at).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => setSelectedParticipant(participant)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-600 hover:text-red-700"
                                onClick={() => handleDelete(participant.id)}
                                disabled={isDeleting === participant.id}
                              >
                                {isDeleting === participant.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Distribution Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    {t('admin.groupAnalytics', language)}
                  </CardTitle>
                  <CardDescription>
                    {language === 'en' ? 'Personality type distribution across all participants' : 'Taburan jenis personaliti merentas semua peserta'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {stats?.totalParticipants === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>{language === 'en' ? 'No data available yet' : 'Tiada data tersedia lagi'}</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {(['guardian', 'rational', 'idealist', 'artisan'] as PersonalityType[]).map(type => (
                        <div key={type} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{personalityTypeData[type].name[language]}</span>
                            <span>{distribution[type] || 0}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{ 
                                width: `${distribution[type] || 0}%`,
                                backgroundColor: personalityTypeColors[type]
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Training Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    {t('admin.trainingRecommendations', language)}
                    {recommendations.length > 0 && (
                      <Sparkles className="h-4 w-4 text-purple-600 ml-auto" />
                    )}
                  </CardTitle>
                  <CardDescription>
                    {language === 'en' ? 'AI-powered training suggestions based on team composition' : 'Cadangan latihan dikuasakan AI berdasarkan komposisi pasukan'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {recommendations.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>{language === 'en' ? 'Complete more assessments to see AI recommendations' : 'Lengkapkan lebih banyak penilaian untuk melihat cadangan AI'}</p>
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      {recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {index + 1}
                          </div>
                          <span className="text-gray-700 dark:text-gray-300 text-sm">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>

              {/* Department Breakdown */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {language === 'en' ? 'Department Breakdown' : 'Pecahan Jabatan'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!stats?.departments || stats.departments.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>{language === 'en' ? 'No department data available' : 'Tiada data jabatan tersedia'}</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {stats.departments.map(dept => (
                        <div key={dept.department} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <p className="font-medium text-gray-800 dark:text-gray-200">{dept.department}</p>
                          <p className="text-2xl font-bold mt-1">{dept.completed_assessments}</p>
                          <p className="text-xs text-gray-500">{language === 'en' ? 'assessments' : 'penilaian'}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('admin.uploadLogo', language)}</CardTitle>
                  <CardDescription>
                    {language === 'en' ? 'Upload your company logo for branded reports' : 'Muat naik logo syarikat anda untuk laporan berjenama'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {companyLogoUrl && (
                      <div className="border rounded-lg p-4 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                        <img
                          src={companyLogoUrl}
                          alt="Company Logo"
                          className="max-h-24 object-contain"
                        />
                      </div>
                    )}
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setLogoModalOpen(true)}
                    >
                      {companyLogoUrl
                        ? (language === 'en' ? 'Change Logo' : 'Tukar Logo')
                        : (language === 'en' ? 'Upload Logo' : 'Muat Naik Logo')}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('admin.dataRetention', language)}</CardTitle>
                  <CardDescription>
                    {language === 'en' ? 'Configure how long participant data is retained' : 'Konfigurasi berapa lama data peserta disimpan'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">
                        {language === 'en' ? 'Retention Period' : 'Tempoh Penyimpanan'}
                      </label>
                      <Select value={retentionPeriod} onValueChange={setRetentionPeriod}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="6">{language === 'en' ? '6 months' : '6 bulan'}</SelectItem>
                          <SelectItem value="12">{language === 'en' ? '12 months' : '12 bulan'}</SelectItem>
                          <SelectItem value="24">{language === 'en' ? '24 months' : '24 bulan'}</SelectItem>
                          <SelectItem value="36">{language === 'en' ? '36 months' : '36 bulan'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Button className="w-full" onClick={handleSaveRetention}>
                        {t('common.save', language)}
                      </Button>
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={handleCleanupOldData}
                      >
                        {language === 'en' ? 'Delete Old Data Now' : 'Padam Data Lama Sekarang'}
                      </Button>
                      <p className="text-xs text-gray-500 text-center">
                        {language === 'en'
                          ? 'Data older than the retention period will be permanently deleted'
                          : 'Data lebih lama daripada tempoh penyimpanan akan dipadam secara kekal'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Modals */}
        {selectedParticipant && (
          <ParticipantDetailsModal
            open={!!selectedParticipant}
            onOpenChange={(open) => !open && setSelectedParticipant(null)}
            participant={selectedParticipant}
            language={language}
          />
        )}

        {participantToDelete && (
          <DeleteConfirmationModal
            open={deleteConfirmOpen}
            onOpenChange={setDeleteConfirmOpen}
            onConfirm={confirmDelete}
            participantName={participantToDelete.full_name}
            language={language}
            isDeleting={isDeleting === participantToDelete.id}
          />
        )}

        <CompanyLogoModal
          open={logoModalOpen}
          onOpenChange={setLogoModalOpen}
          currentLogoUrl={companyLogoUrl}
          language={language}
          onLogoUpdated={(url) => {
            setCompanyLogoUrl(url);
            toast.success(
              language === 'en'
                ? 'Logo updated successfully'
                : 'Logo berjaya dikemas kini'
            );
          }}
        />
      </div>
    </div>
  );
}
