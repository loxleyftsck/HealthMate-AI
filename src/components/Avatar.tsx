import React from 'react';
import { Heart, User } from 'lucide-react';

interface AvatarProps {
  src?: string;
  name?: string;
  isAI?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const PRESET_MAPPING: Record<string, { emoji: string; gradient: string }> = {
  avatar_leaf: { emoji: '🌿', gradient: 'from-emerald-400 to-teal-500' },
  avatar_heart: { emoji: '❤️', gradient: 'from-rose-400 to-pink-500' },
  avatar_doctor_m: { emoji: '🧑‍⚕️', gradient: 'from-blue-400 to-indigo-500' },
  avatar_doctor_f: { emoji: '👩‍⚕️', gradient: 'from-purple-400 to-pink-500' },
  avatar_apple: { emoji: '🍎', gradient: 'from-amber-400 to-orange-500' },
  guest: { emoji: '👤', gradient: 'from-gray-400 to-slate-500' },
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name = 'User',
  isAI = false,
  size = 'md',
  className = '',
}) => {
  const sizes = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const getInitials = (n: string) => {
    return n
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  if (isAI) {
    return (
      <div
        className={`flex items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white shrink-0 shadow-sm shadow-emerald-500/20 ${sizes[size]} ${className}`}
      >
        <Heart className="w-1/2 h-1/2 fill-white/10" />
      </div>
    );
  }

  // Handle Preset Avatars (such as "avatar_leaf", "guest", etc.)
  if (src && PRESET_MAPPING[src]) {
    const preset = PRESET_MAPPING[src];
    return (
      <div
        className={`flex items-center justify-center rounded-2xl bg-gradient-to-tr ${preset.gradient} text-white shrink-0 shadow-sm ${sizes[size]} ${className}`}
      >
        {src === 'guest' ? (
          <User className="w-1/2 h-1/2 text-white" />
        ) : (
          <span className="select-none text-[120%]">{preset.emoji}</span>
        )}
      </div>
    );
  }

  // Handle URL image source
  if (src && src.startsWith('http')) {
    return (
      <img
        src={src}
        alt={name}
        className={`rounded-2xl object-cover shrink-0 ${sizes[size]} ${className}`}
      />
    );
  }

  // Fallback to initials
  return (
    <div
      className={`flex items-center justify-center rounded-2xl bg-gradient-to-tr from-gray-200 to-gray-100 text-gray-700 font-semibold dark:from-slate-800 dark:to-slate-700 dark:text-gray-200 shrink-0 ${sizes[size]} ${className}`}
    >
      {getInitials(name)}
    </div>
  );
};

