// Keirsey Assessment Questions - Part 2 (Questions 26-50)
import { Question } from './questions-base';

export const questionsPart2: Question[] = [
  {
    id: 26,
    dimension: 'SN',
    text_en: 'You are more comfortable with:',
    text_ms: 'Anda lebih selesa dengan:',
    option_a_en: 'Facts and concrete details',
    option_a_ms: 'Fakta dan butiran konkrit',
    option_b_en: 'Ideas and abstract concepts',
    option_b_ms: 'Idea dan konsep abstrak',
    scoring: { a: 'S', b: 'N' }
  },
  {
    id: 27,
    dimension: 'TF',
    text_en: 'When a friend is upset, you first want to:',
    text_ms: 'Apabila rakan sedih, anda terlebih dahulu mahu:',
    option_a_en: 'Help them analyze and solve the problem',
    option_a_ms: 'Membantu mereka menganalisis dan menyelesaikan masalah',
    option_b_en: 'Listen and offer emotional support',
    option_b_ms: 'Mendengar dan menawarkan sokongan emosi',
    scoring: { a: 'T', b: 'F' }
  },
  {
    id: 28,
    dimension: 'JP',
    text_en: 'You prefer to make decisions:',
    text_ms: 'Anda lebih suka membuat keputusan:',
    option_a_en: 'Quickly and move on',
    option_a_ms: 'Dengan cepat dan teruskan',
    option_b_en: 'After exploring all possibilities',
    option_b_ms: 'Selepas meneroka semua kemungkinan',
    scoring: { a: 'J', b: 'P' }
  },
  {
    id: 29,
    dimension: 'EI',
    text_en: 'Your ideal weekend involves:',
    text_ms: 'Hujung minggu ideal anda melibatkan:',
    option_a_en: 'Activities with friends and social events',
    option_a_ms: 'Aktiviti dengan rakan-rakan dan acara sosial',
    option_b_en: 'Quiet time at home with personal hobbies',
    option_b_ms: 'Masa tenang di rumah dengan hobi peribadi',
    scoring: { a: 'E', b: 'I' }
  },
  {
    id: 30,
    dimension: 'SN',
    text_en: 'When describing an event, you tend to:',
    text_ms: 'Apabila menerangkan sesuatu peristiwa, anda cenderung untuk:',
    option_a_en: 'Give specific details about what happened',
    option_a_ms: 'Memberikan butiran khusus tentang apa yang berlaku',
    option_b_en: 'Describe the overall impression and meaning',
    option_b_ms: 'Menerangkan kesan dan makna keseluruhan',
    scoring: { a: 'S', b: 'N' }
  },
  {
    id: 31,
    dimension: 'TF',
    text_en: 'You tend to value more:',
    text_ms: 'Anda cenderung lebih menghargai:',
    option_a_en: 'Justice and fairness',
    option_a_ms: 'Keadilan dan kesaksamaan',
    option_b_en: 'Mercy and forgiveness',
    option_b_ms: 'Belas kasihan dan pengampunan',
    scoring: { a: 'T', b: 'F' }
  },
  {
    id: 32,
    dimension: 'JP',
    text_en: 'Your workspace is usually:',
    text_ms: 'Ruang kerja anda biasanya:',
    option_a_en: 'Neat and organized',
    option_a_ms: 'Kemas dan teratur',
    option_b_en: 'Flexible with things in various places',
    option_b_ms: 'Fleksibel dengan barang-barang di pelbagai tempat',
    scoring: { a: 'J', b: 'P' }
  },
  {
    id: 33,
    dimension: 'EI',
    text_en: 'You recharge your energy by:',
    text_ms: 'Anda mengecas semula tenaga dengan:',
    option_a_en: 'Being around other people',
    option_a_ms: 'Berada di sekitar orang lain',
    option_b_en: 'Spending time alone',
    option_b_ms: 'Menghabiskan masa bersendirian',
    scoring: { a: 'E', b: 'I' }
  },
  {
    id: 34,
    dimension: 'SN',
    text_en: 'You prefer to learn through:',
    text_ms: 'Anda lebih suka belajar melalui:',
    option_a_en: 'Hands-on practice and real examples',
    option_a_ms: 'Amalan praktikal dan contoh sebenar',
    option_b_en: 'Theory and conceptual understanding',
    option_b_ms: 'Teori dan pemahaman konseptual',
    scoring: { a: 'S', b: 'N' }
  },
  {
    id: 35,
    dimension: 'TF',
    text_en: 'In making decisions, you give more weight to:',
    text_ms: 'Dalam membuat keputusan, anda memberi lebih berat kepada:',
    option_a_en: 'Objective facts and evidence',
    option_a_ms: 'Fakta objektif dan bukti',
    option_b_en: 'Personal values and relationships',
    option_b_ms: 'Nilai peribadi dan hubungan',
    scoring: { a: 'T', b: 'F' }
  },
  {
    id: 36,
    dimension: 'JP',
    text_en: 'When starting a project, you prefer to:',
    text_ms: 'Apabila memulakan projek, anda lebih suka:',
    option_a_en: 'Plan everything before beginning',
    option_a_ms: 'Merancang segala-galanya sebelum bermula',
    option_b_en: 'Start working and figure it out as you go',
    option_b_ms: 'Mula bekerja dan memikirkannya semasa anda berjalan',
    scoring: { a: 'J', b: 'P' }
  },
  {
    id: 37,
    dimension: 'EI',
    text_en: 'When you have a problem, you prefer to:',
    text_ms: 'Apabila anda mempunyai masalah, anda lebih suka:',
    option_a_en: 'Talk it through with others',
    option_a_ms: 'Berbincang dengan orang lain',
    option_b_en: 'Think it through on your own',
    option_b_ms: 'Memikirkannya sendiri',
    scoring: { a: 'E', b: 'I' }
  },
  {
    id: 38,
    dimension: 'SN',
    text_en: 'You are more likely to notice:',
    text_ms: 'Anda lebih cenderung menyedari:',
    option_a_en: 'Specific details and practical matters',
    option_a_ms: 'Butiran khusus dan perkara praktikal',
    option_b_en: 'Patterns and underlying meanings',
    option_b_ms: 'Corak dan makna yang mendasari',
    scoring: { a: 'S', b: 'N' }
  },
  {
    id: 39,
    dimension: 'TF',
    text_en: 'You are more likely to be bothered by:',
    text_ms: 'Anda lebih cenderung terganggu oleh:',
    option_a_en: 'Illogical arguments and inconsistencies',
    option_a_ms: 'Hujah yang tidak logik dan ketidakkonsistenan',
    option_b_en: 'People being insensitive or unkind',
    option_b_ms: 'Orang yang tidak peka atau tidak baik hati',
    scoring: { a: 'T', b: 'F' }
  },
  {
    id: 40,
    dimension: 'JP',
    text_en: 'You prefer life to be:',
    text_ms: 'Anda lebih suka kehidupan untuk:',
    option_a_en: 'Planned and predictable',
    option_a_ms: 'Dirancang dan boleh diramal',
    option_b_en: 'Flexible and full of surprises',
    option_b_ms: 'Fleksibel dan penuh dengan kejutan',
    scoring: { a: 'J', b: 'P' }
  },
  {
    id: 41,
    dimension: 'EI',
    text_en: 'You would rather:',
    text_ms: 'Anda lebih suka:',
    option_a_en: 'Have many friends with less deep connections',
    option_a_ms: 'Mempunyai ramai kawan dengan hubungan yang kurang mendalam',
    option_b_en: 'Have fewer friends with deeper connections',
    option_b_ms: 'Mempunyai lebih sedikit kawan dengan hubungan yang lebih mendalam',
    scoring: { a: 'E', b: 'I' }
  },
  {
    id: 42,
    dimension: 'SN',
    text_en: 'When considering a new idea, you first ask:',
    text_ms: 'Apabila mempertimbangkan idea baru, anda terlebih dahulu bertanya:',
    option_a_en: 'Is it practical and achievable?',
    option_a_ms: 'Adakah ia praktikal dan boleh dicapai?',
    option_b_en: 'Is it innovative and inspiring?',
    option_b_ms: 'Adakah ia inovatif dan memberi inspirasi?',
    scoring: { a: 'S', b: 'N' }
  },
  {
    id: 43,
    dimension: 'TF',
    text_en: 'Which is a greater compliment?',
    text_ms: 'Yang mana lebih merupakan pujian?',
    option_a_en: 'Being called very logical',
    option_a_ms: 'Dipanggil sangat logik',
    option_b_en: 'Being called very caring',
    option_b_ms: 'Dipanggil sangat penyayang',
    scoring: { a: 'T', b: 'F' }
  },
  {
    id: 44,
    dimension: 'JP',
    text_en: 'When packing for a trip, you tend to:',
    text_ms: 'Apabila mengemas untuk perjalanan, anda cenderung untuk:',
    option_a_en: 'Make a list and pack in advance',
    option_a_ms: 'Membuat senarai dan mengemas lebih awal',
    option_b_en: 'Pack at the last minute',
    option_b_ms: 'Mengemas pada saat akhir',
    scoring: { a: 'J', b: 'P' }
  },
  {
    id: 45,
    dimension: 'EI',
    text_en: 'In conversations, you tend to:',
    text_ms: 'Dalam perbualan, anda cenderung untuk:',
    option_a_en: 'Speak quickly and think as you talk',
    option_a_ms: 'Bercakap dengan cepat dan berfikir semasa anda bercakap',
    option_b_en: 'Think carefully before speaking',
    option_b_ms: 'Berfikir dengan teliti sebelum bercakap',
    scoring: { a: 'E', b: 'I' }
  },
  {
    id: 46,
    dimension: 'SN',
    text_en: 'You prefer instructions that are:',
    text_ms: 'Anda lebih suka arahan yang:',
    option_a_en: 'Clear, detailed, and step-by-step',
    option_a_ms: 'Jelas, terperinci, dan langkah demi langkah',
    option_b_en: 'General guidelines that allow creativity',
    option_b_ms: 'Garis panduan umum yang membolehkan kreativiti',
    scoring: { a: 'S', b: 'N' }
  },
  {
    id: 47,
    dimension: 'TF',
    text_en: 'You are more comfortable with:',
    text_ms: 'Anda lebih selesa dengan:',
    option_a_en: 'Analyzing problems objectively',
    option_a_ms: 'Menganalisis masalah secara objektif',
    option_b_en: 'Understanding how people feel',
    option_b_ms: 'Memahami perasaan orang',
    scoring: { a: 'T', b: 'F' }
  },
  {
    id: 48,
    dimension: 'JP',
    text_en: 'You feel more comfortable when:',
    text_ms: 'Anda berasa lebih selesa apabila:',
    option_a_en: 'Decisions are made and final',
    option_a_ms: 'Keputusan dibuat dan muktamad',
    option_b_en: 'Options are still open',
    option_b_ms: 'Pilihan masih terbuka',
    scoring: { a: 'J', b: 'P' }
  },
  {
    id: 49,
    dimension: 'EI',
    text_en: 'When attending a seminar, you prefer:',
    text_ms: 'Apabila menghadiri seminar, anda lebih suka:',
    option_a_en: 'Interactive sessions with group discussions',
    option_a_ms: 'Sesi interaktif dengan perbincangan kumpulan',
    option_b_en: 'Lectures where you can listen and take notes',
    option_b_ms: 'Kuliah di mana anda boleh mendengar dan mengambil nota',
    scoring: { a: 'E', b: 'I' }
  },
  {
    id: 50,
    dimension: 'SN',
    text_en: 'You prefer to talk about:',
    text_ms: 'Anda lebih suka bercakap tentang:',
    option_a_en: 'Everyday events and experiences',
    option_a_ms: 'Peristiwa dan pengalaman harian',
    option_b_en: 'Ideas, theories, and possibilities',
    option_b_ms: 'Idea, teori, dan kemungkinan',
    scoring: { a: 'S', b: 'N' }
  }
];
