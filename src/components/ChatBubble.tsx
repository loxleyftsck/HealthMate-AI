import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Trash2, Check, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { Avatar } from './Avatar';
import type { Message } from '../types';
import { renderMarkdown } from '../utils/markdown';

interface ChatBubbleProps {
  message: Message;
  userName?: string;
  userAvatar?: string;
  onDelete?: (id: string) => void;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  userName = 'User',
  userAvatar,
  onDelete,
}) => {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const isAI = message.sender === 'ai';

  const handleSpeak = () => {
    if (!window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Strip markdown characters for clean speech
    const cleanText = message.text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/#{1,6}\s/g, '')
      .replace(/`{1,3}[^`]*`{1,3}/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[-•]\s/g, '. ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    // Detect language from text heuristic
    utterance.lang = /[a-zA-Z]{4,}/.test(cleanText) && !/\b(dan|yang|dengan|untuk|atau|pada|ini|itu|bisa|saya|anda|kesehatan)\b/i.test(cleanText)
      ? 'en-US'
      : 'id-ID';
    utterance.rate = 0.92;
    utterance.pitch = 1.05;
    utterance.volume = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.cancel(); // cancel any previous
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && document.hasFocus()) {
        await navigator.clipboard.writeText(message.text);
      } else {
        // Fallback untuk browser yang memblokir clipboard API
        const el = document.createElement('textarea');
        el.value = message.text;
        el.style.position = 'fixed';
        el.style.opacity = '0';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Copy not available:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`group flex w-full gap-3 py-3 px-2 hover:bg-gray-50/20 dark:hover:bg-slate-900/5 rounded-2xl transition-colors duration-200 ${
        isAI ? 'justify-start' : 'flex-row-reverse justify-start'
      }`}
    >
      {/* Avatar */}
      <Avatar
        isAI={isAI}
        name={isAI ? 'HealthMate AI' : userName}
        src={isAI ? undefined : userAvatar}
        size="md"
      />

      {/* Bubble Container */}
      <div className={`flex max-w-[78%] flex-col gap-1.5 ${isAI ? 'items-start' : 'items-end'}`}>
        {/* Sender Name & Meta */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 tracking-wide">
            {isAI ? 'HealthMate AI' : userName}
          </span>
          <span className="text-[9px] text-gray-400 dark:text-gray-500 font-medium">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {isAI && message.pluginUsed && (
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Sparkles className="w-2.5 h-2.5" />
              {message.pluginUsed}
            </span>
          )}
        </div>

        {/* Message Bubble Body */}
        <div
          className={`relative px-4 py-3 text-sm shadow-sm transition-all duration-300
            ${
              message.isEmergency
                ? 'bg-rose-50 border border-rose-100 text-rose-800 dark:bg-rose-950/10 dark:border-rose-900/30 dark:text-rose-200 rounded-2xl shadow-rose-100/10'
                : isAI
                ? 'bg-white border border-gray-100/80 text-gray-800 dark:bg-slate-900/60 dark:border-slate-800/80 dark:text-gray-100 rounded-2xl rounded-tl-none shadow-gray-100/5'
                : 'bg-gradient-to-br from-emerald-600 to-teal-600 text-white dark:from-emerald-600 dark:to-teal-600 rounded-2xl rounded-tr-none shadow-emerald-600/5'
            }
          `}
        >
          {isAI ? (
            <div className="prose prose-sm prose-slate dark:prose-invert max-w-none">
              {renderMarkdown(message.text)}
            </div>
          ) : (
            <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
          )}
        </div>

        {/* Hover Action Bar */}
        <div
          className={`flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-0.5
            ${isAI ? 'self-start' : 'self-end'}
          `}
        >
          {/* TTS Button — AI messages only */}
          {isAI && (
            <button
              onClick={handleSpeak}
              title={isSpeaking ? 'Hentikan' : 'Dengarkan'}
              className={`p-1.5 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 ${
                isSpeaking
                  ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400 animate-pulse'
                  : 'text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:text-gray-500 dark:hover:text-emerald-400 dark:hover:bg-emerald-950/20'
              }`}
            >
              {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          )}

          <button
            onClick={handleCopy}
            title="Salin Pesan"
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-500 dark:hover:text-gray-300 dark:hover:bg-slate-800/70 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          
          {onDelete && (
            <button
              onClick={() => onDelete(message.id)}
              title="Hapus Pesan"
              className="p-1.5 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:text-gray-500 dark:hover:text-rose-450 dark:hover:bg-rose-950/20 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
