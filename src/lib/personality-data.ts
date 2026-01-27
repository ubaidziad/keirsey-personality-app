import { PersonalityType, PersonalityTypeInfo } from './types'

export const personalityTypeColors: Record<PersonalityType, string> = {
  guardian: '#3B82F6',
  rational: '#8B5CF6',
  idealist: '#10B981',
  artisan: '#F59E0B',
}

export const personalityTypeIcons: Record<PersonalityType, string> = {
  guardian: '/Guardian-Icon.svg',
  rational: '/Rational-Icon.svg',
  idealist: '/Idealist-Icon.svg',
  artisan: '/Artisan-Icon.svg',
}

export const personalityTypeData: Record<PersonalityType, PersonalityTypeInfo> = {
  guardian: {
    name: {
      en: 'Guardian',
      ms: 'Penguasa',
    },
    strengths: {
      en: [
        'Highly dependable and responsible',
        'Strong organizational skills',
        'Excellent attention to detail',
        'Values tradition and stability',
        'Great at establishing and following procedures',
        'Natural team players who support group goals',
        'Strong work ethic and dedication',
        'Reliable and consistent performance',
      ],
      ms: [
        'Sangat boleh dipercayai dan bertanggungjawab',
        'Kemahiran organisasi yang kuat',
        'Perhatian yang baik kepada perincian',
        'Menghargai tradisi dan kestabilan',
        'Cemerlang dalam menetapkan dan mengikuti prosedur',
        'Pemain pasukan semula jadi yang menyokong matlamat kumpulan',
        'Etika kerja yang kuat dan dedikasi',
        'Prestasi yang boleh dipercayai dan konsisten',
      ],
    },
    weaknesses: {
      en: [
        'May resist change or new approaches',
        'Can be overly rigid with rules',
        'Tendency to micromanage',
        'May struggle with ambiguity',
        'Can be pessimistic about new ideas',
        'May have difficulty delegating tasks',
        'Sometimes too focused on the past',
        'May overlook creative solutions',
      ],
      ms: [
        'Mungkin menentang perubahan atau pendekatan baharu',
        'Boleh terlalu tegar dengan peraturan',
        'Kecenderungan untuk mengurus secara mikro',
        'Mungkin sukar dengan kesamaran',
        'Boleh pesimis tentang idea baharu',
        'Mungkin sukar untuk mewakilkan tugas',
        'Kadang-kadang terlalu fokus pada masa lalu',
        'Mungkin terlepas pandang penyelesaian kreatif',
      ],
    },
    careers: {
      en: [
        'Administrative roles',
        'Project Management',
        'Quality Assurance',
        'Human Resources',
        'Accounting and Finance',
        'Healthcare Administration',
        'Legal Services',
        'Government and Public Service',
      ],
      ms: [
        'Peranan pentadbiran',
        'Pengurusan Projek',
        'Jaminan Kualiti',
        'Sumber Manusia',
        'Perakaunan dan Kewangan',
        'Pentadbiran Penjagaan Kesihatan',
        'Perkhidmatan Undang-undang',
        'Kerajaan dan Perkhidmatan Awam',
      ],
    },
    dos: {
      en: [
        'Provide clear instructions and expectations',
        'Respect deadlines and schedules',
        'Use proven methods and established procedures',
        'Acknowledge their contributions and reliability',
        'Give them time to process changes',
        'Provide detailed documentation',
        'Show respect for hierarchy and tradition',
        'Be consistent in your communication',
      ],
      ms: [
        'Berikan arahan dan jangkaan yang jelas',
        'Hormati tarikh akhir dan jadual',
        'Gunakan kaedah yang terbukti dan prosedur yang ditetapkan',
        'Mengiktiraf sumbangan dan kebolehpercayaan mereka',
        'Beri mereka masa untuk memproses perubahan',
        'Sediakan dokumentasi terperinci',
        'Tunjukkan rasa hormat kepada hierarki dan tradisi',
        'Konsisten dalam komunikasi anda',
      ],
    },
    donts: {
      en: [
        'Be vague or ambiguous in instructions',
        'Ignore company hierarchy or protocols',
        'Change plans last minute without solid reason',
        'Dismiss their concerns about risks',
        'Rush them into quick decisions',
        'Overlook their need for structure',
        'Disregard established procedures',
        'Force them to improvise constantly',
      ],
      ms: [
        'Bersikap kabur atau samar dalam arahan',
        'Mengabaikan hierarki atau protokol syarikat',
        'Menukar rancangan saat akhir tanpa sebab kukuh',
        'Menolak kebimbangan mereka tentang risiko',
        'Mendesak mereka membuat keputusan cepat',
        'Mengabaikan keperluan mereka untuk struktur',
        'Mengabaikan prosedur yang ditetapkan',
        'Memaksa mereka untuk berimprovisasi sentiasa',
      ],
    },
  },
  rational: {
    name: {
      en: 'Rational',
      ms: 'Pemikir',
    },
    strengths: {
      en: [
        'Excellent analytical and strategic thinking',
        'Strong problem-solving abilities',
        'Independent and self-directed',
        'High standards for competence',
        'Innovative and forward-thinking',
        'Objective and logical decision-making',
        'Quick learners who master complex systems',
        'Natural architects of ideas and systems',
      ],
      ms: [
        'Pemikiran analitik dan strategik yang cemerlang',
        'Kebolehan menyelesaikan masalah yang kuat',
        'Berdikari dan arahan sendiri',
        'Standard yang tinggi untuk kecekapan',
        'Inovatif dan berfikiran ke hadapan',
        'Membuat keputusan yang objektif dan logik',
        'Pelajar cepat yang menguasai sistem kompleks',
        'Arkitek semula jadi idea dan sistem',
      ],
    },
    weaknesses: {
      en: [
        'May appear cold or dismissive of emotions',
        'Can be overly critical of others',
        'Tendency to overcomplicate solutions',
        'May struggle with interpersonal relationships',
        'Can be impatient with slower thinkers',
        'May neglect practical implementation',
        'Sometimes arrogant about their knowledge',
        'May have difficulty with small talk',
      ],
      ms: [
        'Mungkin kelihatan dingin atau menolak emosi',
        'Boleh terlalu kritikal terhadap orang lain',
        'Kecenderungan untuk merumitkan penyelesaian',
        'Mungkin sukar dengan hubungan interpersonal',
        'Boleh tidak sabar dengan pemikir yang lebih lambat',
        'Mungkin mengabaikan pelaksanaan praktikal',
        'Kadang-kadang sombong tentang pengetahuan mereka',
        'Mungkin sukar dengan perbualan ringan',
      ],
    },
    careers: {
      en: [
        'Strategic Planning',
        'Research and Development',
        'Engineering',
        'Technology and IT',
        'Data Science and Analytics',
        'Architecture and Design',
        'Consulting',
        'Executive Leadership',
      ],
      ms: [
        'Perancangan Strategik',
        'Penyelidikan dan Pembangunan',
        'Kejuruteraan',
        'Teknologi dan IT',
        'Sains Data dan Analitik',
        'Seni Bina dan Reka Bentuk',
        'Perundingan',
        'Kepimpinan Eksekutif',
      ],
    },
    dos: {
      en: [
        'Use logic and data to support arguments',
        'Be concise and get to the point',
        'Focus on long-term efficiency and outcomes',
        'Respect their expertise and knowledge',
        'Give them complex problems to solve',
        'Allow autonomy in their work',
        'Challenge them intellectually',
        'Discuss ideas and concepts openly',
      ],
      ms: [
        'Gunakan logik dan data untuk menyokong hujah',
        'Ringkas dan terus kepada inti',
        'Fokus pada kecekapan dan hasil jangka panjang',
        'Hormati kepakaran dan pengetahuan mereka',
        'Beri mereka masalah kompleks untuk diselesaikan',
        'Benarkan autonomi dalam kerja mereka',
        'Cabar mereka secara intelektual',
        'Bincang idea dan konsep secara terbuka',
      ],
    },
    donts: {
      en: [
        'Use purely emotional arguments',
        'Demand small talk before business',
        'Micromanage their work process',
        'Ignore their suggestions without reason',
        'Force unnecessary meetings',
        'Be vague about goals or expectations',
        'Dismiss their ideas without logical rebuttal',
        'Expect them to follow illogical procedures',
      ],
      ms: [
        'Menggunakan hujah yang semata-mata emosi',
        'Menuntut perbualan ringan sebelum urusan',
        'Mengurus kerja mereka secara mikro',
        'Mengabaikan cadangan mereka tanpa sebab',
        'Memaksa mesyuarat yang tidak perlu',
        'Bersikap kabur tentang matlamat atau jangkaan',
        'Menolak idea mereka tanpa bantahan logik',
        'Mengharapkan mereka mengikuti prosedur yang tidak logik',
      ],
    },
  },
  idealist: {
    name: {
      en: 'Idealist',
      ms: 'Pemulihara',
    },
    strengths: {
      en: [
        'Excellent interpersonal and communication skills',
        'Highly empathetic and understanding',
        'Strong focus on personal growth and development',
        'Inspiring and motivating to others',
        'Creative and imaginative thinkers',
        'Authentic and genuine in relationships',
        'Natural mentors and coaches',
        'Skilled at conflict resolution',
      ],
      ms: [
        'Kemahiran interpersonal dan komunikasi yang cemerlang',
        'Sangat empati dan memahami',
        'Fokus yang kuat pada pertumbuhan dan pembangunan peribadi',
        'Memberi inspirasi dan motivasi kepada orang lain',
        'Pemikir kreatif dan imaginatif',
        'Autentik dan tulen dalam hubungan',
        'Mentor dan jurulatih semula jadi',
        'Mahir dalam penyelesaian konflik',
      ],
    },
    weaknesses: {
      en: [
        'May be overly idealistic',
        'Can take criticism too personally',
        'Tendency to avoid conflict',
        'May struggle with tough decisions',
        'Can be too focused on harmony',
        'May neglect practical details',
        'Sometimes unrealistic expectations',
        'Can be overly sensitive to negativity',
      ],
      ms: [
        'Mungkin terlalu idealistik',
        'Boleh mengambil kritikan terlalu peribadi',
        'Kecenderungan untuk mengelakkan konflik',
        'Mungkin sukar dengan keputusan sukar',
        'Boleh terlalu fokus pada harmoni',
        'Mungkin mengabaikan butiran praktikal',
        'Kadang-kadang jangkaan yang tidak realistik',
        'Boleh terlalu sensitif terhadap negativiti',
      ],
    },
    careers: {
      en: [
        'Counseling and Psychology',
        'Human Resources Development',
        'Training and Development',
        'Non-profit Management',
        'Writing and Creative Arts',
        'Teaching and Education',
        'Social Work',
        'Corporate Culture Development',
      ],
      ms: [
        'Kaunseling dan Psikologi',
        'Pembangunan Sumber Manusia',
        'Latihan dan Pembangunan',
        'Pengurusan Bukan Untung',
        'Penulisan dan Seni Kreatif',
        'Pengajaran dan Pendidikan',
        'Kerja Sosial',
        'Pembangunan Budaya Korporat',
      ],
    },
    dos: {
      en: [
        'Listen to their ideas with genuine interest',
        'Focus on human growth and potential',
        'Be authentic and sincere in interactions',
        'Acknowledge their contributions to team harmony',
        'Provide meaningful work that aligns with values',
        'Give constructive feedback with empathy',
        'Support their personal development goals',
        'Create a positive and inclusive environment',
      ],
      ms: [
        'Dengar idea mereka dengan minat yang tulen',
        'Fokus pada pertumbuhan dan potensi manusia',
        'Bersikap autentik dan ikhlas dalam interaksi',
        'Mengiktiraf sumbangan mereka kepada harmoni pasukan',
        'Sediakan kerja bermakna yang selaras dengan nilai',
        'Beri maklum balas yang membina dengan empati',
        'Sokong matlamat pembangunan peribadi mereka',
        'Cipta persekitaran yang positif dan inklusif',
      ],
    },
    donts: {
      en: [
        'Be cold or dismissive of their feelings',
        'Ignore the impact on people when making decisions',
        'Use insincere praise or manipulation',
        'Focus only on numbers and metrics',
        'Dismiss their concerns about team dynamics',
        'Create a competitive or hostile environment',
        'Give harsh criticism without context',
        'Undervalue relationship-building activities',
      ],
      ms: [
        'Bersikap dingin atau menolak perasaan mereka',
        'Mengabaikan kesan kepada orang apabila membuat keputusan',
        'Menggunakan pujian tidak ikhlas atau manipulasi',
        'Hanya fokus pada nombor dan metrik',
        'Menolak kebimbangan mereka tentang dinamik pasukan',
        'Mencipta persekitaran yang kompetitif atau bermusuhan',
        'Memberi kritikan keras tanpa konteks',
        'Merendahkan aktiviti membina hubungan',
      ],
    },
  },
  artisan: {
    name: {
      en: 'Artisan',
      ms: 'Penghibur',
    },
    strengths: {
      en: [
        'Highly adaptable and flexible',
        'Excellent at handling crises and emergencies',
        'Natural performers and entertainers',
        'Great at improvisation and quick thinking',
        'Action-oriented with immediate results',
        'Skilled negotiators and troubleshooters',
        'Energetic and enthusiastic',
        'Resourceful and practical problem-solvers',
      ],
      ms: [
        'Sangat mudah menyesuaikan diri dan fleksibel',
        'Cemerlang dalam menangani krisis dan kecemasan',
        'Penghibur dan pelaku semula jadi',
        'Hebat dalam improvisasi dan pemikiran cepat',
        'Berorientasikan tindakan dengan hasil segera',
        'Perunding dan penyelesai masalah yang mahir',
        'Bertenaga dan bersemangat',
        'Penyelesai masalah yang berhemat dan praktikal',
      ],
    },
    weaknesses: {
      en: [
        'May struggle with long-term planning',
        'Can be impulsive in decision-making',
        'Tendency to get bored easily',
        'May resist routine and structure',
        'Can be unreliable with commitments',
        'May take unnecessary risks',
        'Sometimes insensitive to others feelings',
        'May lack follow-through on projects',
      ],
      ms: [
        'Mungkin sukar dengan perancangan jangka panjang',
        'Boleh impulsif dalam membuat keputusan',
        'Kecenderungan untuk mudah bosan',
        'Mungkin menentang rutin dan struktur',
        'Boleh tidak boleh dipercayai dengan komitmen',
        'Mungkin mengambil risiko yang tidak perlu',
        'Kadang-kadang tidak sensitif terhadap perasaan orang lain',
        'Mungkin kurang tindakan susulan pada projek',
      ],
    },
    careers: {
      en: [
        'Sales and Marketing',
        'Entrepreneurship',
        'Emergency Services',
        'Entertainment and Performing Arts',
        'Sports and Athletics',
        'Crisis Management',
        'Skilled Trades and Crafts',
        'Event Management',
      ],
      ms: [
        'Jualan dan Pemasaran',
        'Keusahawanan',
        'Perkhidmatan Kecemasan',
        'Hiburan dan Seni Persembahan',
        'Sukan dan Atletik',
        'Pengurusan Krisis',
        'Perdagangan dan Kraf Mahir',
        'Pengurusan Acara',
      ],
    },
    dos: {
      en: [
        'Give them freedom to act and decide',
        'Focus on immediate results and action',
        'Keep things dynamic and varied',
        'Recognize their practical achievements',
        'Allow flexibility in how they work',
        'Present challenges as opportunities',
        'Provide hands-on experiences',
        'Keep meetings short and action-focused',
      ],
      ms: [
        'Beri mereka kebebasan untuk bertindak dan memutuskan',
        'Fokus pada hasil dan tindakan segera',
        'Pastikan perkara dinamik dan pelbagai',
        'Mengiktiraf pencapaian praktikal mereka',
        'Benarkan fleksibiliti dalam cara mereka bekerja',
        'Kemukakan cabaran sebagai peluang',
        'Sediakan pengalaman praktikal',
        'Pastikan mesyuarat pendek dan fokus pada tindakan',
      ],
    },
    donts: {
      en: [
        'Micro-manage every step of their work',
        'Force them into rigid, repetitive routines',
        'Overload them with paperwork and documentation',
        'Ignore their need for variety and excitement',
        'Restrict their autonomy unnecessarily',
        'Focus only on long-term theoretical outcomes',
        'Expect them to follow strict schedules',
        'Dismiss their hands-on approach',
      ],
      ms: [
        'Mengurus setiap langkah kerja mereka secara mikro',
        'Memaksa mereka ke dalam rutin yang tegar dan berulang',
        'Membebankan mereka dengan kertas kerja dan dokumentasi',
        'Mengabaikan keperluan mereka untuk kepelbagaian dan keseronokan',
        'Menyekat autonomi mereka tanpa perlu',
        'Hanya fokus pada hasil teori jangka panjang',
        'Mengharapkan mereka mengikuti jadual yang ketat',
        'Menolak pendekatan praktikal mereka',
      ],
    },
  },
}

