import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserProfile } from '../types';
import { INITIAL_USER_PROFILE } from '../services/mockData';

interface AuthContextType {
  user: UserProfile;
  isLoggedIn: boolean;
  login: (name: string, avatar: string, weight?: number, height?: number) => void;
  loginAsGuest: () => void;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    const savedProfile = localStorage.getItem('healthmate-profile');
    if (savedProfile) {
      try {
        return JSON.parse(savedProfile);
      } catch (e) {
        return INITIAL_USER_PROFILE;
      }
    }
    return INITIAL_USER_PROFILE;
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('healthmate-logged-in') === 'true';
  });

  const login = (name: string, avatar: string, weight = 70, height = 170) => {
    const newUser: UserProfile = {
      name,
      avatar,
      weight,
      height,
      waterGoal: 2000,
      calorieGoal: 2000,
      sleepGoal: 8,
      isGuest: false,
    };
    setUser(newUser);
    setIsLoggedIn(true);
    localStorage.setItem('healthmate-profile', JSON.stringify(newUser));
    localStorage.setItem('healthmate-logged-in', 'true');
    // Dispatch storage event to notify other contexts/hooks
    window.dispatchEvent(new Event('storage'));
  };

  const loginAsGuest = () => {
    const guestUser: UserProfile = {
      ...INITIAL_USER_PROFILE,
      name: 'Tamu',
      avatar: 'guest',
      isGuest: true,
    };
    setUser(guestUser);
    setIsLoggedIn(true);
    localStorage.setItem('healthmate-profile', JSON.stringify(guestUser));
    localStorage.setItem('healthmate-logged-in', 'true');
    window.dispatchEvent(new Event('storage'));
  };

  const logout = () => {
    setUser(INITIAL_USER_PROFILE);
    setIsLoggedIn(false);
    localStorage.removeItem('healthmate-profile');
    localStorage.removeItem('healthmate-logged-in');
    window.dispatchEvent(new Event('storage'));
  };

  const updateProfile = (updatedFields: Partial<UserProfile>) => {
    const updatedUser = { ...user, ...updatedFields };
    setUser(updatedUser);
    localStorage.setItem('healthmate-profile', JSON.stringify(updatedUser));
    // Dispatch a custom event so other components know the profile changed
    window.dispatchEvent(new Event('profile-updated'));
    window.dispatchEvent(new Event('storage'));
  };

  // Sync state if localStorage changes from other tabs
  useEffect(() => {
    const handleStorageChange = () => {
      const savedProfile = localStorage.getItem('healthmate-profile');
      if (savedProfile) {
        try {
          setUser(JSON.parse(savedProfile));
        } catch (e) {
          console.warn('[Auth] Failed to parse profile from storage:', e);
        }
      }
      setIsLoggedIn(localStorage.getItem('healthmate-logged-in') === 'true');
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('profile-updated', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profile-updated', handleStorageChange);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, loginAsGuest, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
