import OpenAI from 'openai';
import { Language, PersonalityType } from './types';

// ============================================
// AI SERVICE ABSTRACTION LAYER
// Easy to switch between OpenAI, Gemini, etc.
// ============================================

export interface AIProvider {
  generatePersonalityInsights(params: InsightParams): Promise<AIInsightResponse>;
  generateTrainingRecommendations(params: TrainingParams): Promise<string[]>;
}

export interface InsightParams {
  dominantType: PersonalityType;
  secondaryType: PersonalityType;
  scores: {
    guardian: number;
    rational: number;
    idealist: number;
    artisan: number;
  };
  isHybrid: boolean;
  language: Language;
  jobTitle?: string;
  department?: string;
}

export interface TrainingParams {
  distribution: Record<PersonalityType, number>;
  language: Language;
}

export interface AIInsightResponse {
  strengths: string[];
  weaknesses: string[];
  careerSuggestions: string[];
  approachDos: string[];
  approachDonts: string[];
}

// ============================================
// OPENAI PROVIDER
// ============================================

class OpenAIProvider implements AIProvider {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  async generatePersonalityInsights(params: InsightParams): Promise<AIInsightResponse> {
    const { dominantType, secondaryType, scores, isHybrid, language, jobTitle, department } = params;

    const typeNames = {
      guardian: language === 'en' ? 'Guardian (Penguasa)' : 'Penguasa (Guardian)',
      rational: language === 'en' ? 'Rational (Pemikir)' : 'Pemikir (Rational)',
      idealist: language === 'en' ? 'Idealist (Pemulihara)' : 'Pemulihara (Idealist)',
      artisan: language === 'en' ? 'Artisan (Penghibur)' : 'Penghibur (Artisan)',
    };

    const systemPrompt = language === 'en' 
      ? `You are a professional workplace personality assessment advisor. Generate insights based on Keirsey Temperament Theory. Your tone must be professional, workplace-friendly, non-clinical, and non-judgmental. Do not produce discriminatory or sensitive personal claims. Focus on workplace behaviors and team dynamics.`
      : `Anda adalah penasihat penilaian personaliti profesional di tempat kerja. Hasilkan pandangan berdasarkan Teori Temperamen Keirsey. Nada anda mestilah profesional, mesra di tempat kerja, tidak klinikal, dan tidak menghakimi. Jangan menghasilkan dakwaan diskriminasi atau sensitif peribadi. Fokus pada tingkah laku di tempat kerja dan dinamik pasukan.`;

    const userPrompt = language === 'en'
      ? `Generate personality insights for a workplace assessment:

**Personality Profile:**
- Dominant Type: ${typeNames[dominantType]} (${scores[dominantType]}%)
- Secondary Type: ${typeNames[secondaryType]} (${scores[secondaryType]}%)
- Hybrid: ${isHybrid ? 'Yes' : 'No'}
${jobTitle ? `- Job Title: ${jobTitle}` : ''}
${department ? `- Department: ${department}` : ''}

**Full Scores:**
- Guardian: ${scores.guardian}%
- Rational: ${scores.rational}%
- Idealist: ${scores.idealist}%
- Artisan: ${scores.artisan}%

Generate the following in JSON format:
{
  "strengths": [5 key workplace strengths],
  "weaknesses": [5 areas for improvement or blind spots],
  "careerSuggestions": [5 suitable job types or organizational roles],
  "approachDos": [5 specific do's for managers/colleagues working with this person],
  "approachDonts": [5 specific don'ts for managers/colleagues]
}

Keep all responses concise, actionable, and workplace-focused.`
      : `Hasilkan pandangan personaliti untuk penilaian di tempat kerja:

**Profil Personaliti:**
- Jenis Dominan: ${typeNames[dominantType]} (${scores[dominantType]}%)
- Jenis Sekunder: ${typeNames[secondaryType]} (${scores[secondaryType]}%)
- Hibrid: ${isHybrid ? 'Ya' : 'Tidak'}
${jobTitle ? `- Jawatan: ${jobTitle}` : ''}
${department ? `- Jabatan: ${department}` : ''}

**Skor Penuh:**
- Penguasa: ${scores.guardian}%
- Pemikir: ${scores.rational}%
- Pemulihara: ${scores.idealist}%
- Penghibur: ${scores.artisan}%

Hasilkan yang berikut dalam format JSON:
{
  "strengths": [5 kelebihan utama di tempat kerja],
  "weaknesses": [5 kawasan untuk penambahbaikan atau titik buta],
  "careerSuggestions": [5 jenis pekerjaan atau peranan organisasi yang sesuai],
  "approachDos": [5 perkara yang PATUT dilakukan oleh pengurus/rakan sekerja dengan individu ini],
  "approachDonts": [5 perkara yang TIDAK PATUT dilakukan oleh pengurus/rakan sekerja]
}

Pastikan semua respons ringkas, boleh dilaksanakan, dan fokus kepada tempat kerja.`;

