'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Language, PersonalityType } from '@/lib/types';
import { personalityTypeColors, personalityTypeData } from '@/lib/personality-data';

interface ActiveFilters {
  organization?: string;
  department?: string;
  type?: string;
  search?: string;
}

interface AdminPDFExportProps {
  stats: {
    totalParticipants: number;
    completedAssessments: number;
    distribution: Record<PersonalityType, number>;
    departments: Array<{ department: string; participant_count: number; completed_assessments: number }>;
  };
  participants: any[];
  language: Language;
  companyLogoUrl?: string;
  recommendations?: string[];
  fetchAllParticipants?: () => Promise<any[]>;
  activeFilters?: ActiveFilters;
}

export function AdminPDFExport({ stats, participants, language, companyLogoUrl, recommendations, fetchAllParticipants, activeFilters }: AdminPDFExportProps) {
  const [isExporting, setIsExporting] = useState(false);

  const generatePDF = async () => {
    setIsExporting(true);

    // Fetch ALL filtered participants for the export (not just current page)
    let allParticipants = participants;
    if (fetchAllParticipants) {
      try {
        allParticipants = await fetchAllParticipants();
      } catch {
        allParticipants = participants;
      }
    }
    const distribution = stats.distribution || { guardian: 0, rational: 0, idealist: 0, artisan: 0 };
    const sortedDistribution = Object.entries(distribution)
      .sort(([, a], [, b]) => b - a)
      .map(([type, percentage]) => ({
        type: type as PersonalityType,
        percentage,
        name: personalityTypeData[type as PersonalityType].name[language],
        color: personalityTypeColors[type as PersonalityType],
      }));

    // Build active filter labels for the report header
    const hasActiveFilters = activeFilters && (activeFilters.organization || activeFilters.department || activeFilters.type || activeFilters.search);
    const filterLabels: string[] = [];
    if (activeFilters?.organization) {
      filterLabels.push(`${language === 'en' ? 'Organisation' : 'Organisasi'}: ${activeFilters.organization}`);
    }
    if (activeFilters?.department) {
      filterLabels.push(`${language === 'en' ? 'Department' : 'Jabatan'}: ${activeFilters.department}`);
    }
    if (activeFilters?.type) {
      const typeName = personalityTypeData[activeFilters.type as PersonalityType]?.name[language] || activeFilters.type;
      filterLabels.push(`${language === 'en' ? 'Type' : 'Jenis'}: ${typeName}`);
    }
    if (activeFilters?.search) {
      filterLabels.push(`${language === 'en' ? 'Search' : 'Carian'}: "${activeFilters.search}"`);
    }

    const recs = recommendations || [];

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${language === 'en' ? 'Assessment Analytics Report' : 'Laporan Analitik Penilaian'}</title>
  <style>
    @page {
      margin: 20mm;
      size: A4;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      print-color-adjust: exact;
      -webkit-print-color-adjust: exact;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 20px;
      border-bottom: 3px solid #2563eb;
      margin-bottom: 30px;
    }
    .logo-container {
      max-width: 150px;
      max-height: 80px;
    }
    .logo {
      max-width: 100%;
      max-height: 80px;
      object-fit: contain;
    }
    .header-info h1 {
      margin: 0;
      font-size: 28px;
      color: #1e40af;
      font-weight: 700;
    }
    .header-info p {
      margin: 5px 0 0 0;
      color: #6b7280;
      font-size: 14px;
    }
    .filter-banner {
      background: linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%);
      border: 1px solid #bfdbfe;
      border-radius: 8px;
      padding: 12px 18px;
      margin-bottom: 25px;
      font-size: 13px;
    }
    .filter-banner strong {
      color: #1e40af;
    }
    .filter-tag {
      display: inline-block;
      background: #2563eb;
      color: white;
      padding: 3px 10px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      margin: 2px 4px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin-bottom: 30px;
    }
    .stat-card {
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      padding: 20px;
      border-radius: 12px;
      border-left: 4px solid #2563eb;
    }
    .stat-card h3 {
      margin: 0 0 10px 0;
      font-size: 14px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .stat-card .value {
      font-size: 36px;
      font-weight: 700;
      color: #1e40af;
      margin: 0;
    }
    .section {
      margin-bottom: 40px;
      page-break-inside: avoid;
    }
    .section-title {
      font-size: 22px;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 2px solid #e5e7eb;
    }
    .distribution-item {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      padding: 0;
    }
    .distribution-label {
      flex: 0 0 140px;
      font-weight: 700;
      font-size: 15px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .type-icon {
      width: 24px;
      height: 24px;
      border-radius: 4px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      color: white;
      font-weight: 700;
    }
    .distribution-bar-container {
      flex: 1;
      height: 40px;
      background: #f3f4f6;
      border-radius: 8px;
      overflow: hidden;
      margin: 0 15px;
      position: relative;
      box-shadow: inset 0 2px 4px rgba(0,0,0,0.06);
    }
    .distribution-bar {
      height: 100%;
      transition: width 0.3s;
      display: flex;
      align-items: center;
      padding-left: 12px;
      color: white;
      font-weight: 700;
      font-size: 15px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .distribution-percentage {
      flex: 0 0 70px;
      text-align: right;
      font-weight: 800;
      font-size: 18px;
    }
    .participants-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
      font-size: 12px;
    }
    .participants-table thead {
      background: #1e40af;
      color: white;
    }
    .participants-table th {
      padding: 12px 8px;
      text-align: left;
      font-weight: 600;
    }
    .participants-table tbody tr {
      border-bottom: 1px solid #e5e7eb;
    }
    .participants-table tbody tr:nth-child(even) {
      background: #f9fafb;
    }
    .participants-table td {
      padding: 10px 8px;
    }
    .type-badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      color: white;
    }
    .rec-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 14px 16px;
      margin-bottom: 12px;
      background: linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%);
      border-radius: 10px;
      border-left: 4px solid #7c3aed;
    }
    .rec-number {
      width: 28px;
      height: 28px;
      min-width: 28px;
      border-radius: 50%;
      background: linear-gradient(135deg, #2563eb, #7c3aed);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 700;
    }
    .rec-text {
      color: #374151;
      font-size: 14px;
      line-height: 1.6;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
      font-size: 12px;
    }
    .page-break {
      page-break-before: always;
    }
  </style>
</head>
<body>
  <!-- Header -->
  <div class="header">
    <div class="header-info">
      <h1>${language === 'en' ? 'Keirsey Personality Assessment Report' : 'Laporan Penilaian Personaliti Keirsey'}</h1>
      <p>${language === 'en' ? 'Prepared for HR / Management Review' : 'Disediakan untuk Semakan HR / Pengurusan'}</p>
      <p>${language === 'en' ? 'Generated on' : 'Dijana pada'} ${new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'ms-MY', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}</p>
    </div>
    ${companyLogoUrl ? `
    <div class="logo-container">
      <img src="${companyLogoUrl}" alt="Company Logo" class="logo" />
    </div>
    ` : ''}
  </div>

  ${hasActiveFilters ? `
  <!-- Active Filters Banner -->
  <div class="filter-banner">
    <strong>${language === 'en' ? 'Report Filters Applied:' : 'Penapis Laporan Digunakan:'}</strong>
    ${filterLabels.map(label => `<span class="filter-tag">${label}</span>`).join(' ')}
    <p style="margin: 6px 0 0 0; color: #6b7280; font-size: 12px;">
      ${language === 'en'
        ? 'This report contains only data matching the above filters.'
        : 'Laporan ini mengandungi hanya data yang sepadan dengan penapis di atas.'}
    </p>
  </div>
  ` : ''}

  <!-- 1. Introduction -->
  <div class="section">
    <h2 class="section-title">${language === 'en' ? '1. Introduction & Purpose' : '1. Pengenalan & Tujuan'}</h2>
    <p style="color: #374151; font-size: 14px; line-height: 1.8;">
      ${language === 'en' 
        ? 'This report presents the findings from the Keirsey Personality Assessment conducted for the organisation. The purpose of this assessment is to help HR, management, and training teams understand the personality composition of the workforce, enabling more effective team building, communication strategies, and professional development planning.'
        : 'Laporan ini membentangkan penemuan daripada Penilaian Personaliti Keirsey yang dijalankan untuk organisasi. Tujuan penilaian ini adalah untuk membantu HR, pengurusan, dan pasukan latihan memahami komposisi personaliti tenaga kerja, membolehkan pembinaan pasukan, strategi komunikasi, dan perancangan pembangunan profesional yang lebih berkesan.'}
    </p>
  </div>

  <!-- 2. About Keirsey Theory -->
  <div class="section">
    <h2 class="section-title">${language === 'en' ? '2. About Keirsey Temperament Theory' : '2. Mengenai Teori Perangai Keirsey'}</h2>
    <p style="color: #374151; font-size: 14px; line-height: 1.8; margin-bottom: 15px;">
      ${language === 'en'
        ? 'The Keirsey Temperament Sorter, developed by Dr. David Keirsey, categorises individuals into four primary temperament types based on observable behaviour patterns. Each type reflects distinct communication styles, work preferences, and interpersonal strengths:'
        : 'Pengisih Perangai Keirsey, dibangunkan oleh Dr. David Keirsey, mengkategorikan individu kepada empat jenis perangai utama berdasarkan corak tingkah laku yang boleh diperhatikan. Setiap jenis mencerminkan gaya komunikasi, keutamaan kerja, dan kekuatan interpersonal yang berbeza:'}
    </p>
    <table class="participants-table" style="margin-bottom: 0;">
      <thead><tr>
        <th style="width: 25%;">${language === 'en' ? 'Temperament' : 'Perangai'}</th>
        <th>${language === 'en' ? 'Key Characteristics' : 'Ciri-ciri Utama'}</th>
      </tr></thead>
      <tbody>
        <tr>
          <td><span class="type-badge" style="background-color: ${personalityTypeColors.guardian}">${personalityTypeData.guardian.name[language]}</span></td>
          <td style="font-size: 13px;">${language === 'en' ? 'Dependable, detail-oriented, loyal. Excel in roles requiring stability, process management, and compliance.' : 'Boleh dipercayai, teliti, setia. Cemerlang dalam peranan yang memerlukan kestabilan, pengurusan proses, dan pematuhan.'}</td>
        </tr>
        <tr>
          <td><span class="type-badge" style="background-color: ${personalityTypeColors.rational}">${personalityTypeData.rational.name[language]}</span></td>
          <td style="font-size: 13px;">${language === 'en' ? 'Strategic, analytical, innovative. Excel in roles requiring problem-solving, research, and systems design.' : 'Strategik, analitikal, inovatif. Cemerlang dalam peranan yang memerlukan penyelesaian masalah, penyelidikan, dan reka bentuk sistem.'}</td>
        </tr>
        <tr>
          <td><span class="type-badge" style="background-color: ${personalityTypeColors.idealist}">${personalityTypeData.idealist.name[language]}</span></td>
          <td style="font-size: 13px;">${language === 'en' ? 'Empathetic, inspiring, growth-oriented. Excel in roles requiring coaching, counselling, and team motivation.' : 'Empatik, memberi inspirasi, berorientasikan pertumbuhan. Cemerlang dalam peranan yang memerlukan bimbingan, kaunseling, dan motivasi pasukan.'}</td>
        </tr>
        <tr>
          <td><span class="type-badge" style="background-color: ${personalityTypeColors.artisan}">${personalityTypeData.artisan.name[language]}</span></td>
          <td style="font-size: 13px;">${language === 'en' ? 'Adaptable, action-oriented, resourceful. Excel in roles requiring flexibility, crisis management, and hands-on work.' : 'Boleh menyesuaikan diri, berorientasikan tindakan, bijak. Cemerlang dalam peranan yang memerlukan fleksibiliti, pengurusan krisis, dan kerja praktikal.'}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- 3. Summary Stats -->
  <div class="section">
    <h2 class="section-title">${language === 'en' ? '3. Overall Summary' : '3. Ringkasan Keseluruhan'}</h2>
    <div class="stats-grid">
      <div class="stat-card">
        <h3>${language === 'en' ? 'Total Participants' : 'Jumlah Peserta'}</h3>
        <p class="value">${stats.totalParticipants}</p>
      </div>
      <div class="stat-card">
        <h3>${language === 'en' ? 'Completed Assessments' : 'Penilaian Selesai'}</h3>
        <p class="value">${stats.completedAssessments}</p>
      </div>
    </div>
  </div>

  <!-- 4. Personality Distribution -->
  <div class="section">
    <h2 class="section-title">${language === 'en' ? '4. Personality Type Distribution' : '4. Taburan Jenis Personaliti'}</h2>
    <p style="color: #6b7280; margin-bottom: 20px; font-size: 14px;">
      ${language === 'en' 
        ? (hasActiveFilters ? 'Distribution of dominant personality types among filtered participants' : 'Distribution of dominant personality types among all participants')
        : (hasActiveFilters ? 'Taburan jenis personaliti dominan di kalangan peserta yang ditapis' : 'Taburan jenis personaliti dominan di kalangan semua peserta')}
    </p>
    ${sortedDistribution.map(({ type, name, percentage, color }) => {
      const icons: Record<string, string> = {
        guardian: 'G',
        rational: 'R',
        idealist: 'I',
        artisan: 'A'
      };
      const barLabel = percentage > 12 ? percentage.toFixed(0) + '%' : '';
      return '<div class="distribution-item">'
        + '<div class="distribution-label" style="color: ' + color + '">'
        + '<span class="type-icon" style="background-color: ' + color + '">' + icons[type] + '</span>'
        + '<span>' + name + '</span>'
        + '</div>'
        + '<div class="distribution-bar-container">'
        + '<div class="distribution-bar" style="width: ' + percentage + '%; background: linear-gradient(90deg, ' + color + ' 0%, ' + color + 'dd 100%)">'
        + barLabel
        + '</div>'
        + '</div>'
        + '<div class="distribution-percentage" style="color: ' + color + '">' + percentage.toFixed(0) + '%</div>'
        + '</div>';
    }).join('')}
  </div>

  ${stats.departments && stats.departments.length > 0 ? `
  <!-- 5. Department Breakdown -->
  <div class="section">
    <h2 class="section-title">${language === 'en' ? '5. Department Breakdown' : '5. Pecahan Jabatan'}</h2>
    <table class="participants-table">
      <thead>
        <tr>
          <th>${language === 'en' ? 'Department' : 'Jabatan'}</th>
          <th style="text-align: center;">${language === 'en' ? 'Participants' : 'Peserta'}</th>
          <th style="text-align: center;">${language === 'en' ? 'Assessments' : 'Penilaian'}</th>
        </tr>
      </thead>
      <tbody>
        ${stats.departments.map(dept => `
          <tr>
            <td><strong>${dept.department || (language === 'en' ? 'Not Specified' : 'Tidak Dinyatakan')}</strong></td>
            <td style="text-align: center;">${dept.participant_count}</td>
            <td style="text-align: center;">${dept.completed_assessments}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
  ` : ''}

  ${allParticipants && allParticipants.length > 0 ? `
  <!-- 6. Participant Details -->
  <div class="section page-break">
    <h2 class="section-title">${language === 'en' ? '6. Individual Participant Analysis' : '6. Analisis Peserta Individu'}</h2>
    <table class="participants-table">
      <thead>
        <tr>
          <th>${language === 'en' ? 'Name' : 'Nama'}</th>
          <th>${language === 'en' ? 'Organisation' : 'Organisasi'}</th>
          <th>${language === 'en' ? 'Department' : 'Jabatan'}</th>
          <th>${language === 'en' ? 'Type' : 'Jenis'}</th>
          <th>MBTI</th>
          <th style="text-align: center;">${language === 'en' ? 'Date' : 'Tarikh'}</th>
        </tr>
      </thead>
      <tbody>
        ${allParticipants.map((p: any) => {
          const typeColor = personalityTypeColors[p.dominant_type as PersonalityType];
          const typeName = personalityTypeData[p.dominant_type as PersonalityType].name[language];
          return `
          <tr>
            <td><strong>${p.full_name}</strong></td>
            <td>${p.organization || '-'}</td>
            <td>${p.department || '-'}</td>
            <td>
              <span class="type-badge" style="background-color: ${typeColor}">
                ${typeName}
              </span>
            </td>
            <td style="font-family: monospace; font-weight: 600;">${p.mbti_code || '-'}</td>
            <td style="text-align: center;">${new Date(p.created_at).toLocaleDateString()}</td>
          </tr>
        `;
        }).join('')}
      </tbody>
    </table>
  </div>
  ` : ''}

  <!-- 7. Conclusion -->
  <div class="section page-break">
    <h2 class="section-title">${language === 'en' ? '7. Conclusion & Recommendations' : '7. Kesimpulan & Cadangan'}</h2>
    <p style="color: #374151; font-size: 14px; line-height: 1.8; margin-bottom: 15px;">
      ${language === 'en'
        ? 'Based on the assessment results, the following observations and recommendations are provided for HR and management consideration:'
        : 'Berdasarkan keputusan penilaian, pemerhatian dan cadangan berikut disediakan untuk pertimbangan HR dan pengurusan:'}
    </p>
    <ul style="color: #374151; font-size: 14px; line-height: 2; padding-left: 20px;">
      <li>${language === 'en'
        ? 'The personality distribution provides insight into team dynamics and communication preferences across the organisation.'
        : 'Taburan personaliti memberikan pandangan tentang dinamik pasukan dan keutamaan komunikasi di seluruh organisasi.'}</li>
      <li>${language === 'en'
        ? 'Consider leveraging the dominant personality types when assigning roles and forming project teams.'
        : 'Pertimbangkan untuk memanfaatkan jenis personaliti dominan ketika memberikan peranan dan membentuk pasukan projek.'}</li>
      <li>${language === 'en'
        ? 'Training programs can be tailored based on the temperament mix to maximise engagement and effectiveness.'
        : 'Program latihan boleh disesuaikan berdasarkan campuran perangai untuk memaksimumkan penglibatan dan keberkesanan.'}</li>
      <li>${language === 'en'
        ? 'Individual results should be used as a development tool, not as a basis for performance evaluation.'
        : 'Keputusan individu harus digunakan sebagai alat pembangunan, bukan sebagai asas untuk penilaian prestasi.'}</li>
    </ul>

    ${recs.length > 0 ? `
    <h3 style="font-size: 18px; font-weight: 700; color: #1f2937; margin-top: 30px; margin-bottom: 15px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
      ${language === 'en' ? 'Recommended Training / Development Programmes' : 'Program Latihan / Pembangunan Yang Disyorkan'}
    </h3>
    <p style="color: #374151; font-size: 14px; line-height: 1.8; margin-bottom: 18px;">
      ${language === 'en'
        ? 'Based on the personality type distribution of this group, the following AI-generated training and development programmes are recommended:'
        : 'Berdasarkan taburan jenis personaliti kumpulan ini, program latihan dan pembangunan yang dijana AI berikut disyorkan:'}
    </p>
    ${recs.map((rec, index) => '<div class="rec-item"><div class="rec-number">' + (index + 1) + '</div><div class="rec-text">' + rec + '</div></div>').join('')}
    <p style="color: #6b7280; font-size: 12px; font-style: italic; margin-top: 15px; padding: 10px 14px; background: #f9fafb; border-radius: 6px;">
      ${language === 'en'
        ? 'Note: These recommendations are AI-generated based on the group personality profile. HR and facilitators may adjust as needed.'
        : 'Nota: Cadangan ini dijana AI berdasarkan profil personaliti kumpulan. HR dan fasilitator boleh menyesuaikan mengikut keperluan.'}
    </p>
    ` : ''}

    <p style="color: #6b7280; font-size: 13px; font-style: italic; margin-top: 25px; padding: 15px; background: #f9fafb; border-radius: 8px;">
      ${language === 'en'
        ? 'Disclaimer: This assessment is based on the Keirsey Temperament Sorter framework. Results should be interpreted as general tendencies rather than absolute classifications. Individual behaviour may vary depending on context and circumstances.'
        : 'Penafian: Penilaian ini berdasarkan rangka kerja Pengisih Perangai Keirsey. Keputusan harus ditafsirkan sebagai kecenderungan umum dan bukan klasifikasi mutlak. Tingkah laku individu mungkin berbeza bergantung pada konteks dan keadaan.'}
    </p>
  </div>

  <!-- Footer -->
  <div class="footer">
    <p><strong>${language === 'en' ? 'Keirsey Personality Assessment' : 'Penilaian Personaliti Keirsey'}</strong></p>
    <p>© 2026 ${language === 'en' ? 'All Rights Reserved' : 'Hak Cipta Terpelihara'}</p>
  </div>
</body>
</html>
    `;

    sessionStorage.setItem('admin_report_html_draft', htmlContent);
    const editorWindow = window.open('/admin/report-editor', '_blank');
    if (!editorWindow) {
      alert(language === 'en' ? 'Please allow popups to open report editor' : 'Sila benarkan popup untuk membuka editor laporan');
    }
    setIsExporting(false);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={generatePDF}
        disabled={isExporting}
        className="flex items-center gap-2 h-9 px-3"
      >
        <Download className="h-4 w-4" />
        {isExporting
          ? (language === 'en' ? 'Preparing editor...' : 'Menyediakan editor...')
          : (language === 'en' ? 'Export PDF' : 'Eksport PDF')}
      </Button>
    </div>
  );
}
