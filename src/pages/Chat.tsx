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
} from 'lucide-react';

import { Button } from '../components/Button';

import { ChatBubble } from '../components/ChatBubble';
import { TypingIndicator } from '../components/TypingIndicator';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Message, ChatSession, AppSettings, HealthMetricSummary, AttachedFile } from '../types';
import { getGeminiResponse } from '../services/geminiAi';
import { INITIAL_SETTINGS } from '../services/mockData';
import { useHealthCompanion } from '../context/HealthCompanionContext';

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

export const Chat: React.FC = () => {
  const navigate = useNavigate();
  const { speak } = useHealthCompanion();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentSessionId = searchParams.get('session');

  const [sessions, setSessions] = useLocalStorage<ChatSession[]>('healthmate-chat-sessions', []);
  const [settings] = useLocalStorage<AppSettings>('healthmate-settings', INITIAL_SETTINGS);
  const [metrics] = useLocalStorage<HealthMetricSummary | null>('healthmate-metrics', null);

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

  // Load correct chat session on query param change
  useEffect(() => {
    if (sessions.length === 0) {
      // Seeding sessions handled in Sidebar, but if we land here directly, initialize
      return;
    }

    if (currentSessionId) {
      const found = sessions.find((s) => s.id === currentSessionId);
      if (found) {
        setActiveSession(found);
      } else {
        // Fallback: if session not found, route to first one
        setSearchParams({ session: sessions[0].id });
      }
    } else {
      // Default: load the most recent session
      const sorted = [...sessions].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      if (sorted.length > 0) {
        setSearchParams({ session: sorted[0].id });
      } else {
        // Create initial session if none exist
        handleCreateNewSession();
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

  const handleCreateNewSession = () => {
    const newSession: ChatSession = {
      id: `chat-${Math.random().toString(36).substr(2, 9)}`,
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

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || !activeSession) return;

    // Create user message
    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      text: textToSend,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    // Update session locally first
    const updatedMessages = [...activeSession.messages, userMessage];
    
    // Auto-update conversation title if it was named "Konsultasi Baru"
    let title = activeSession.title;
    if (title === 'Konsultasi Baru') {
      title = textToSend.length > 30 ? textToSend.substring(0, 30) + '...' : textToSend;
    }

    const updatedSession: ChatSession = {
      ...activeSession,
      title,
      messages: updatedMessages,
      updatedAt: new Date().toISOString(),
    };

    // Update sessions database (functional update to avoid stale closure)
    setSessions(prev => prev.map((s) => (s.id === activeSession.id ? updatedSession : s)));
    setActiveSession(updatedSession);
    setInputValue('');
    setAttachedFile(null);

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
    const historyForApi = updatedMessages
      .slice(-6)
      .map((m) => ({
        role: m.sender === 'user' ? 'user' as const : 'model' as const,
        parts: [{ text: m.text }],
      }));

    // Generate AI response via Gemini (with mock fallback)
    try {
      setApiError(null);
      const response = await getGeminiResponse(textToSend, settings, historyForApi, metrics, attachedFile);

      const aiMessage: Message = {
        id: `msg-${Date.now()}-ai`,
        text: response.text,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        isMarkdown: true,
        pluginUsed: response.pluginUsed,
      };

      const finalSession = {
        ...updatedSession,
        messages: [...updatedMessages, aiMessage],
        updatedAt: new Date().toISOString(),
      };

      setSessions(prev => prev.map((s) => (s.id === activeSession.id ? finalSession : s)));
      setActiveSession(finalSession);

      // Dispatch custom event to notify sidebar
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
        id: `chat-${Math.random().toString(36).substr(2, 9)}`,
        title: 'New Conversation',
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
    <div className="flex flex-col h-[calc(100vh-10rem)] max-w-5xl mx-auto bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 rounded-3xl overflow-hidden shadow-soft">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-gray-50/50 dark:bg-slate-900/60 border-b border-gray-100 dark:border-slate-800/60">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-bold font-display text-gray-900 dark:text-white text-sm">
              {activeSession?.title || 'Konsultasi HealthMate'}
            </span>
          </div>
          {/* Active plugins indicators + AI mode badge */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Fitur Aktif:</span>
            {activePlugins.length === 0 ? (
              <span className="text-[10px] text-rose-500 font-bold uppercase">Tidak ada</span>
            ) : (
              activePlugins.map((plugin) => (
                <span
                  key={plugin}
                  className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                >
                  {plugin}
                </span>
              ))
            )}
            {/* AI mode indicator */}
            <span className={`ml-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold ${
              isApiEnabled
                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                : 'bg-gray-100 text-gray-400 dark:bg-slate-800 dark:text-gray-500'
            }`}>
              {isApiEnabled ? '⚡ Gemini AI' : '🔌 Offline Mode'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Clear Session Messages */}
          <button
            onClick={handleClearHistory}
            disabled={!activeSession || activeSession.messages.length === 0}
            title="Bersihkan Obrolan"
            className="p-2 rounded-xl text-gray-400 hover:text-gray-650 hover:bg-gray-100 dark:text-gray-500 dark:hover:text-gray-300 dark:hover:bg-slate-800/60 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          
          {/* Delete Session completely */}
          <button
            onClick={handleDeleteSession}
            title="Hapus Percakapan"
            className="p-2 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:text-gray-500 dark:hover:text-rose-400 dark:hover:bg-rose-950/20 transition-colors"
          >
            <AlertCircle className="w-4 h-4" />
          </button>

          {/* New Chat shortcut */}
          <button
            onClick={handleCreateNewSession}
            title="Konsultasi Baru"
            className="p-2 rounded-xl text-emerald-600 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:hover:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-100/20 dark:border-emerald-900/30 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Conversation Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2 scroll-smooth">
        {activeSession?.messages.length === 0 ? (
          /* Empty Chat State with suggestions */
          <div className="h-full flex flex-col justify-center items-center max-w-xl mx-auto text-center space-y-6 py-8">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold font-display text-gray-900 dark:text-white">
                Bagaimana HealthMate dapat membantu Anda hari ini?
              </h3>
              <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
                Pilih rekomendasi pertanyaan di bawah ini atau tuliskan keluhan Anda secara detail seputar nutrisi, aktivitas fisik, gejala kesehatan, atau asupan air.
              </p>
            </div>

            {/* Suggestions Chips grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full pt-4">
              {PROMPT_SUGGESTIONS.map((sug) => (
                <button
                  key={sug.label}
                  onClick={() => handleSuggestionClick(sug.prompt)}
                  className="flex items-center gap-2.5 px-4 py-3 rounded-2xl border border-gray-100 dark:border-slate-800 bg-gray-50/50 hover:bg-emerald-50/55 hover:border-emerald-100 dark:bg-slate-900/40 dark:hover:bg-slate-800/40 dark:hover:border-slate-700/60 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-400 text-left transition-all duration-150 active:scale-[0.98]"
                >
                  <span className="text-base">{sug.emoji}</span>
                  <span className="truncate">{sug.label}</span>
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
      <div className="p-4 border-t border-gray-100 dark:border-slate-800/60 bg-gray-50/30 dark:bg-slate-900/40 flex flex-col gap-2">
        
        {/* Attachment preview banner */}
        {attachedFile && (
          <div className="flex items-center justify-between p-2 rounded-xl bg-gray-100 dark:bg-slate-800 text-xs font-medium text-gray-700 dark:text-gray-300 border border-gray-200/50 dark:border-slate-700 w-fit">
            <span className="flex items-center gap-1.5">
              <Paperclip className="w-3.5 h-3.5 text-emerald-500" />
              Terlampir: {attachedFile.name}
            </span>
            <button
              onClick={() => setAttachedFile(null)}
              className="ml-2 font-bold text-gray-400 hover:text-rose-500 transition-colors"
            >
              ×
            </button>
          </div>
        )}

        {/* API Error Banner */}
        {apiError && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-xs text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span className="flex-1 truncate">{apiError}</span>
            <button onClick={() => setApiError(null)} className="font-bold hover:text-rose-800 transition-colors">×</button>
          </div>
        )}

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
            className="p-3 rounded-2xl bg-white border border-gray-200/80 hover:bg-gray-50 dark:bg-slate-900 dark:border-slate-800 dark:hover:bg-slate-800 text-gray-400 dark:text-gray-505 shrink-0 transition-all duration-200 active:scale-95"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          {/* Prompt Entry Box */}
          <div className="flex-1 relative flex items-center bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all">
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
              className="w-full pl-4 pr-12 py-3 rounded-2xl text-sm bg-transparent border-0 outline-none resize-none max-h-24 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-505"
            />

            {/* Microphone Button */}
            <div className="absolute right-3 flex items-center gap-1">
              <button
                onClick={toggleSpeechRecognition}
                title={settings.language === 'en' ? "Voice transcription" : "Transkripsi suara"}
                className={`p-1.5 rounded-xl transition-all duration-200 ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse'
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
            className="p-3.5 rounded-2xl shadow-sm shadow-emerald-600/10 shrink-0 active:scale-95"
          >
            <Send className="w-4 h-4 text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
};