    const response = await this.client.chat.completions.create({
      model: 'gpt-4o-mini', // Lowest cost model
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 1500,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from AI');
    }

    return JSON.parse(content);
  }

  async generateTrainingRecommendations(params: TrainingParams): Promise<string[]> {
    const { distribution, language } = params;

    const recommendations: string[] = [];

    // Logic from PRD
    if (distribution.guardian > 35) {
      recommendations.push(
        language === 'en' 
          ? 'Stress Management Workshop - High Guardian representation indicates need for stress coping strategies'
          : 'Bengkel Pengurusan Tekanan - Perwakilan tinggi Penguasa menunjukkan keperluan untuk strategi mengatasi tekanan'
      );
    }

    if (distribution.rational > 20) {
      recommendations.push(
        language === 'en'
          ? 'Strategic Leadership & Logic Training - Rational thinkers benefit from advanced strategic planning'
          : 'Latihan Kepimpinan Strategik & Logik - Pemikir rasional mendapat manfaat daripada perancangan strategik lanjutan'
      );
    }

    if (distribution.idealist > 20) {
      recommendations.push(
        language === 'en'
          ? 'Communication & Emotional Intelligence - Idealists excel with enhanced interpersonal skills'
          : 'Komunikasi & Kecerdasan Emosi - Pemulihara cemerlang dengan kemahiran interpersonal yang dipertingkatkan'
      );
    }

    if (distribution.artisan > 20) {
      recommendations.push(
        language === 'en'
          ? 'Agility & Innovation Workshop - Artisans thrive in dynamic, creative problem-solving environments'
          : 'Bengkel Ketangkasan & Inovasi - Penghibur berkembang dalam persekitaran penyelesaian masalah yang dinamik dan kreatif'
      );
    }

    return recommendations;
  }
}

// ============================================
// FACTORY FUNCTION
// ============================================

export function createAIProvider(provider: 'openai' | 'gemini' = 'openai'): AIProvider {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('AI API key not configured');
  }

  switch (provider) {
    case 'openai':
      return new OpenAIProvider(apiKey);
    case 'gemini':
      // TODO: Implement Gemini provider when switching
      throw new Error('Gemini provider not yet implemented');
    default:
      return new OpenAIProvider(apiKey);
  }
}

// ============================================
// FALLBACK DATA (Rule-based)
// ============================================

