import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Send,
  Paperclip,
  Mic,
  Trash2,
  AlertCircle,
  Plus,
  Sparkles,
  FileDown,
} from 'lucide-react';

import { Button } from '../components/Button';

import { ChatBubble } from '../components/ChatBubble';
import { TypingIndicator } from '../components/TypingIndicator';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Message, ChatSession, AppSettings, HealthMetricSummary, AttachedFile } from '../types';
import { getGeminiResponse } from '../services/geminiAi';
import { INITIAL_SETTINGS, INITIAL_DASHBOARD_DATA } from '../services/mockData';
import { useHealthCompanion } from '../context/HealthCompanionContext';
import { useAuth } from '../context/AuthContext';

const PROMPT_SUGGESTIONS = [
  { label: 'Saya mengalami demam', emoji: '🩺', prompt: 'Saya mengalami demam dan badan terasa lemas. Apa langkah penanganan awal yang tepat?' },
  { label: 'Saya batuk sejak kemarin', emoji: '🩺', prompt: 'Saya batuk sejak kemarin dan tenggorokan terasa gatal. Bagaimana rekomendasi perawatan mandirinya?' },
  { label: 'Bagaimana cara menjaga pola makan sehat?', emoji: '🍎', prompt: 'Bagaimana cara menjaga pola makan sehat dan gizi seimbang harian?' },
  { label: 'Hitung BMI saya', emoji: '📈', prompt: 'Bagaimana cara menghitung BMI (Indeks Massa Tubuh) saya?' },
  { label: 'Berapa kebutuhan air minum harian?', emoji: '💧', prompt: 'Berapa kebutuhan air minum harian yang ideal untuk tubuh saya?' },
  { label: 'Apa penyebab sakit kepala?', emoji: '🩺', prompt: 'Apa kemungkinan penyebab sakit kepala tegang yang terasa kencang di kepala?' },
  { label: 'Tips tidur yang baik', emoji: '😴', prompt: 'Bagaimana tips tidur yang baik untuk menjaga kualitas tidur malam hari?' },
  { label: 'Bagaimana menjaga kesehatan jantung?', emoji: '❤️', prompt: 'Bagaimana menjaga kesehatan jantung melalui gaya hidup harian?' },
];

const isEmergencyMessage = (text: string): boolean => {
  const lowercaseText = text.toLowerCase();
  const emergencyKeywords = [
    'nyeri dada',
    'sesak napas',
    'sesak nafas',
    'serangan jantung',
    'gejala stroke',
    'kesulitan bernapas',
    'kesulitan nafas',
    'tidak bisa bernapas',
    'pendarahan hebat',
    'keracunan',
    'chest pain',
    'difficulty breathing',
    'shortness of breath',
    'cannot breathe',
    'heart attack',
    'stroke symptoms',
    'severe bleeding',
    'poisoning'
  ];
  return emergencyKeywords.some(keyword => lowercaseText.includes(keyword));
};

const getEmergencyWarningText = (language: 'en' | 'id'): string => {
  if (language === 'en') {
    return `**⚠️ MEDICAL EMERGENCY WARNING**\n\nThe symptoms you mentioned (**chest pain / difficulty breathing / other critical symptoms**) may indicate a life-threatening medical emergency.\n\n**Immediate Action Required:**\n1. **Call emergency services immediately (Dial 112 in Indonesia, 911 in the US, 999 in the UK).**\n2. Go to the nearest Emergency Room (ER) or hospital.\n3. Do not drive yourself to the hospital. Have someone else drive you or wait for an ambulance.`;
  }
  return `**⚠️ PERINGATAN DARURAT MEDIS**\n\nGejala yang Anda sebutkan (**nyeri dada / sesak napas / gejala kritis lainnya**) berpotensi merupakan kondisi medis darurat yang mengancam jiwa.\n\n**Langkah yang harus segera dilakukan:**\n1. **Segera hubungi Ambulans / Layanan Darurat (Telepon 112 untuk Indonesia).**\n2. Kunjungi Instalasi Gawat Darurat (IGD) di rumah sakit terdekat.\n3. Jangan mengemudi sendiri ke rumah sakit jika Anda mengalami nyeri dada atau sesak napas yang parah. Mintalah bantuan orang lain atau ambulans.\n4. Jika Anda berada di luar negeri, hubungi nomor panggilan darurat setempat (misal: 911 di AS, 999 di Inggris, 112 di Eropa).`;
};

