export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
  isMarkdown?: boolean;
  pluginUsed?: string;
  isEmergency?: boolean;
}

export interface AttachedFile {
  name: string;
  type: string;
  base64?: string;
  mimeType?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  name: string;
  avatar: string;
  weight: number; // in kg
  height: number; // in cm
  waterGoal: number; // in ml
  calorieGoal: number; // in kcal
  sleepGoal: number; // in hours
  isGuest?: boolean;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'id';
  apiKey: string;
  model: string;
  systemInstruction: string;
  temperature: number;
  plugins: Record<string, boolean>; // e.g. { BMI: true, Water: false }
  syncMode?: 'local' | 'cloud';
  cloudEndpoint?: string;
  secretSyncKey?: string;
}

export interface WaterLog {
  id: string;
  amount: number; // in ml
  timestamp: string;
}

export interface CalorieLog {
  id: string;
  amount: number; // in kcal
  timestamp: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foodName: string;
}

export interface ExerciseLog {
  id: string;
  duration: number; // in minutes
  steps: number;
  activityType: string;
  timestamp: string;
}

export interface SleepLog {
  id: string;
  duration: number; // in hours
  quality: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  timestamp: string;
}

export interface BMIRecord {
  id: string;
  weight: number;
  height: number;
  bmi: number;
  category: string;
  timestamp: string;
}

export interface HealthMetricSummary {
  bmi: BMIRecord | null;
  waterIntake: {
    current: number;
    goal: number;
    logs: WaterLog[];
  };
  calories: {
    current: number;
    goal: number;
    logs: CalorieLog[];
  };
  exercise: {
    duration: number;
    steps: number;
    logs: ExerciseLog[];
  };
  sleep: {
    duration: number;
    quality: string;
    logs: SleepLog[];
  };
  heartHealth: {
    bpm: number;
    bloodPressure: string;
    history: { bpm: number; bp: string; timestamp: string }[];
  };
}

export interface PluginMetadata {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  icon: string; // lucide icon name or emoji
  enabledByDefault: boolean;
}
