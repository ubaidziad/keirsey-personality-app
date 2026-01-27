// Keirsey Assessment Questions - Part 1 (Questions 1-25)
import { Question } from './questions-base';

export const questionsPart1: Question[] = [
  {
    id: 1,
    dimension: 'EI',
    text_en: 'At a party, you tend to:',
    text_ms: 'Di sebuah pesta, anda cenderung untuk:',
    option_a_en: 'Interact with many, including strangers',
    option_a_ms: 'Berinteraksi dengan ramai orang, termasuk orang yang tidak dikenali',
    option_b_en: 'Interact with a few people you know',
    option_b_ms: 'Berinteraksi dengan beberapa orang yang anda kenali',
    scoring: { a: 'E', b: 'I' }
  },
  {
    id: 2,
    dimension: 'SN',
    text_en: 'You are more likely to trust:',
    text_ms: 'Anda lebih cenderung mempercayai:',
    option_a_en: 'Your experience and observations',
    option_a_ms: 'Pengalaman dan pemerhatian anda',
    option_b_en: 'Your intuition and gut feeling',
    option_b_ms: 'Intuisi dan perasaan dalaman anda',
    scoring: { a: 'S', b: 'N' }
  },
  {
    id: 3,
    dimension: 'TF',
    text_en: 'When making decisions, you typically:',
    text_ms: 'Apabila membuat keputusan, anda biasanya:',
    option_a_en: 'Rely on logic and objective analysis',
    option_a_ms: 'Bergantung pada logik dan analisis objektif',
    option_b_en: 'Consider personal values and how others will be affected',
    option_b_ms: 'Mempertimbangkan nilai peribadi dan bagaimana orang lain akan terkesan',
    scoring: { a: 'T', b: 'F' }
  },
  {
    id: 4,
    dimension: 'JP',
    text_en: 'You prefer to:',
    text_ms: 'Anda lebih suka:',
    option_a_en: 'Have things decided and settled',
    option_a_ms: 'Perkara-perkara yang sudah diputuskan dan diselesaikan',
    option_b_en: 'Keep your options open',
    option_b_ms: 'Membiarkan pilihan anda terbuka',
    scoring: { a: 'J', b: 'P' }
  },
  {
    id: 5,
    dimension: 'EI',
    text_en: 'After spending time with a group of people, you usually feel:',
    text_ms: 'Selepas menghabiskan masa dengan sekumpulan orang, anda biasanya berasa:',
    option_a_en: 'Energized and stimulated',
    option_a_ms: 'Bertenaga dan terangsang',
    option_b_en: 'Drained and needing alone time',
    option_b_ms: 'Penat dan memerlukan masa bersendirian',
    scoring: { a: 'E', b: 'I' }
  },
  {
    id: 6,
    dimension: 'SN',
    text_en: 'When learning something new, you prefer:',
    text_ms: 'Apabila mempelajari sesuatu yang baru, anda lebih suka:',
    option_a_en: 'Step-by-step instructions with concrete examples',
    option_a_ms: 'Arahan langkah demi langkah dengan contoh konkrit',
    option_b_en: 'Understanding the overall concept first',
    option_b_ms: 'Memahami konsep keseluruhan terlebih dahulu',
    scoring: { a: 'S', b: 'N' }
  },
  {
    id: 7,
    dimension: 'TF',
    text_en: 'In a disagreement, you are more likely to:',
    text_ms: 'Dalam perselisihan, anda lebih cenderung untuk:',
    option_a_en: 'Focus on finding the most logical solution',
    option_a_ms: 'Fokus untuk mencari penyelesaian yang paling logik',
    option_b_en: 'Consider everyone\'s feelings and find harmony',
    option_b_ms: 'Mempertimbangkan perasaan semua orang dan mencari keharmonian',
    scoring: { a: 'T', b: 'F' }
  },
  {
    id: 8,
    dimension: 'JP',
    text_en: 'You tend to work better when:',
    text_ms: 'Anda cenderung bekerja dengan lebih baik apabila:',
    option_a_en: 'You have a clear plan and schedule',
    option_a_ms: 'Anda mempunyai rancangan dan jadual yang jelas',
    option_b_en: 'You can be flexible and adapt as you go',
    option_b_ms: 'Anda boleh fleksibel dan menyesuaikan diri semasa anda berjalan',
    scoring: { a: 'J', b: 'P' }
  },
  {
    id: 9,
    dimension: 'EI',
    text_en: 'When meeting new people, you:',
    text_ms: 'Apabila bertemu orang baru, anda:',
    option_a_en: 'Easily start conversations and introduce yourself',
    option_a_ms: 'Mudah memulakan perbualan dan memperkenalkan diri',
    option_b_en: 'Wait for others to approach you first',
    option_b_ms: 'Menunggu orang lain menghampiri anda dahulu',
    scoring: { a: 'E', b: 'I' }
  },
  {
    id: 10,
    dimension: 'SN',
    text_en: 'You are more interested in:',
    text_ms: 'Anda lebih berminat dengan:',
    option_a_en: 'What is real and actual',
    option_a_ms: 'Apa yang nyata dan sebenar',
    option_b_en: 'What is possible and potential',
    option_b_ms: 'Apa yang mungkin dan berpotensi',
    scoring: { a: 'S', b: 'N' }
  },
  {
    id: 11,
    dimension: 'TF',
    text_en: 'You would rather be seen as:',
    text_ms: 'Anda lebih suka dilihat sebagai:',
    option_a_en: 'Competent and fair',
    option_a_ms: 'Kompeten dan adil',
    option_b_en: 'Caring and compassionate',
    option_b_ms: 'Penyayang dan penuh belas kasihan',
    scoring: { a: 'T', b: 'F' }
  },
  {
    id: 12,
    dimension: 'JP',
    text_en: 'When it comes to deadlines, you typically:',
    text_ms: 'Berkenaan dengan tarikh akhir, anda biasanya:',
    option_a_en: 'Complete work well ahead of time',
    option_a_ms: 'Menyelesaikan kerja jauh lebih awal',
    option_b_en: 'Work best under pressure close to the deadline',
    option_b_ms: 'Bekerja dengan baik di bawah tekanan hampir dengan tarikh akhir',
    scoring: { a: 'J', b: 'P' }
  },
  {
    id: 13,
    dimension: 'EI',
    text_en: 'You prefer to communicate:',
    text_ms: 'Anda lebih suka berkomunikasi:',
    option_a_en: 'By talking things through with others',
    option_a_ms: 'Dengan berbincang perkara dengan orang lain',
    option_b_en: 'By writing or thinking things through alone',
    option_b_ms: 'Dengan menulis atau memikirkan perkara bersendirian',
    scoring: { a: 'E', b: 'I' }
  },
  {
    id: 14,
    dimension: 'SN',
    text_en: 'When reading for pleasure, you prefer:',
    text_ms: 'Apabila membaca untuk keseronokan, anda lebih suka:',
    option_a_en: 'Realistic stories with practical information',
    option_a_ms: 'Cerita realistik dengan maklumat praktikal',
    option_b_en: 'Imaginative stories with deeper meanings',
    option_b_ms: 'Cerita imaginatif dengan makna yang lebih mendalam',
    scoring: { a: 'S', b: 'N' }
  },
  {
    id: 15,
    dimension: 'TF',
    text_en: 'When giving feedback, you tend to be:',
    text_ms: 'Apabila memberi maklum balas, anda cenderung untuk:',
    option_a_en: 'Direct and straightforward, even if it might hurt',
    option_a_ms: 'Terus terang dan langsung, walaupun mungkin menyakitkan',
    option_b_en: 'Tactful and considerate of their feelings',
    option_b_ms: 'Bijaksana dan mempertimbangkan perasaan mereka',
    scoring: { a: 'T', b: 'F' }
  },
  {
    id: 16,
    dimension: 'JP',
    text_en: 'You prefer environments that are:',
    text_ms: 'Anda lebih suka persekitaran yang:',
    option_a_en: 'Structured and organized',
    option_a_ms: 'Berstruktur dan teratur',
    option_b_en: 'Flexible and spontaneous',
    option_b_ms: 'Fleksibel dan spontan',
    scoring: { a: 'J', b: 'P' }
  },
  {
    id: 17,
    dimension: 'EI',
    text_en: 'In your free time, you prefer to:',
    text_ms: 'Pada masa lapang, anda lebih suka:',
    option_a_en: 'Go out and socialize with friends',
    option_a_ms: 'Keluar dan bersosial dengan rakan-rakan',
    option_b_en: 'Stay in and enjoy quiet activities',
    option_b_ms: 'Tinggal di rumah dan menikmati aktiviti yang tenang',
    scoring: { a: 'E', b: 'I' }
  },
  {
    id: 18,
    dimension: 'SN',
    text_en: 'You tend to focus more on:',
    text_ms: 'Anda cenderung untuk lebih fokus pada:',
    option_a_en: 'The present moment and current realities',
    option_a_ms: 'Saat ini dan realiti semasa',
    option_b_en: 'Future possibilities and what could be',
    option_b_ms: 'Kemungkinan masa depan dan apa yang mungkin',
    scoring: { a: 'S', b: 'N' }
  },
  {
    id: 19,
    dimension: 'TF',
    text_en: 'You believe it is more important to:',
    text_ms: 'Anda percaya lebih penting untuk:',
    option_a_en: 'Be truthful, even if it upsets people',
    option_a_ms: 'Berkata benar, walaupun ia mengecewakan orang',
    option_b_en: 'Be tactful, even if it means bending the truth',
    option_b_ms: 'Bersikap bijaksana, walaupun bermakna memutarbelitkan kebenaran',
    scoring: { a: 'T', b: 'F' }
  },
  {
    id: 20,
    dimension: 'JP',
    text_en: 'When planning a vacation, you prefer to:',
    text_ms: 'Apabila merancang percutian, anda lebih suka:',
    option_a_en: 'Have a detailed itinerary planned in advance',
    option_a_ms: 'Mempunyai jadual perjalanan terperinci yang dirancang lebih awal',
    option_b_en: 'Go with the flow and decide as you go',
    option_b_ms: 'Mengikut arus dan membuat keputusan semasa anda berjalan',
    scoring: { a: 'J', b: 'P' }
  },
  {
    id: 21,
    dimension: 'EI',
    text_en: 'You find it easier to:',
    text_ms: 'Anda mendapati lebih mudah untuk:',
    option_a_en: 'Think out loud and brainstorm with others',
    option_a_ms: 'Berfikir dengan kuat dan berbincang idea dengan orang lain',
    option_b_en: 'Reflect quietly and process your thoughts internally',
    option_b_ms: 'Merenung dengan tenang dan memproses fikiran anda secara dalaman',
    scoring: { a: 'E', b: 'I' }
  },
  {
    id: 22,
    dimension: 'SN',
    text_en: 'When solving problems, you prefer to:',
    text_ms: 'Apabila menyelesaikan masalah, anda lebih suka:',
    option_a_en: 'Use proven methods that have worked before',
    option_a_ms: 'Menggunakan kaedah yang terbukti berkesan sebelum ini',
    option_b_en: 'Try new and innovative approaches',
    option_b_ms: 'Mencuba pendekatan baru dan inovatif',
    scoring: { a: 'S', b: 'N' }
  },
  {
    id: 23,
    dimension: 'TF',
    text_en: 'You are more impressed by:',
    text_ms: 'Anda lebih terkesan dengan:',
    option_a_en: 'Logical and consistent arguments',
    option_a_ms: 'Hujah yang logik dan konsisten',
    option_b_en: 'Sincere and heartfelt expressions',
    option_b_ms: 'Ungkapan yang tulus dan ikhlas',
    scoring: { a: 'T', b: 'F' }
  },
  {
    id: 24,
    dimension: 'JP',
    text_en: 'You prefer tasks that:',
    text_ms: 'Anda lebih suka tugas yang:',
    option_a_en: 'Have clear outcomes and completion points',
    option_a_ms: 'Mempunyai hasil yang jelas dan titik penyelesaian',
    option_b_en: 'Are open-ended and evolving',
    option_b_ms: 'Terbuka dan berkembang',
    scoring: { a: 'J', b: 'P' }
  },
  {
    id: 25,
    dimension: 'EI',
    text_en: 'In a group discussion, you typically:',
    text_ms: 'Dalam perbincangan kumpulan, anda biasanya:',
    option_a_en: 'Speak up frequently and share your ideas',
    option_a_ms: 'Kerap bersuara dan berkongsi idea anda',
    option_b_en: 'Listen more and speak when you have something specific to add',
    option_b_ms: 'Lebih banyak mendengar dan bersuara apabila mempunyai sesuatu yang khusus untuk ditambah',
    scoring: { a: 'E', b: 'I' }
  }
];