export function getTrainingRecommendations(
  distribution: Record<PersonalityType, number>,
  lang: 'en' | 'ms'
): string[] {
  const recommendations: string[] = []

  if (distribution.guardian > 35) {
    recommendations.push(
      lang === 'en'
        ? 'Stress Management - Recommended for Guardian-heavy groups to help manage their tendency towards anxiety about change and uncertainty.'
        : 'Pengurusan Tekanan - Disyorkan untuk kumpulan dengan ramai Penguasa untuk membantu mengurus kecenderungan mereka terhadap kebimbangan tentang perubahan dan ketidakpastian.'
    )
  }

  if (distribution.rational > 20) {
    recommendations.push(
      lang === 'en'
        ? 'Strategic Leadership & Logic - Recommended to leverage the analytical strengths of Rational types for organizational planning.'
        : 'Kepimpinan Strategik & Logik - Disyorkan untuk memanfaatkan kekuatan analitik jenis Pemikir untuk perancangan organisasi.'
    )
  }

  if (distribution.idealist > 20) {
    recommendations.push(
      lang === 'en'
        ? 'Communication & Emotional Intelligence - Recommended to enhance the interpersonal skills that Idealists naturally bring to teams.'
        : 'Komunikasi & Kecerdasan Emosi - Disyorkan untuk meningkatkan kemahiran interpersonal yang dibawa oleh Pemulihara secara semula jadi kepada pasukan.'
    )
  }

  if (distribution.artisan > 20) {
    recommendations.push(
      lang === 'en'
        ? 'Agility & Innovation Workshop - Recommended to channel the creative energy and adaptability of Artisan types.'
        : 'Bengkel Ketangkasan & Inovasi - Disyorkan untuk menyalurkan tenaga kreatif dan kebolehsuaian jenis Penghibur.'
    )
  }

  if (recommendations.length === 0) {
    recommendations.push(
      lang === 'en'
        ? 'Team Building & Collaboration - Recommended for balanced teams to enhance cross-type communication and collaboration.'
        : 'Pembinaan Pasukan & Kerjasama - Disyorkan untuk pasukan yang seimbang untuk meningkatkan komunikasi dan kerjasama merentas jenis.'
    )
  }

  return recommendations
}
