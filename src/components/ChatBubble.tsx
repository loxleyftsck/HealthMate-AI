import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Trash2, Check, Sparkles } from 'lucide-react';
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
  const isAI = message.sender === 'ai';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`group flex w-full gap-4 py-4 px-2 hover:bg-gray-50/40 dark:hover:bg-slate-900/10 rounded-2xl transition-colors duration-200 ${
        isAI ? 'justify-start' : 'justify-end flex-row-reverse'
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
      <div className={`flex max-w-[75%] flex-col gap-1.5 ${isAI ? 'items-start' : 'items-end'}`}>
        {/* Sender Name & Meta */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
            {isAI ? 'HealthMate AI' : userName}
          </span>
          <span className="text-[10px] text-gray-400 dark:text-gray-500">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {isAI && message.pluginUsed && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100/50 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30">
              <Sparkles className="w-2.5 h-2.5" />
              {message.pluginUsed}
            </span>
          )}
        </div>

        {/* Message Bubble Body */}
        <div
          className={`relative rounded-2xl px-4 py-3 text-sm shadow-sm border
            ${
              isAI
                ? 'bg-white border-gray-100 text-gray-800 dark:bg-slate-900 dark:border-slate-800 dark:text-gray-100'
                : 'bg-emerald-600 border-emerald-600 text-white dark:bg-emerald-600 dark:border-emerald-600'
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
          className={`flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-1
            ${isAI ? 'self-start' : 'self-end'}
          `}
        >
          <button
            onClick={handleCopy}
            title="Copy message"
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-500 dark:hover:text-gray-300 dark:hover:bg-slate-800 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          
          {onDelete && (
            <button
              onClick={() => onDelete(message.id)}
              title="Delete message"
              className="p-1.5 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:text-gray-500 dark:hover:text-rose-400 dark:hover:bg-rose-950/20 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
