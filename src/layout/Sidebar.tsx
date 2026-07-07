import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  Home,
  MessageSquare,
  LayoutDashboard,
  Settings,
  Plus,
  Moon,
  Sun,
  Laptop,
  History,
  LogOut,
  Trash2,
} from 'lucide-react';
import { SidebarItem } from '../components/SidebarItem';
import { useTheme } from '../hooks/useTheme';
import type { ChatSession } from '../types';
import { MOCK_CHAT_HISTORY } from '../services/mockData';
import { Logo } from '../components/Logo';
import { Avatar } from '../components/Avatar';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  onNewChat?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onNewChat, isOpen = false, onClose }) => {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<ChatSession[]>([]);

  // Load chat sessions from local storage or mock data
  useEffect(() => {
    const loadSessions = () => {
      const saved = localStorage.getItem('healthmate-chat-sessions');
      if (saved) {
        try {
          setSessions(JSON.parse(saved));
        } catch {
          localStorage.removeItem('healthmate-chat-sessions');
          setSessions(MOCK_CHAT_HISTORY);
        }
      } else {
        localStorage.setItem('healthmate-chat-sessions', JSON.stringify(MOCK_CHAT_HISTORY));
        setSessions(MOCK_CHAT_HISTORY);
      }
    };

    loadSessions();
    // Listen for storage events (when other pages update history)
    window.addEventListener('storage', loadSessions);
    // Custom event listener for internal app navigation updates
    window.addEventListener('chat-sessions-updated', loadSessions);

    return () => {
      window.removeEventListener('storage', loadSessions);
      window.removeEventListener('chat-sessions-updated', loadSessions);
    };
  }, [location]);

  const handleNewChatClick = () => {
    if (onNewChat) {
      onNewChat();
    } else {
      navigate('/chat', { state: { createNew: true } });
    }
    if (onClose) onClose();
  };

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const updatedSessions = sessions.filter((s) => s.id !== sessionId);
    setSessions(updatedSessions);
    localStorage.setItem('healthmate-chat-sessions', JSON.stringify(updatedSessions));
    
    const searchParams = new URLSearchParams(location.search);
    const activeSessionId = searchParams.get('session');
    if (activeSessionId === sessionId) {
      navigate('/chat', { replace: true });
    }
    
    window.dispatchEvent(new Event('chat-sessions-updated'));
  };


  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col w-72 bg-white dark:bg-slate-900 border-r border-gray-100 dark:border-slate-800/80 transition-transform duration-300 xl:translate-x-0 xl:relative
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      {/* Sidebar Header: Logo & Branding */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100 dark:border-slate-800/50">
        <Logo showText={true} />
      </div>

      {/* Sidebar Content (Navigation & Lists) */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        {/* New Chat Action Button */}
        <button
          onClick={handleNewChatClick}
          className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/35 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-900/30 text-sm font-semibold transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>Konsultasi Baru</span>
        </button>

        {/* Main Navigation Menu */}
        <div className="space-y-1">
          <span className="px-4 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-2">
            Navigasi
          </span>
          <SidebarItem to="/" icon={<Home className="w-4 h-4" />} label="Beranda" onClick={onClose} />
          <SidebarItem
            to="/chat"
            icon={<MessageSquare className="w-4 h-4" />}
            label="Konsultasi"
            onClick={onClose}
          />
          <SidebarItem
            to="/dashboard"
            icon={<LayoutDashboard className="w-4 h-4" />}
            label="Dasbor Kesehatan"
            onClick={onClose}
          />
          <SidebarItem
            to="/settings"
            icon={<Settings className="w-4 h-4" />}
            label="Pengaturan"
            onClick={onClose}
          />
        </div>

        {/* Chat Sessions History List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-4">
            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <History className="w-3 h-3" />
              Riwayat Konsultasi
            </span>
          </div>

          <div className="space-y-0.5 max-h-48 overflow-y-auto pr-1">
            {sessions.length === 0 ? (
              <span className="block px-4 py-3 text-xs text-gray-400 dark:text-gray-500 italic">
                Belum ada riwayat konsultasi.
              </span>
            ) : (
              sessions.map((session) => {
                const isSessionActive = location.pathname === '/chat' && location.search === `?session=${session.id}`;
                return (
                  <div key={session.id} className="group relative flex items-center justify-between rounded-xl transition-all duration-150">
                    <Link
                      to={`/chat?session=${session.id}`}
                      onClick={onClose}
                      className={`flex items-center gap-2.5 flex-1 min-w-0 px-4 py-2.5 rounded-xl text-xs font-medium truncate block
                        ${
                          isSessionActive
                            ? 'bg-gray-100 text-gray-900 dark:bg-slate-800 dark:text-white font-semibold'
                            : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50/60 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-slate-800/40'
                        }
                      `}
                    >
                      <MessageSquare className="w-3.5 h-3.5 shrink-0 opacity-60" />
                      <span className="truncate pr-4 text-left">{session.title}</span>
                    </Link>
                    <button
                      onClick={(e) => handleDeleteSession(session.id, e)}
                      className="absolute right-2 p-1.5 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      title="Hapus Konsultasi"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Sidebar Footer: Theme Toggle & User Info */}
      <div className="p-4 border-t border-gray-100 dark:border-slate-800/50 space-y-4">
        {/* Modern Theme Switcher Segment */}
        <div className="flex items-center justify-between p-1 rounded-2xl bg-gray-50 dark:bg-slate-950/50 border border-gray-100 dark:border-slate-850">
          {(['light', 'dark', 'system'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`flex-1 flex justify-center py-1.5 rounded-xl transition-all duration-200
                ${
                  theme === t
                    ? 'bg-white dark:bg-slate-850 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
                }
              `}
              title={`${t.charAt(0).toUpperCase() + t.slice(1)} Mode`}
            >
              {t === 'light' && <Sun className="w-3.5 h-3.5" />}
              {t === 'dark' && <Moon className="w-3.5 h-3.5" />}
              {t === 'system' && <Laptop className="w-3.5 h-3.5" />}
            </button>
          ))}
        </div>

        {/* User Card */}
        <div className="flex items-center justify-between p-2 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-850 transition-colors duration-200 group">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar src={user.avatar} name={user.name} size="md" />
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">
                {user.name}
              </span>
              <span className="text-[10px] text-gray-400 dark:text-gray-500 truncate">
                {user.isGuest ? 'Akses Tamu' : 'Profil Kustom'}
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="p-1.5 rounded-xl text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
            title="Keluar"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
