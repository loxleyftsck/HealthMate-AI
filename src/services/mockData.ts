import type { ChatSession, UserProfile, AppSettings, HealthMetricSummary } from '../types';

export const INITIAL_USER_PROFILE: UserProfile = {
  name: 'Tamu',
  avatar: 'guest',
  weight: 70,
  height: 170,
  waterGoal: 2000,
  calorieGoal: 2000,
  sleepGoal: 8,
  isGuest: true,
};

export const INITIAL_SETTINGS: AppSettings = {
  theme: 'system',
  language: 'id', // Default to Indonesian
  apiKey: '',
  model: 'gemini-2.5-flash',
  systemInstruction: 'Anda adalah HealthMate AI, asisten kesehatan edukatif profesional yang ramah dan empati. Berikan edukasi kesehatan umum dan rekomendasi gaya hidup sehat. Selalu sertakan penafian (disclaimer) bahwa informasi ini bukan merupakan diagnosis medis dan tidak menggantikan konsultasi dengan dokter.',
  temperature: 0.7,
  plugins: {
    BMI: true,
    Nutrition: true,
    Workout: true,
    Sleep: true,
    Water: true,
    Symptom: true,
  },
};

export const MOCK_PLUGINS = [
  {
    id: 'BMI',
    name: 'Indeks Massa Tubuh (BMI)',
    description: 'Hitung Indeks Massa Tubuh (BMI) dan dapatkan rekomendasi berat badan sehat.',
    version: '1.0.0',
    author: 'HealthMate Team',
    icon: 'Activity',
    enabledByDefault: true,
  },
  {
    id: 'Nutrition',
    name: 'Nutrisi & Makanan',
    description: 'Dapatkan ide menu harian, rekomendasi kalori, dan edukasi nutrisi seimbang.',
    version: '1.0.0',
    author: 'HealthMate Team',
    icon: 'Apple',
    enabledByDefault: true,
  },
  {
    id: 'Workout',
    name: 'Aktivitas Fisik',
    description: 'Dapatkan panduan olahraga harian, pembagian latihan (split), dan tips gaya hidup aktif.',
    version: '1.0.0',
    author: 'HealthMate Team',
    icon: 'Dumbbell',
    enabledByDefault: true,
  },
  {
    id: 'Sleep',
    name: 'Tidur & Istirahat',
    description: 'Optimalkan kualitas tidur, jaga ritme sirkadian, dan pelajari kebiasaan tidur yang baik.',
    version: '1.0.0',
    author: 'HealthMate Team',
    icon: 'Moon',
    enabledByDefault: true,
  },
  {
    id: 'Water',
    name: 'Asupan Air',
    description: 'Catat asupan air minum harian, pantau target hidrasi tubuh, dan dapatkan pengingat minum.',
    version: '1.0.0',
    author: 'HealthMate Team',
    icon: 'Droplet',
    enabledByDefault: true,
  },
  {
    id: 'Symptom',
    name: 'Panduan Gejala',
    description: 'Panduan edukatif untuk mengenali kemungkinan penyebab gejala ringan dan kapan harus ke dokter.',
    version: '1.0.0',
    author: 'HealthMate Team',
    icon: 'Stethoscope',
    enabledByDefault: true,
  },
];

export const INITIAL_DASHBOARD_DATA: HealthMetricSummary = {
  bmi: {
    id: 'bmi-initial',
    weight: 68,
    height: 168,
    bmi: 24.1,
    category: 'Berat Badan Normal',
    timestamp: new Date().toISOString(),
  },
  waterIntake: {
    current: 1750,
    goal: 2500,
    logs: [
      { id: 'w1', amount: 250, timestamp: new Date(Date.now() - 3600000 * 5).toISOString() },
      { id: 'w2', amount: 500, timestamp: new Date(Date.now() - 3600000 * 4).toISOString() },
      { id: 'w3', amount: 500, timestamp: new Date(Date.now() - 3600000 * 2).toISOString() },
      { id: 'w4', amount: 500, timestamp: new Date(Date.now() - 3600000 * 0.5).toISOString() },
    ],
  },
  calories: {
    current: 1380,
    goal: 2000,
    logs: [
      { id: 'c1', amount: 420, timestamp: new Date(Date.now() - 3600000 * 11).toISOString(), type: 'breakfast', foodName: 'Oatmeal dengan Stroberi dan Almond' },
      { id: 'c2', amount: 680, timestamp: new Date(Date.now() - 3600000 * 6).toISOString(), type: 'lunch', foodName: 'Salad Ayam Panggang dengan Kinoa' },
      { id: 'c3', amount: 280, timestamp: new Date(Date.now() - 3600000 * 3).toISOString(), type: 'snack', foodName: 'Yoghurt Yunani dengan Madu' },
    ],
  },
  exercise: {
    duration: 45,
    steps: 8240,
    logs: [
      { id: 'e1', duration: 30, steps: 4100, activityType: 'Jalan Cepat', timestamp: new Date(Date.now() - 3600000 * 10).toISOString() },
      { id: 'e2', duration: 15, steps: 2200, activityType: 'Lari Santai', timestamp: new Date(Date.now() - 3600000 * 5).toISOString() },
    ],
  },
  sleep: {
    duration: 7.5,
    quality: 'Good',
    logs: [
      { id: 's1', duration: 7.5, quality: 'Good', timestamp: new Date().toISOString() },
    ],
  },
  heartHealth: {
    bpm: 72,
    bloodPressure: '118/78',
    history: [
      { bpm: 68, bp: '116/76', timestamp: new Date(Date.now() - 3600000 * 24).toISOString() },
      { bpm: 72, bp: '118/78', timestamp: new Date().toISOString() },
    ],
  },
};

