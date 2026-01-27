import { Language } from './types'

export const translations: Record<string, Record<Language, string>> = {
  // App Title
  'app.title': {
    en: 'Keirsey Personality Assessment',
    ms: 'Penilaian Personaliti Keirsey',
  },
  'app.subtitle': {
    en: 'Discover Your Temperament Type',
    ms: 'Temui Jenis Temperamen Anda',
  },

  // Registration Page
  'registration.title': {
    en: 'Participant Registration',
    ms: 'Pendaftaran Peserta',
  },
  'registration.subtitle': {
    en: 'Please fill in your details to begin the assessment',
    ms: 'Sila isikan butiran anda untuk memulakan penilaian',
  },
  'registration.fullName': {
    en: 'Full Name',
    ms: 'Nama Penuh',
  },
  'registration.phone': {
    en: 'Mobile Phone Number',
    ms: 'Nombor Telefon Bimbit',
  },
  'registration.email': {
    en: 'Email Address',
    ms: 'Alamat E-mel',
  },
  'registration.jobTitle': {
    en: 'Current Job Title/Position',
    ms: 'Jawatan Semasa',
  },
  'registration.department': {
    en: 'Department (Optional)',
    ms: 'Jabatan (Pilihan)',
  },
  'registration.consent': {
    en: 'I consent to the collection and processing of my data for assessment purposes.',
    ms: 'Saya bersetuju dengan pengumpulan dan pemprosesan data saya untuk tujuan penilaian.',
  },
  'registration.start': {
    en: 'Start Assessment',
    ms: 'Mulakan Penilaian',
  },
  'registration.language': {
    en: 'Select Language',
    ms: 'Pilih Bahasa',
  },

  // Assessment Page
  'assessment.question': {
    en: 'Question',
    ms: 'Soalan',
  },
  'assessment.of': {
    en: 'of',
    ms: 'daripada',
  },
  'assessment.next': {
    en: 'Next',
    ms: 'Seterusnya',
  },
  'assessment.previous': {
    en: 'Previous',
    ms: 'Sebelumnya',
  },
  'assessment.submit': {
    en: 'Submit Assessment',
    ms: 'Hantar Penilaian',
  },
  'assessment.progress': {
    en: 'Progress',
    ms: 'Kemajuan',
  },
  'assessment.selectOption': {
    en: 'Please select an option to continue',
    ms: 'Sila pilih satu pilihan untuk meneruskan',
  },
  'assessment.autoSaved': {
    en: 'Progress auto-saved',
    ms: 'Kemajuan disimpan automatik',
  },

  // Results Page
  'results.title': {
    en: 'Your Personality Type Is',
    ms: 'Jenis Personaliti Anda Adalah',
  },
  'results.hybrid': {
    en: 'Hybrid',
    ms: 'Hibrid',
  },
  'results.strongPreference': {
    en: 'Strong Preference',
    ms: 'Keutamaan Kuat',
  },
  'results.breakdown': {
    en: 'Personality Breakdown',
    ms: 'Pecahan Personaliti',
  },
  'results.viewDetails': {
    en: 'View Detailed Analysis',
    ms: 'Lihat Analisis Terperinci',
  },

  // Deep Dive Analysis
  'analysis.title': {
    en: 'Deep Dive Analysis',
    ms: 'Analisis Mendalam',
  },
  'analysis.strengths': {
    en: 'Strengths',
    ms: 'Kelebihan',
  },
  'analysis.weaknesses': {
    en: 'Weaknesses',
    ms: 'Kelemahan',
  },
  'analysis.careers': {
    en: 'Career & Organization',
    ms: 'Kerjaya & Organisasi',
  },
  'analysis.approach': {
    en: 'Approach Strategies',
    ms: 'Strategi Pendekatan',
  },
  'analysis.dos': {
    en: "Do's",
    ms: 'Perlu Dilakukan',
  },
  'analysis.donts': {
    en: "Don'ts",
    ms: 'Perlu Dielakkan',
  },
  'analysis.downloadPdf': {
    en: 'Download PDF Report',
    ms: 'Muat Turun Laporan PDF',
  },

  // Personality Types
  'type.guardian': {
    en: 'Guardian',
    ms: 'Penguasa',
  },
  'type.rational': {
    en: 'Rational',
    ms: 'Pemikir',
  },
  'type.idealist': {
    en: 'Idealist',
    ms: 'Pemulihara',
  },
  'type.artisan': {
    en: 'Artisan',
    ms: 'Penghibur',
  },

  // Admin Panel
  'admin.title': {
    en: 'Admin Dashboard',
    ms: 'Papan Pemuka Pentadbir',
  },
  'admin.participants': {
    en: 'Participants',
    ms: 'Peserta',
  },
  'admin.questions': {
    en: 'Questions',
    ms: 'Soalan',
  },
  'admin.analytics': {
    en: 'Analytics',
    ms: 'Analitik',
  },
  'admin.settings': {
    en: 'Settings',
    ms: 'Tetapan',
  },
  'admin.export': {
    en: 'Export',
    ms: 'Eksport',
  },
  'admin.exportExcel': {
    en: 'Export to Excel',
    ms: 'Eksport ke Excel',
  },
  'admin.exportPdf': {
    en: 'Export to PDF',
    ms: 'Eksport ke PDF',
  },
  'admin.filter': {
    en: 'Filter',
    ms: 'Tapis',
  },
  'admin.search': {
    en: 'Search',
    ms: 'Cari',
  },
  'admin.groupAnalytics': {
    en: 'Group Analytics Summary',
    ms: 'Ringkasan Analitik Kumpulan',
  },
  'admin.trainingRecommendations': {
    en: 'Training Recommendations',
    ms: 'Cadangan Latihan',
  },
  'admin.dataRetention': {
    en: 'Data Retention Policy',
    ms: 'Polisi Penyimpanan Data',
  },
  'admin.uploadLogo': {
    en: 'Upload Company Logo',
    ms: 'Muat Naik Logo Syarikat',
  },

  // Common
  'common.loading': {
    en: 'Loading...',
    ms: 'Memuatkan...',
  },
  'common.error': {
    en: 'An error occurred',
    ms: 'Ralat berlaku',
  },
  'common.save': {
    en: 'Save',
    ms: 'Simpan',
  },
  'common.cancel': {
    en: 'Cancel',
    ms: 'Batal',
  },
  'common.delete': {
    en: 'Delete',
    ms: 'Padam',
  },
  'common.edit': {
    en: 'Edit',
    ms: 'Sunting',
  },
  'common.view': {
    en: 'View',
    ms: 'Lihat',
  },
  'common.back': {
    en: 'Back',
    ms: 'Kembali',
  },
  'common.english': {
    en: 'English',
    ms: 'English',
  },
  'common.malay': {
    en: 'Bahasa Melayu',
    ms: 'Bahasa Melayu',
  },
}

export function t(key: string, lang: Language): string {
  return translations[key]?.[lang] || key
}
