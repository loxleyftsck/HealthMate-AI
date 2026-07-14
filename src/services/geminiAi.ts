import type { AppSettings, HealthMetricSummary } from '../types';

export const DEFAULT_MODEL = 'gemini-2.5-flash';

interface GeminiResponse {
  text: string;
  pluginUsed?: string;
}

export const getGeminiResponse = async (
  userPrompt: string,
  settings: AppSettings,
  conversationHistory: { role: 'user' | 'model'; parts: { text: string }[] }[] = [],
  metrics?: HealthMetricSummary | null
): Promise<GeminiResponse> => {
  const apiKey = settings.apiKey?.trim();

  const enabledPlugins = Object.entries(settings.plugins ?? {})
    .filter(([, enabled]) => enabled)
    .map(([name]) => name);

  // Jika API key tidak ada, fallback ke mock
  if (!apiKey) {
    return import('./mockAi').then(({ getMockResponse }) => getMockResponse(userPrompt, enabledPlugins));
  }

  const model = settings.model?.trim() || DEFAULT_MODEL;
  const lang = settings.language || 'id';

  const systemPrompt = lang === 'en'
    ? `You are HealthMate AI, a supportive and educational health assistant.
Interaction Principles (Motivational Interviewing):
- Use an empathetic, collaborative, and warm tone.
- Avoid judgmental language or rigid commands (e.g., use "You might consider..." rather than "You must...").
- Support user autonomy and gradual healthy habits.
Key Rules:
- Never provide a definitive diagnosis. Use phrases like "possible causes", "general information", or "self-care recommendations".
- Always advise consulting a professional healthcare provider for serious symptoms.
- Keep responses concise (maximum 300 words) to save tokens.
- Use simple markdown formatting (bullet points, bold text).
- End with a friendly reminder to consult a medical professional if needed.`
    : `Anda adalah HealthMate AI, asisten kesehatan edukatif yang suportif.
Prinsip Interaksi (Motivational Interviewing):
- Gunakan nada bicara yang empati, kolaboratif, dan hangat.
- Hindari nada menghakimi atau perintah kaku (misal: gunakan "Anda dapat mencoba..." daripada "Anda harus...").
- Dorong kemandirian dan kebiasaan sehat secara bertahap.
Aturan Penting:
- Jangan berikan diagnosis pasti. Gunakan frasa seperti "kemungkinan penyebab", "informasi umum", atau "rekomendasi mandiri".
- Selalu sarankan berkonsultasi dengan dokter untuk keluhan serius.
- Batasi jawaban maksimal 300 kata agar singkat, padat, dan hemat token.
- Gunakan markdown sederhana (bullet points, bold text).
- Akhiri dengan pengingat ramah untuk berkonsultasi ke tenaga medis jika diperlukan.`;

  const pluginContext = enabledPlugins.length > 0
    ? (lang === 'en'
        ? `\nActive modules: ${enabledPlugins.join(', ')}. Prioritize topics related to these modules in your response.`
        : `\nModul aktif: ${enabledPlugins.join(', ')}. Prioritaskan topik yang relevan dengan modul ini dalam respons Anda.`)
    : (lang === 'en'
        ? '\nAll modules are disabled. Provide general responses only.'
        : '\nSemua modul nonaktif. Berikan respons umum saja.');

  let metricsContext = '';
  if (metrics) {
    const bmiText = metrics.bmi 
      ? `${metrics.bmi.bmi} (Category: ${metrics.bmi.category})`
      : 'Not calculated yet';
    const waterText = `${metrics.waterIntake.current}/${metrics.waterIntake.goal} ml`;
    const calorieText = `${metrics.calories.current}/${metrics.calories.goal} kcal`;
    const exerciseText = `${metrics.exercise.duration} mins, Steps: ${metrics.exercise.steps}`;
    const sleepText = `${metrics.sleep.duration} hours (Quality: ${metrics.sleep.quality || 'N/A'})`;
    const heartText = `${metrics.heartHealth.bpm} bpm, Blood Pressure: ${metrics.heartHealth.bloodPressure || 'N/A'}`;

    metricsContext = lang === 'en'
      ? `\n\n[CURRENT USER HEALTH METRICS]
Use this real-time local dashboard data to answer personalized health questions:
- BMI: ${bmiText}
- Water Intake: ${waterText}
- Calories Logged: ${calorieText}
- Workout & Activity: ${exerciseText}
- Sleep Last Night: ${sleepText}
- Heart Vital Stats: ${heartText}`
      : `\n\n[DATA KESEHATAN PENGGUNA SAAT INI]
Gunakan data dasbor lokal waktu nyata ini untuk menjawab pertanyaan kesehatan personal pengguna:
- BMI: ${metrics.bmi ? `${metrics.bmi.bmi} (Kategori: ${metrics.bmi.category})` : 'Belum dihitung'}
- Asupan Air: ${metrics.waterIntake.current}/${metrics.waterIntake.goal} ml
- Kalori Terkonsumsi: ${metrics.calories.current}/${metrics.calories.goal} kcal
- Olahraga & Aktivitas: ${metrics.exercise.duration} menit, Langkah: ${metrics.exercise.steps}
- Tidur Tadi Malam: ${metrics.sleep.duration} jam (Kualitas: ${metrics.sleep.quality || 'N/A'})
- Detak Jantung & Tensi: ${metrics.heartHealth.bpm} bpm, Tekanan Darah: ${metrics.heartHealth.bloodPressure || 'N/A'}`;
  }

  const systemPromptWithPlugins = systemPrompt + pluginContext + metricsContext;

  // Bangun history percakapan (maksimal 6 pesan terakhir untuk hemat token)
  const recentHistory = conversationHistory.slice(-6);

  const requestBody = {
    system_instruction: {
      parts: [{ text: systemPromptWithPlugins }],
    },
    contents: [
      ...recentHistory,
      {
        role: 'user',
        parts: [{ text: userPrompt }],
      },
    ],
    generationConfig: {
      temperature: settings.temperature ?? 0.7,
      maxOutputTokens: 1024, // Cukup untuk respons kesehatan yang lengkap
      topP: 0.8,
      topK: 40,
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    ],
  };

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    const errMsg = (errData as any)?.error?.message || res.statusText;
    console.error('[HealthMate AI] API error details:', errMsg);

    // Handle rate limit gracefully - fallback ke mock
    if (res.status === 429) {
      console.warn('[HealthMate AI] Rate limit reached, switching to offline mode...');
      return import('./mockAi').then(({ getMockResponse }) => getMockResponse(userPrompt, enabledPlugins));
    }

    // Handle model not found - fallback ke mock
    if (res.status === 404) {
      console.warn(`[HealthMate AI] Model "${model}" not found, switching to offline mode...`);
      return import('./mockAi').then(({ getMockResponse }) => getMockResponse(userPrompt, enabledPlugins));
    }

    // Sanitize error message — jangan expose detail API ke UI
    const safeMsg = res.status === 400
      ? 'Permintaan tidak valid. Periksa konfigurasi API Anda.'
      : res.status === 403
      ? 'API key tidak valid atau tidak memiliki akses. Periksa di Pengaturan.'
      : 'Terjadi kesalahan pada layanan AI. Silakan coba lagi.';

    throw new Error(safeMsg);
  }

  const data = await res.json();
  const text =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    'Maaf, saya tidak dapat memproses permintaan Anda saat ini. Silakan coba lagi.';

  return { text };
};