export const MOCK_CHAT_HISTORY: ChatSession[] = [
  {
    id: 'chat-1',
    title: 'Evaluasi Gejala: Sakit Kepala Tegang',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    messages: [
      {
        id: '1-1',
        text: 'Saya merasakan sakit kepala ringan yang tumpul di area dahi sejak 6 jam yang lalu. Rasanya seperti ada pita kencang yang menekan kepala. Apa yang sebaiknya saya lakukan?',
        sender: 'user',
        timestamp: new Date(Date.now() - 86400000 * 2 - 60000).toISOString(),
      },
      {
        id: '1-2',
        text: `### 🩺 Edukasi & Pemahaman Sakit Kepala

Berdasarkan penjelasan yang Anda sampaikan, keluhan tersebut menunjukkan karakteristik dari **Sakit Kepala Tegang (Tension-Type Headache / TTH)**. Sakit kepala jenis ini adalah tipe yang paling umum terjadi dan sering digambarkan seperti kepala sedang diikat dengan kencang.

#### Kemungkinan Penyebab:
*   Stres, kelelahan fisik, atau kecemasan.
*   Postur tubuh yang kurang baik (misalnya, menatap layar komputer terlalu lama).
*   Dehidrasi atau terlambat makan.
*   Ketegangan pada otot leher dan pundak.

#### Rekomendasi Perawatan Mandiri:
1.  **Cukupi Kebutuhan Cairan:** Minumlah segelas air putih hangat. Dehidrasi sering kali menjadi pemicu sakit kepala yang jarang disadari.
2.  **Istirahat yang Cukup:** Hindari paparan layar (HP, laptop, TV) setidaknya selama 15–20 menit. Beristirahatlah di ruangan yang tenang dan redup.
3.  **Pijat Ringan:** Pijat dengan lembut area pelipis, dahi, dan otot leher bagian belakang.
4.  **Kompres Hangat/Dingin:** Tempelkan kompres hangat di leher belakang atau mandi air hangat untuk membantu merelaksasi otot leher yang tegang.

> [!WARNING]
> **Segera konsultasikan dengan tenaga medis apabila:**
> Sakit kepala terjadi secara mendadak dan sangat hebat (seperti disambar petir), disertai demam tinggi, leher kaku, kebingungan, gangguan penglihatan ganda, mati rasa, atau kesulitan berbicara.
>
> *Edukasi Kesehatan: Informasi ini hanya bersifat edukasi umum dan bukan diagnosis medis resmi.*`,
        sender: 'ai',
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
        isMarkdown: true,
        pluginUsed: 'Symptom',
      },
    ],
  },
  {
    id: 'chat-2',
    title: 'Rekomendasi Menu Tinggi Protein',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    messages: [
      {
        id: '2-1',
        text: 'Bisakah Anda merekomendasikan menu makan siang sederhana yang tinggi protein?',
        sender: 'user',
        timestamp: new Date(Date.now() - 86400000 - 60000).toISOString(),
      },
      {
        id: '2-2',
        text: `### 🍎 Rekomendasi Menu Makan Siang Tinggi Protein

Berikut adalah tiga pilihan menu makan siang padat nutrisi yang dapat membantu memenuhi kebutuhan protein harian Anda, menjaga rasa kenyang lebih lama, dan mendukung kebugaran tubuh:

| Menu Makan Siang | Estimasi Protein | Bahan Utama | Waktu Pembuatan |
| :--- | :--- | :--- | :--- |
| **Mangkuk Kinoa Ayam Panggang** | ~40 gram | Dada ayam, kinoa, bayam, timun, keju feta, perasan lemon. | 15 menit |
| **Selada Tuna Pembungkus Selada** | ~32 gram | Tuna kaleng (dalam air), yoghurt Yunani plain (sebagai pengganti mayones), seledri. | 5 menit |
| **Bungkus (Wrap) Tempe & Tahu** | ~28 gram | Kulit tortilla gandum, tempe/tahu tumis, alpukat iris, saus salsa. | 10 menit |

#### Tips Nutrisi Seimbang:
*   **Gunakan Yoghurt Yunani:** Mengganti mayones dengan yoghurt Yunani tanpa rasa (plain) pada salad tuna atau ayam dapat meningkatkan kadar protein sekaligus mengurangi lemak jenuh.
*   **Kombinasikan Lauk Nabati:** Tempe dan tahu adalah sumber protein nabati lokal yang sangat baik, kaya akan serat, dan ramah di pencernaan.

> [!NOTE]
> **Edukasi Kesehatan:**
> Pastikan untuk mengombinasikan sumber protein dengan serat larut (dari sayuran hijau atau biji-bijian utuh) untuk menjaga kestabilan kadar gula darah dan mengoptimalkan pencernaan Anda.`,
        sender: 'ai',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        isMarkdown: true,
        pluginUsed: 'Nutrition',
      },
    ],
  },
];