export function getFallbackInsights(dominantType: PersonalityType, language: Language): AIInsightResponse {
  const fallbacks: Record<PersonalityType, Record<Language, AIInsightResponse>> = {
    guardian: {
      en: {
        strengths: [
          'Strong organizational and planning skills',
          'Reliable and responsible team member',
          'Detail-oriented with high quality standards',
          'Excellent at following established procedures',
          'Natural ability to maintain stability and order'
        ],
        weaknesses: [
          'May resist change or new approaches',
          'Can be overly cautious or risk-averse',
          'Might focus too much on rules over flexibility',
          'May struggle with ambiguity',
          'Can be perceived as inflexible'
        ],
        careerSuggestions: [
          'Project Manager',
          'Operations Manager',
          'Quality Assurance Specialist',
          'Compliance Officer',
          'Administrative Leadership'
        ],
        approachDos: [
          'Provide clear instructions and expectations',
          'Respect deadlines and commitments',
          'Use proven methods and best practices',
          'Recognize their reliability and consistency',
          'Give advance notice of changes'
        ],
        approachDonts: [
          'Be vague or change plans without notice',
          'Ignore established procedures',
          'Disregard company hierarchy',
          'Rush decisions without proper planning',
          'Dismiss their attention to detail'
        ]
      },
      ms: {
        strengths: [
          'Kemahiran organisasi dan perancangan yang kuat',
          'Ahli pasukan yang boleh dipercayai dan bertanggungjawab',
          'Berorientasikan perincian dengan piawaian kualiti tinggi',
          'Cemerlang dalam mengikuti prosedur yang ditetapkan',
          'Keupayaan semula jadi untuk mengekalkan kestabilan dan ketenteraman'
        ],
        weaknesses: [
          'Mungkin menentang perubahan atau pendekatan baru',
          'Boleh terlalu berhati-hati atau mengelak risiko',
          'Mungkin terlalu fokus pada peraturan berbanding fleksibiliti',
          'Mungkin bergelut dengan kekaburan',
          'Boleh dilihat sebagai tidak fleksibel'
        ],
        careerSuggestions: [
          'Pengurus Projek',
          'Pengurus Operasi',
          'Pakar Jaminan Kualiti',
          'Pegawai Pematuhan',
          'Kepimpinan Pentadbiran'
        ],
        approachDos: [
          'Berikan arahan dan jangkaan yang jelas',
          'Hormati tarikh akhir dan komitmen',
          'Gunakan kaedah terbukti dan amalan terbaik',
          'Iktiraf kebolehpercayaan dan konsistensi mereka',
          'Beri notis awal tentang perubahan'
        ],
        approachDonts: [
          'Jangan kabur atau ubah rancangan tanpa notis',
          'Abaikan prosedur yang ditetapkan',
          'Abaikan hierarki syarikat',
          'Tergesa-gesa membuat keputusan tanpa perancangan yang betul',
          'Abaikan perhatian mereka terhadap perincian'
        ]
      }
    },
    rational: {
      en: {
        strengths: [
          'Strategic thinking and long-term planning',
          'Analytical problem-solving abilities',
          'Independent and self-directed',
          'Innovative and intellectually curious',
          'Efficient and logic-driven decision making'
        ],
        weaknesses: [
          'May appear cold or detached',
          'Can overlook emotional factors',
          'Might be overly critical',
          'May struggle with small talk',
          'Can be impatient with inefficiency'
        ],
        careerSuggestions: [
          'Strategic Analyst',
          'Systems Architect',
          'Research & Development',
          'Technical Leadership',
          'Business Strategy Consultant'
        ],
        approachDos: [
          'Use data and logic in discussions',
          'Be concise and get to the point',
          'Focus on long-term efficiency',
          'Respect their need for autonomy',
          'Challenge them intellectually'
        ],
        approachDonts: [
          'Use purely emotional arguments',
          'Demand small talk before business',
          'Micromanage their work',
          'Ignore their strategic insights',
          'Present illogical plans'
        ]
      },
      ms: {
        strengths: [
          'Pemikiran strategik dan perancangan jangka panjang',
          'Keupayaan penyelesaian masalah secara analitikal',
          'Bebas dan arahan kendiri',
          'Inovatif dan ingin tahu secara intelektual',
          'Keputusan yang cekap dan didorong oleh logik'
        ],
        weaknesses: [
          'Mungkin kelihatan sejuk atau terpisah',
          'Boleh mengabaikan faktor emosi',
          'Mungkin terlalu kritikal',
          'Mungkin bergelut dengan perbualan ringan',
          'Boleh tidak sabar dengan ketidakcekapan'
        ],
        careerSuggestions: [
          'Penganalisis Strategik',
          'Arkitek Sistem',
          'Penyelidikan & Pembangunan',
          'Kepimpinan Teknikal',
          'Perunding Strategi Perniagaan'
        ],
        approachDos: [
          'Gunakan data dan logik dalam perbincangan',
          'Ringkas dan terus ke perkara utama',
          'Fokus pada kecekapan jangka panjang',
          'Hormati keperluan autonomi mereka',
          'Cabar mereka secara intelektual'
        ],
        approachDonts: [
          'Gunakan hujah emosi semata-mata',
          'Menuntut perbualan ringan sebelum perniagaan',
          'Mikrourus kerja mereka',
          'Abaikan pandangan strategik mereka',
          'Bentangkan rancangan yang tidak logik'
        ]
      }
    },
    idealist: {
      en: {
        strengths: [
          'Excellent interpersonal and communication skills',
          'Empathetic and people-focused',
          'Creative and visionary thinking',
          'Strong team building abilities',
          'Authentic and values-driven'
        ],
        weaknesses: [
          'May take criticism personally',
          'Can be overly idealistic',
          'Might avoid necessary conflict',
          'May struggle with hard data focus',
          'Can be indecisive when values clash'
        ],
        careerSuggestions: [
          'Human Resources',
          'Training & Development',
          'Corporate Communications',
          'Change Management',
          'Employee Relations'
        ],
        approachDos: [
          'Listen to their ideas and vision',
          'Focus on human growth and development',
          'Be authentic and genuine',
          'Acknowledge their contributions',
          'Support their creative initiatives'
        ],
        approachDonts: [
          'Be cold or impersonal',
          'Ignore impact on people',
          'Use insincere praise',
          'Dismiss their values',
          'Force purely transactional relationships'
        ]
      },
      ms: {
        strengths: [
          'Kemahiran interpersonal dan komunikasi yang cemerlang',
          'Empati dan fokus kepada manusia',
          'Pemikiran kreatif dan berwawasan',
          'Keupayaan membina pasukan yang kuat',
          'Tulen dan didorong oleh nilai'
        ],
        weaknesses: [
          'Mungkin mengambil kritikan secara peribadi',
          'Boleh terlalu idealistik',
          'Mungkin mengelakkan konflik yang perlu',
          'Mungkin bergelut dengan fokus data keras',
          'Boleh ragu-ragu apabila nilai bertembung'
        ],
        careerSuggestions: [
          'Sumber Manusia',
          'Latihan & Pembangunan',
          'Komunikasi Korporat',
          'Pengurusan Perubahan',
          'Hubungan Pekerja'
        ],
        approachDos: [
          'Dengar idea dan visi mereka',
          'Fokus pada pertumbuhan dan pembangunan manusia',
          'Jadilah tulen dan jujur',
          'Iktiraf sumbangan mereka',
          'Sokong inisiatif kreatif mereka'
        ],
        approachDonts: [
          'Jangan sejuk atau tidak peribadi',
          'Abaikan kesan kepada manusia',
          'Gunakan pujian tidak ikhlas',
          'Abaikan nilai mereka',
          'Paksa hubungan transaksional semata-mata'
        ]
      }
    },
    artisan: {
      en: {
        strengths: [
          'Adaptable and flexible in dynamic environments',
          'Action-oriented and results-focused',
          'Excellent troubleshooting abilities',
          'Natural crisis management skills',
          'Practical and hands-on approach'
        ],
        weaknesses: [
          'May resist routine or repetitive tasks',
          'Can be impulsive in decision-making',
          'Might struggle with long-term planning',
          'May overlook details in favor of action',
          'Can be easily bored with structure'
        ],
        careerSuggestions: [
          'Sales & Business Development',
          'Event Management',
          'Emergency Response',
          'Field Operations',
          'Creative Problem Solving Roles'
        ],
        approachDos: [
          'Give freedom to act and decide',
          'Focus on immediate results',
          'Keep things dynamic and varied',
          'Allow hands-on involvement',
          'Recognize their quick thinking'
        ],
        approachDonts: [
          'Micromanage every step',
          'Force rigid, repetitive routines',
          'Demand extensive documentation',
          'Restrict their autonomy',
          'Ignore their practical insights'
        ]
      },
      ms: {
        strengths: [
          'Boleh menyesuaikan diri dan fleksibel dalam persekitaran dinamik',
          'Berorientasikan tindakan dan fokus hasil',
          'Keupayaan penyelesaian masalah yang cemerlang',
          'Kemahiran pengurusan krisis semula jadi',
          'Pendekatan praktikal dan langsung'
        ],
        weaknesses: [
          'Mungkin menentang tugas rutin atau berulang',
          'Boleh impulsif dalam membuat keputusan',
          'Mungkin bergelut dengan perancangan jangka panjang',
          'Mungkin mengabaikan perincian demi tindakan',
          'Boleh mudah bosan dengan struktur'
        ],
        careerSuggestions: [
          'Jualan & Pembangunan Perniagaan',
          'Pengurusan Acara',
          'Respons Kecemasan',
          'Operasi Lapangan',
          'Peranan Penyelesaian Masalah Kreatif'
        ],
        approachDos: [
          'Beri kebebasan untuk bertindak dan memutuskan',
          'Fokus pada hasil segera',
          'Pastikan perkara dinamik dan pelbagai',
          'Benarkan penglibatan langsung',
          'Iktiraf pemikiran pantas mereka'
        ],
        approachDonts: [
          'Mikrourus setiap langkah',
          'Paksa rutin kaku dan berulang',
          'Menuntut dokumentasi yang meluas',
          'Hadkan autonomi mereka',
          'Abaikan pandangan praktikal mereka'
        ]
      }
    }
  };

  return fallbacks[dominantType][language];
}
