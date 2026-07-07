import type { AppSettings } from '../types';

export const DEFAULT_MODEL = 'gemini-2.5-flash';

interface GeminiResponse {
  text: string;
  pluginUsed?: string;
}

// System instruction yang singkat dan hemat token
const SYSTEM_PROMPT = `Anda adalah HealthMate AI, asisten kesehatan edukatif berbahasa Indonesia. Berikan informasi kesehatan umum yang singkat, jelas, dan aman. 
ATURAN PENTING:
- Selalu gunakan bahasa Indonesia yang natural dan empati
- Jangan berikan diagnosis pasti. Gunakan frasa "kemungkinan penyebab", "informasi umum", "rekomendasi mandiri"
- Selalu sarankan konsultasi dokter untuk kondisi serius
- Jawaban maksimal 300 kata agar hemat token
- Gunakan format markdown sederhana (heading, bullet point)
- Akhiri dengan catatan singkat untuk konsultasi dokter jika diperlukan`;

export const getGeminiResponse = async (
  userPrompt: string,
  settings: AppSettings,
  conversationHistory: { role: 'user' | 'model'; parts: { text: string }[] }[] = []
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

  const pluginContext = enabledPlugins.length > 0
    ? `\nModul aktif: ${enabledPlugins.join(', ')}. Prioritaskan topik yang relevan dengan modul ini dalam respons Anda.`
    : '\nSemua modul nonaktif. Berikan respons umum saja.';

  const systemPromptWithPlugins = SYSTEM_PROMPT + pluginContext;

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
