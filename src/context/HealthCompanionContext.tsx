import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import type { ReactNode } from 'react';

export type MascotExpression = 'idle' | 'thinking' | 'greeting' | 'success' | 'error';

interface HealthCompanionContextType {
  expression: MascotExpression;
  message: string | null;
  speak: (text: string, expr?: MascotExpression, duration?: number) => void;
  setExpression: (expr: MascotExpression) => void;
  clear: () => void;
}

const HealthCompanionContext = createContext<HealthCompanionContextType | undefined>(undefined);

export const HealthCompanionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [expression, setExpressionState] = useState<MascotExpression>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  const clear = useCallback(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setMessage(null);
    setExpressionState('idle');
  }, []);

  const setExpression = useCallback((expr: MascotExpression) => {
    setExpressionState(expr);
  }, []);

  const speak = useCallback((text: string, expr: MascotExpression = 'idle', duration: number = 6000) => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    setMessage(text);
    setExpressionState(expr);

    if (duration > 0) {
      timerRef.current = window.setTimeout(() => {
        setMessage(null);
        setExpressionState('idle');
        timerRef.current = null;
      }, duration);
    }
  }, []);

  return (
    <HealthCompanionContext.Provider value={{ expression, message, speak, setExpression, clear }}>
      {children}
    </HealthCompanionContext.Provider>
  );
};

export const useHealthCompanion = () => {
  const context = useContext(HealthCompanionContext);
  if (context === undefined) {
    throw new Error('useHealthCompanion must be used within a HealthCompanionProvider');
  }
  return context;
};