const isInappropriateMessage = (text: string): boolean => {
  const lowercaseText = text.toLowerCase();
  const vulgarKeywords = [
    'kontol',
    'memek',
    'pepek',
    'ngentot',
    'ngewe',
    'entot',
    'jembut',
    'perek',
    'lonte',
    'pantek',
    'pukimai',
    'bangsat',
    'ngocok',
    'coli',
    'peli',
    'tetek',
    'toket',
    'ngentod',
    'anjing',
    'babi',
    'bajingan',
    'fuck',
    'bitch',
    'bastard',
    'dick',
    'pussy'
  ];
  return vulgarKeywords.some(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b|${keyword}`, 'i');
    return regex.test(lowercaseText);
  });
};

const getInappropriateWarningText = (language: 'en' | 'id'): string => {
  if (language === 'en') {
    return `**⚠️ AI SAFETY GUARDRAIL: INAPPROPRIATE CONTENT BLOCKED**\n\nWe detected the use of vulgar, offensive, or inappropriate language.\n\n**Usage Guidelines:**\n1. Please keep your language respectful and clean when consulting HealthMate AI.\n2. This platform is dedicated strictly to supportive health education and fitness monitoring.\n3. Vulgar or abusive terms are blocked by our safety policy.`;
  }
  return `**⚠️ BATASAN KEAMANAN AI: KONTEN TIDAK PANTAS DIBLOKIR**\n\nSistem kami mendeteksi penggunaan kata-kata tidak sopan, kasar, atau vulgar.\n\n**Panduan Penggunaan:**\n1. Harap gunakan bahasa yang sopan dan etis saat berkomunikasi dengan HealthMate AI.\n2. Platform ini didedikasikan secara khusus untuk edukasi kesehatan dan pemantauan kebugaran secara sehat.\n3. Penggunaan istilah kasar/vulgar diblokir oleh kebijakan keamanan kami demi menjaga etika layanan.`;
};

export const Chat: React.FC = () => {
  const navigate = useNavigate();
  const { speak } = useHealthCompanion();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentSessionId = searchParams.get('session');

  const [sessions, setSessions] = useLocalStorage<ChatSession[]>('healthmate-chat-sessions', []);
  const [settings] = useLocalStorage<AppSettings>('healthmate-settings', INITIAL_SETTINGS);
  const [metrics, setMetrics] = useLocalStorage<HealthMetricSummary>('healthmate-metrics', INITIAL_DASHBOARD_DATA);
  const { user } = useAuth();

  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [attachedFile, setAttachedFile] = useState<AttachedFile | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const isApiEnabled = Boolean(settings.apiKey?.trim());
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textInputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [recognitionInstance, setRecognitionInstance] = useState<any>(null);

  // Auto-scroll to bottom of conversation
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeSession?.messages, isTyping]);

  // Cleanup microphone on component unmount (BUG-17)
  useEffect(() => {
    return () => {
      if (recognitionInstance) {
        try { recognitionInstance.stop(); } catch { /* ignore */ }
      }
    };
  }, [recognitionInstance]);

  const isInitializingRef = useRef(false);

  // Load correct chat session on query param change
  useEffect(() => {
    if (sessions.length === 0) {
      if (!isInitializingRef.current) {
        isInitializingRef.current = true;
        handleCreateNewSession();
      }
      return;
    }

    if (currentSessionId) {
      const found = sessions.find((s) => s.id === currentSessionId);
      if (found) {
        setActiveSession(found);
      } else {
        setSearchParams({ session: sessions[0].id }, { replace: true });
      }
    } else {
      const sorted = [...sessions].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      if (sorted.length > 0) {
        setSearchParams({ session: sorted[0].id }, { replace: true });
      }
    }
  }, [currentSessionId, sessions]);

  // Handle auto-creating session if navigate state has createNew
  useEffect(() => {
    if (location.state && (location.state as any).createNew) {
      // Clear location state to prevent loop
      navigate(location.pathname, { replace: true });
      handleCreateNewSession();
    }
  }, [location.state]);

  // Auto-send forwarded dashboard health report if pending in sessionStorage
  useEffect(() => {
    const pendingReport = sessionStorage.getItem('pending_health_report_prompt');
    if (pendingReport && activeSession && !isTyping) {
      sessionStorage.removeItem('pending_health_report_prompt');
      handleSendMessage(pendingReport);
    }
  }, [activeSession, isTyping]);

  const handleCreateNewSession = () => {
    const newSession: ChatSession = {
      id: `chat-${Math.random().toString(36).slice(2, 11)}`,
      title: 'Konsultasi Baru',
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newSession, ...sessions];
    setSessions(updated);
    setSearchParams({ session: newSession.id });
    window.dispatchEvent(new Event('chat-sessions-updated'));
  };

  const executeLocalTool = (name: string, args: any) => {
    let currentMetrics = metrics || INITIAL_DASHBOARD_DATA;
    const savedMetrics = localStorage.getItem('healthmate-metrics');
    if (savedMetrics) {
      try {
        currentMetrics = JSON.parse(savedMetrics);
      } catch (e) {
        // ignore
      }
    }

    if (name === 'add_water') {
      const amount = Number(args.amount);
      const newLog = {
        id: `w-${Date.now()}`,
        amount,
        timestamp: new Date().toISOString(),
      };
      const updated = {
        ...currentMetrics,
        waterIntake: {
          ...currentMetrics.waterIntake,
          current: currentMetrics.waterIntake.current + amount,
          logs: [newLog, ...currentMetrics.waterIntake.logs].slice(0, 50),
        },
      };
      setMetrics(updated);
      window.dispatchEvent(new Event('metrics-updated'));

      return {
        status: 'success',
        added: amount,
        newTotal: updated.waterIntake.current,
        goal: updated.waterIntake.goal
      };
    }

    if (name === 'add_calorie') {
      const amount = Number(args.amount);
      const foodName = String(args.foodName);
      const mealType = args.mealType as 'breakfast' | 'lunch' | 'dinner' | 'snack';
      const newLog = {
        id: `c-${Date.now()}`,
        amount,
        timestamp: new Date().toISOString(),
        type: mealType,
        foodName,
      };
      const updated = {
        ...currentMetrics,
        calories: {
          ...currentMetrics.calories,
          current: currentMetrics.calories.current + amount,
          logs: [newLog, ...currentMetrics.calories.logs].slice(0, 50),
        },
      };
      setMetrics(updated);
      window.dispatchEvent(new Event('metrics-updated'));

      return {
        status: 'success',
        added: amount,
        foodName,
        mealType,
        newTotal: updated.calories.current,
        goal: updated.calories.goal
      };
    }

    if (name === 'add_exercise') {
      const duration = Number(args.duration);
      const activityType = String(args.activityType);
      const steps = args.steps ? Number(args.steps) : 0;
      const newLog = {
        id: `e-${Date.now()}`,
        duration,
        steps,
        activityType,
        timestamp: new Date().toISOString(),
      };
      const updated = {
        ...currentMetrics,
        exercise: {
          ...currentMetrics.exercise,
          duration: currentMetrics.exercise.duration + duration,
          steps: currentMetrics.exercise.steps + steps,
          logs: [newLog, ...currentMetrics.exercise.logs].slice(0, 50),
        },
      };
      setMetrics(updated);
      window.dispatchEvent(new Event('metrics-updated'));

      return {
        status: 'success',
        activityType,
        duration,
        addedSteps: steps,
        newTotalDuration: updated.exercise.duration,
        newSteps: updated.exercise.steps
      };
    }

    if (name === 'add_sleep') {
      const duration = Number(args.duration);
      const quality = (args.quality || 'Good') as 'Excellent' | 'Good' | 'Fair' | 'Poor';
      const newLog = {
        id: `s-${Date.now()}`,
        duration,
        quality,
        timestamp: new Date().toISOString(),
      };
      const updated = {
        ...currentMetrics,
        sleep: {
          ...currentMetrics.sleep,
          duration,
          quality,
          logs: [newLog, ...currentMetrics.sleep.logs].slice(0, 50),
        },
      };
      setMetrics(updated);
      window.dispatchEvent(new Event('metrics-updated'));

      return {
        status: 'success',
        duration,
        quality,
        newTotal: updated.sleep.duration
      };
    }

    if (name === 'calculate_bmi') {
      const w = Number(args.weight);
      const h = Number(args.height);
      const heightM = h / 100;
      const bmiVal = parseFloat((w / (heightM * heightM)).toFixed(1));

      // WHO Asia-Pacific 2004 cutoffs (appropriate for Indonesian users)
      let cat = 'Berat Badan Normal';
      if (bmiVal < 18.5) cat = 'Kurus (Underweight)';
      else if (bmiVal < 23.0) cat = 'Berat Badan Normal';
      else if (bmiVal < 27.5) cat = 'Gemuk (Overweight)';
      else cat = 'Sangat Gemuk (Obese)';

      const newRecord = {
        id: `bmi-${Date.now()}`,
        weight: w,
        height: h,
        bmi: bmiVal,
        category: cat,
        timestamp: new Date().toISOString(),
      };

      const updated = {
        ...currentMetrics,
        bmi: newRecord,
      };
      setMetrics(updated);

      const savedProfile = localStorage.getItem('healthmate-profile');
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        localStorage.setItem(
          'healthmate-profile',
          JSON.stringify({ ...parsed, weight: w, height: h })
        );
      }
      window.dispatchEvent(new Event('metrics-updated'));

      return {
        status: 'success',
        weight: w,
        height: h,
        bmi: bmiVal,
        category: cat
      };
    }

    return { status: 'error', message: 'Unknown tool' };
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || !activeSession || isTyping) return;

    // Create user message
    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      text: textToSend,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    // Update session locally first
    const updatedMessages = [...activeSession.messages, userMessage];
    
    // Auto-update conversation title if it was named "Konsultasi Baru" or "New Conversation"
    let title = activeSession.title;
    if (title === 'Konsultasi Baru' || title === 'New Conversation') {
      title = textToSend.length > 30 ? textToSend.substring(0, 30) + '...' : textToSend;
    }

    const updatedSession: ChatSession = {
      ...activeSession,
      title,
      messages: updatedMessages,
      updatedAt: new Date().toISOString(),
    };

    setSessions(prev => prev.map((s) => (s.id === activeSession.id ? updatedSession : s)));
    setActiveSession(updatedSession);
    setInputValue('');
    setAttachedFile(null);

    // SAFETY CHECK: Catch inappropriate/vulgar keywords locally (Guardrail)
    if (isInappropriateMessage(textToSend)) {
      setIsTyping(true);
      speak(settings.language === 'en' ? 'Inappropriate language detected. Request blocked.' : 'Bahasa tidak sopan terdeteksi. Permintaan diblokir.', 'error', 4000);
      
      setTimeout(() => {
        const safetyAiMsg: Message = {
          id: `msg-${Date.now()}-ai-safety`,
          text: getInappropriateWarningText(settings.language),
          sender: 'ai',
          timestamp: new Date().toISOString(),
          isMarkdown: true,
          isEmergency: true
        };

        const finalSession = {
          ...updatedSession,
          messages: [...updatedMessages, safetyAiMsg],
          updatedAt: new Date().toISOString(),
        };

        setSessions(prev => prev.map((s) => (s.id === activeSession.id ? finalSession : s)));
        setActiveSession(finalSession);
        setIsTyping(false);
        window.dispatchEvent(new Event('chat-sessions-updated'));
      }, 1000);

      return;
    }

    // SAFETY CHECK: Catch emergency keywords locally
    if (isEmergencyMessage(textToSend)) {
      setIsTyping(true);
      speak(settings.language === 'en' ? 'Critical symptoms detected. Displaying emergency warning.' : 'Gejala darurat terdeteksi. Menampilkan peringatan medis.', 'error', 4000);
      
      setTimeout(() => {
        const emergencyAiMsg: Message = {
          id: `msg-${Date.now()}-ai-emergency`,
          text: getEmergencyWarningText(settings.language),
          sender: 'ai',
          timestamp: new Date().toISOString(),
          isMarkdown: true,
          isEmergency: true
        };

        const finalSession = {
          ...updatedSession,
          messages: [...updatedMessages, emergencyAiMsg],
          updatedAt: new Date().toISOString(),
        };

        setSessions(prev => prev.map((s) => (s.id === activeSession.id ? finalSession : s)));
        setActiveSession(finalSession);
        setIsTyping(false);
        window.dispatchEvent(new Event('chat-sessions-updated'));
      }, 1000);

      return;
    }

    // Trigger typing response
    setIsTyping(true);
    speak(settings.language === 'en' ? 'Preparing health information for you...' : 'Sedang menyusun informasi kesehatan untuk Anda...', 'thinking', 0);
    
    // Build conversation history for context (last 6 messages, hemat token)
    const historyForApi = activeSession.messages
      .slice(-6)
      .map((m) => ({
        role: m.sender === 'user' ? 'user' as const : 'model' as const,
        parts: [{ text: m.text }],
      }));

    try {
      setApiError(null);
      let response = await getGeminiResponse(textToSend, settings, historyForApi, metrics, attachedFile);

      // Jika AI mengembalikan pemanggilan fungsi (Function Call / Tool Use)
      if (response.functionCall) {
        const toolName = response.functionCall.name;
        const toolArgs = response.functionCall.args;
        
        speak(settings.language === 'en' ? `Logging data...` : `Mencatat data kesehatan Anda...`, 'thinking', 0);
        
        // Eksekusi tool secara lokal
        const toolResult = executeLocalTool(toolName, toolArgs);

        // Bangun history turn kedua untuk Gemini
        const modelFunctionCallHistory = {
          role: 'model' as const,
          parts: [
            {
              functionCall: {
                name: toolName,
                args: toolArgs,
              },
            },
          ],
        };

        const userFunctionResponseHistory = {
          role: 'user' as const,
          parts: [
            {
              functionResponse: {
                name: toolName,
                response: toolResult,
              },
            },
          ],
        };

        const doubleTurnHistory = [...historyForApi, modelFunctionCallHistory, userFunctionResponseHistory];

        // Panggil kembali Gemini dengan history lengkap agar menghasilkan respon konfirmasi teks
        const finalResponse = await getGeminiResponse(null, settings, doubleTurnHistory, metrics, null);
        response = finalResponse;
      }

      const aiMessage: Message = (() => {
        // Jika API memblokir response karena filter keamanan, tampilkan pesan ramah
        if (response.blocked) {
          const blockText = settings.language === 'en'
            ? `**🛡️ Safety System Activated**\n\nYour message was reviewed by our clinical safety system and could not be processed as requested.\n\n**If you are in a mental health crisis or emergency:**\n- 🆘 **Call 112** (Emergency)\n- 📞 **Into The Light (Mental Health Hotline): 119 ext. 8**\n- 🏥 Visit your nearest Emergency Room (ER) immediately\n\nI am here to support your health and wellness journey. Feel free to ask about symptoms, nutrition, fitness, or general health topics.`
            : `**🛡️ Sistem Keamanan Aktif**\n\nPesan Anda telah ditinjau oleh sistem keamanan klinis kami dan tidak dapat diproses sesuai permintaan.\n\n**Jika Anda dalam krisis kesehatan jiwa atau kedaruratan medis:**\n- 🆘 **Hubungi 112** (Darurat)\n- 📞 **Into The Light (Hotline Kesehatan Jiwa): 119 ext. 8**\n- 🏥 Segera kunjungi IGD rumah sakit terdekat\n\nSaya ada untuk mendukung perjalanan kesehatan Anda. Silakan tanyakan tentang gejala, gizi, kebugaran, atau topik kesehatan lainnya.`;
          return {
            id: `msg-${Date.now()}-ai-blocked`,
            text: blockText,
            sender: 'ai' as const,
            timestamp: new Date().toISOString(),
            isMarkdown: true,
            isEmergency: true,
          };
        }
        return {
          id: `msg-${Date.now()}-ai`,
          text: response.text,
          sender: 'ai' as const,
          timestamp: new Date().toISOString(),
          isMarkdown: true,
          pluginUsed: response.pluginUsed,
        };
      })();

      const finalSession = {
        ...updatedSession,
        messages: [...updatedMessages, aiMessage],
        updatedAt: new Date().toISOString(),
      };

      setSessions(prev => prev.map((s) => (s.id === activeSession.id ? finalSession : s)));
      setActiveSession(finalSession);

      window.dispatchEvent(new Event('chat-sessions-updated'));
      speak(settings.language === 'en' ? 'Hope this health advice helps you.' : 'Semoga saran kesehatan ini dapat membantu Anda.', 'success', 6000);
    } catch (e: any) {
      console.error('[HealthMate AI]', e);
      const msg = e?.message || (settings.language === 'en' ? 'An error occurred while contacting AI.' : 'Terjadi kesalahan saat menghubungi AI.');
      setApiError(msg);
      speak(settings.language === 'en' ? 'Sorry, connection issue. Please try sending again.' : 'Maaf, terjadi gangguan koneksi. Silakan coba kirim ulang.', 'error', 6000);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearHistory = () => {
    if (!activeSession) return;
    const updatedSession = {
      ...activeSession,
      messages: [],
      updatedAt: new Date().toISOString(),
    };
    setSessions(prev => prev.map((s) => (s.id === activeSession.id ? updatedSession : s)));
    setActiveSession(updatedSession);
  };

  const handleExportPDF = () => {
    if (!activeSession || activeSession.messages.length === 0) return;

    const sessionDate = new Date(activeSession.createdAt).toLocaleDateString(settings.language === 'en' ? 'en-US' : 'id-ID', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
    
    const activePluginsText = Object.entries(settings.plugins)
      .filter(([, enabled]) => enabled)
      .map(([name]) => name)
      .join(', ') || (settings.language === 'en' ? 'None' : 'Tidak ada');

    const bmiText = metrics?.bmi ? `${metrics.bmi.bmi} (${metrics.bmi.category})` : 'N/A';
    const bpmText = metrics?.heartHealth ? `${metrics.heartHealth.bpm} bpm` : 'N/A';
    const bpText = metrics?.heartHealth?.bloodPressure || 'N/A';
    const waterText = metrics?.waterIntake ? `${metrics.waterIntake.current} / ${metrics.waterIntake.goal} ml` : 'N/A';
    const stepsText = metrics?.exercise ? `${metrics.exercise.steps.toLocaleString()}` : 'N/A';
    const durationText = metrics?.exercise ? `${metrics.exercise.duration} min` : 'N/A';

    const messagesHtml = activeSession.messages.map((msg) => {
      const sender = msg.sender === 'ai' ? '🤖 HealthMate AI' : `👤 ${user?.name || 'Saya'}`;
      const time = new Date(msg.timestamp).toLocaleTimeString(settings.language === 'en' ? 'en-US' : 'id-ID', { hour: '2-digit', minute: '2-digit' });
      const bg = msg.sender === 'ai' ? '#f8fafc' : '#f0fdf4';
      const border = msg.isEmergency ? '2px solid #ef4444' : '1px solid #e2e8f0';
      const cleanText = msg.text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br/>');
      return `
        <div style="margin-bottom:14px; padding:14px 18px; border-radius:14px; background:${bg}; border:${border}; box-shadow: 0 1px 2px rgba(0,0,0,0.02);">
          <div style="font-size:11px; font-weight:700; color:#64748b; margin-bottom:6px; display:flex; justify-content:space-between;">
            <span>${sender}</span>
            <span style="font-weight:normal; color:#94a3b8;">${time}</span>
          </div>
          <div style="font-size:13.5px; color:#1e293b; line-height:1.65; font-family:inherit;">${cleanText}</div>
        </div>`;
    }).join('');

    const tPdf = {
      en: {
        docTitle: 'Clinical Consultation Report',
        patient: 'Patient Name',
        date: 'Report Date',
        plugins: 'Active Modules',
        messageCount: 'Total Messages',
        vitalsTitle: '📊 Patient Vitals & Health Metrics Summary (Local Dashboard)',
        bmi: 'Body Mass Index (BMI)',
        pulse: 'Heart Rate',
        bp: 'Blood Pressure',
        water: 'Water Hydration',
        steps: 'Daily Steps',
        workout: 'Exercise Duration',
        disclaimer: '⚠️ <strong>Important Medical Disclaimer:</strong> This document is generated for health educational purposes and is based on simulated AI analysis and self-logged vitals. It does NOT constitute a formal medical diagnosis. Please present this report to a licensed physician or specialist for medical verification.',
      },
      id: {
        docTitle: 'Laporan Konsultasi Klinis',
        patient: 'Nama Pasien',
        date: 'Tanggal Laporan',
        plugins: 'Modul Aktif',
        messageCount: 'Total Pesan',
        vitalsTitle: '📊 Ringkasan Vitals & Metrik Kesehatan Pasien (Dasbor Lokal)',
        bmi: 'Indeks Massa Tubuh (BMI)',
        pulse: 'Denyut Jantung',
        bp: 'Tekanan Darah',
        water: 'Asupan Air (Hidrasi)',
        steps: 'Langkah Kaki',
        workout: 'Waktu Olahraga',
        disclaimer: '⚠️ <strong>Penafian Medis Penting:</strong> Dokumen ini disusun untuk tujuan edukasi pola hidup sehat berdasarkan analisis AI simulatif dan pencatatan metrik mandiri. Laporan ini BUKAN diagnosis medis resmi. Harap tunjukkan dokumen ini kepada dokter spesialis atau tenaga medis profesional untuk pemeriksaan klinis lebih lanjut.',
      }
    }[settings.language === 'en' ? 'en' : 'id'];

    const printContent = `
      <!DOCTYPE html>
      <html lang="${settings.language}">
      <head>
        <meta charset="UTF-8" />
        <title>${tPdf.docTitle} — ${activeSession.title}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 35px; color: #1e293b; max-width: 850px; margin: auto; line-height: 1.5; }
          h1 { color: #059669; font-size: 24px; margin: 0 0 6px 0; font-weight: 800; }
          .header-row { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2px solid #10b981; padding-bottom: 12px; margin-bottom: 20px; }
          .meta-info { font-size: 11.5px; color: #64748b; line-height: 1.7; }
          .vitals-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 16px 20px; margin-bottom: 24px; }
          .vitals-title { font-size: 12.5px; font-weight: 800; color: #0f172a; margin-top: 0; margin-bottom: 12px; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
          .vitals-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px 20px; }
          .vital-item { font-size: 12px; color: #334155; }
          .vital-item strong { color: #0f172a; }
          .disclaimer { font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 12px; margin-top: 30px; text-align: justify; line-height: 1.6; }
          @media print { body { padding: 15px; } .vitals-card { background: #f8fafc !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
        </style>
      </head>
      <body>
        <div class="header-row">
          <div>
            <h1>🩺 HealthMate AI</h1>
            <div class="meta-info">
              <strong>${tPdf.plugins}:</strong> ${activePluginsText}<br/>
              <strong>${tPdf.messageCount}:</strong> ${activeSession.messages.length}
            </div>
          </div>
          <div style="text-align: right;" class="meta-info">
            <strong>${tPdf.patient}:</strong> ${user?.name || 'Guest User'}<br/>
            <strong>${tPdf.date}:</strong> ${sessionDate}
          </div>
        </div>

        <!-- 📊 Vitals & Metrics Grid Card -->
        <div class="vitals-card">
          <div class="vitals-title">${tPdf.vitalsTitle}</div>
          <div class="vitals-grid">
            <div class="vital-item"><strong>${tPdf.bmi}:</strong> ${bmiText}</div>
            <div class="vital-item"><strong>${tPdf.pulse}:</strong> ${bpmText}</div>
            <div class="vital-item"><strong>${tPdf.bp}:</strong> ${bpText} mmHg</div>
            <div class="vital-item"><strong>${tPdf.water}:</strong> ${waterText}</div>
            <div class="vital-item"><strong>${tPdf.steps}:</strong> ${stepsText}</div>
            <div class="vital-item"><strong>${tPdf.workout}:</strong> ${durationText}</div>
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          ${messagesHtml}
        </div>

        <div class="disclaimer">
          ${tPdf.disclaimer}
          <div style="margin-top: 8px; font-weight: bold; color: #0f172a;">HealthMate AI Medical Assistant &bull; ${new Date().toLocaleDateString()}</div>
        </div>
      </body>
      </html>`;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const handleDeleteSession = () => {
    if (!activeSession) return;
    const updatedSessions = sessions.filter((s) => s.id !== activeSession.id);
    setSessions(updatedSessions);
    
    // Force sidebar update
    window.dispatchEvent(new Event('chat-sessions-updated'));
    
    if (updatedSessions.length > 0) {
      setSearchParams({ session: updatedSessions[0].id });
    } else {
      // If no sessions, auto-create one
      const newSession: ChatSession = {
        id: `chat-${Math.random().toString(36).slice(2, 11)}`,
        title: settings.language === 'en' ? 'New Conversation' : 'Konsultasi Baru',
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setSessions([newSession]);
      setSearchParams({ session: newSession.id });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  const handleSuggestionClick = (prompt: string) => {
    handleSendMessage(prompt);
  };

  const toggleSpeechRecognition = () => {
    if (isListening) {
      if (recognitionInstance) {
        recognitionInstance.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(settings.language === 'en' ? 'Speech recognition is not supported in this browser.' : 'Pengenalan suara tidak didukung di browser ini.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = settings.language === 'en' ? 'en-US' : 'id-ID';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      speak(settings.language === 'en' ? 'Listening...' : 'Mendengarkan...', 'thinking', 3000);
    };

    recognition.onerror = (event: any) => {
      console.error(event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      const speechToText = event.results[0][0].transcript;
      setInputValue(speechToText);
    };

    setRecognitionInstance(recognition);
    recognition.start();
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1];
      setAttachedFile({
        name: file.name,
        type: 'image',
        base64: base64Data,
        mimeType: file.type,
      });
    };
    reader.readAsDataURL(file);
  };

  // Get plugins list to display in header
  const activePlugins = Object.entries(settings.plugins)
    .filter(([_, enabled]) => enabled)
    .map(([name]) => name);

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] max-w-5xl mx-auto glassmorphism dark:glassmorphism-dark rounded-3xl overflow-hidden shadow-glass dark:shadow-glass-dark transition-all duration-300">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white/30 dark:bg-slate-900/40 backdrop-blur-md border-b border-gray-100/50 dark:border-slate-800/50">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="font-semibold font-display text-gray-900 dark:text-white text-base tracking-wide">
              {activeSession?.title || 'Konsultasi HealthMate'}
            </span>
          </div>
          {/* Active plugins indicators + AI mode badge */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[9px] text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wider">Fitur Aktif:</span>
            {activePlugins.length === 0 ? (
              <span className="text-[9px] text-rose-500 font-bold uppercase tracking-wide">Tidak ada</span>
            ) : (
              activePlugins.map((plugin) => (
                <span
                  key={plugin}
                  className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                >
                  {plugin}
                </span>
              ))
            )}
            {/* AI mode indicator */}
            <span className={`ml-1.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-semibold border ${
              isApiEnabled
                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                : 'bg-gray-100 text-gray-400 dark:bg-slate-800 dark:text-gray-500 border-gray-200/50 dark:border-slate-700/50'
            }`}>
              {isApiEnabled ? '⚡ Gemini AI' : '🔌 Offline Mode'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Export to PDF */}
          <button
            onClick={handleExportPDF}
            disabled={!activeSession || activeSession.messages.length === 0}
            title="Ekspor Laporan PDF"
            className="p-2.5 rounded-xl text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:text-gray-400 dark:hover:text-emerald-400 dark:hover:bg-emerald-950/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <FileDown className="w-4 h-4" />
          </button>

          {/* Clear Session Messages */}
          <button
            onClick={handleClearHistory}
            disabled={!activeSession || activeSession.messages.length === 0}
            title="Bersihkan Obrolan"
            className="p-2.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          
          {/* Delete Session completely */}
          <button
            onClick={handleDeleteSession}
            title="Hapus Percakapan"
            className="p-2.5 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:text-gray-400 dark:hover:text-rose-400 dark:hover:bg-rose-950/20 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <AlertCircle className="w-4 h-4" />
          </button>

          {/* New Chat shortcut */}
          <button
            onClick={handleCreateNewSession}
            title="Konsultasi Baru"
            className="p-2.5 rounded-xl text-emerald-600 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:hover:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-100/30 dark:border-emerald-900/30 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Conversation Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 scroll-smooth">
        {activeSession?.messages.length === 0 ? (
          /* Empty Chat State with suggestions */
          <div className="h-full flex flex-col justify-center items-center max-w-2xl mx-auto text-center space-y-8 py-10 px-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner relative group">
              <div className="absolute inset-0 bg-emerald-400/10 rounded-2xl blur-md group-hover:blur-lg transition-all duration-300"></div>
              <Sparkles className="w-8 h-8 relative z-10 animate-pulse-slow" />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold font-display text-gray-900 dark:text-white tracking-tight sm:text-2xl bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Bagaimana HealthMate dapat membantu Anda hari ini?
              </h3>
              <p className="text-xs text-gray-400 dark:text-gray-400 leading-relaxed max-w-lg mx-auto">
                Pilih salah satu saran konsultasi di bawah ini atau jelaskan kondisi kesehatan Anda secara detail untuk mendapatkan asisten konsultasi AI yang adaptif.
              </p>
            </div>

            {/* Suggestions Bento Chips grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5 w-full pt-6">
              {PROMPT_SUGGESTIONS.map((sug) => (
                <button
                  key={sug.label}
                  onClick={() => handleSuggestionClick(sug.prompt)}
                  className="flex items-center gap-3 px-4.5 py-4.5 rounded-2xl border border-gray-150/40 dark:border-slate-800/40 bg-white/40 dark:bg-slate-900/30 hover:bg-white dark:hover:bg-slate-800 hover:border-emerald-500/30 dark:hover:border-emerald-500/30 hover:shadow-soft text-xs font-semibold text-gray-700 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-400 text-left transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] border-l-4 border-l-emerald-500/70"
                >
                  <span className="text-base select-none shrink-0">{sug.emoji}</span>
                  <span className="truncate leading-relaxed">{sug.label}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Messages list */
          <div className="space-y-2">
            {activeSession?.messages.map((msg) => (
              <ChatBubble
                key={msg.id}
                message={msg}
                onDelete={(id) => {
                  if (!activeSession) return;
                  const updatedMessages = activeSession.messages.filter((m) => m.id !== id);
                  const updatedSession = { ...activeSession, messages: updatedMessages };
                  setSessions(sessions.map((s) => (s.id === activeSession.id ? updatedSession : s)));
                  setActiveSession(updatedSession);
                }}
              />
            ))}
            
            {/* Show typing animation */}
            {isTyping && (
              <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500 italic pl-16 py-2">
                <TypingIndicator />
                <span>Sedang menyiapkan informasi...</span>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input controls pane */}
      <div className="p-4 border-t border-gray-100/50 dark:border-slate-800/50 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md flex flex-col gap-2">
        
        {/* Attachment preview banner */}
        {attachedFile && (
          <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-emerald-500/10 text-xs font-medium text-emerald-700 dark:text-emerald-350 border border-emerald-500/20 w-fit transition-all duration-200 animate-in fade-in slide-in-from-bottom-2">
            <span className="flex items-center gap-1.5">
              <Paperclip className="w-3.5 h-3.5 text-emerald-500" />
              Terlampir: {attachedFile.name}
            </span>
            <button
              onClick={() => setAttachedFile(null)}
              className="ml-3 font-bold text-emerald-600 hover:text-rose-500 transition-colors"
            >
              ×
            </button>
          </div>
        )}

        {/* API Error Banner */}
        {apiError && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-xs text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30 animate-in fade-in slide-in-from-bottom-2">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span className="flex-1 truncate">{apiError}</span>
            <button onClick={() => setApiError(null)} className="font-bold hover:text-rose-800 dark:hover:text-rose-350 transition-colors">×</button>
          </div>
        )}
        {/* Clinical trust compliance badges */}
        <div className="flex items-center justify-between px-1.5 py-0.5 text-[10px] font-semibold text-gray-400 dark:text-gray-500 select-none">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            {settings.language === 'en' ? 'Clinical Assistant Mode' : 'Mode Asisten Klinis'}
          </span>
          <span className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded border border-emerald-500/20 text-[9px]">WHO Alignment</span>
          </span>
        </div>

        <div className="flex items-end gap-3">
          {/* File Upload Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {/* File Upload Button */}
          <button
            onClick={handleAttachmentClick}
            title={settings.language === 'en' ? "Attach image" : "Lampirkan gambar"}
            className="p-3.5 rounded-2xl bg-white border border-gray-200/80 hover:bg-gray-50 dark:bg-slate-900 dark:border-slate-800 dark:hover:bg-slate-800 text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 shrink-0 transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          {/* Prompt Entry Box */}
          <div className="flex-1 relative flex items-center bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all duration-200">
            <textarea
              ref={textInputRef}
              rows={1}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isListening
                  ? (settings.language === 'en' ? "Listening..." : "Mendengarkan...")
                  : (settings.language === 'en' ? "Type your question..." : "Tuliskan pertanyaan Anda...")
              }
              disabled={isListening}
              className="w-full pl-4 pr-12 py-3.5 rounded-2xl text-sm bg-transparent border-0 outline-none resize-none max-h-24 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            />

            {/* Microphone Button */}
            <div className="absolute right-3.5 flex items-center gap-1">
              <button
                onClick={toggleSpeechRecognition}
                title={settings.language === 'en' ? "Voice transcription" : "Transkripsi suara"}
                className={`p-1.5 rounded-xl transition-all duration-200 ${
                  isListening
                    ? 'bg-rose-500 text-white animate-mic-glow'
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                }`}
              >
                <Mic className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Send Button */}
          <Button
            onClick={() => handleSendMessage(inputValue)}
            disabled={!inputValue.trim() || isTyping || isListening}
            className="p-4 rounded-2xl shadow-md bg-gradient-to-r from-emerald-600 to-teal-600 border-none shrink-0 transition-all duration-200 hover:scale-105 active:scale-95 disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4 text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
};
