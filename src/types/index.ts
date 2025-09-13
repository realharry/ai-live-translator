export interface TranslationOptions {
  targetLanguage: string;
  sourceLanguage?: string;
  autoDetect: boolean;
}

export interface LLMConfig {
  provider: 'openai' | 'gemini' | 'claude';
  apiKey: string;
  model: string;
}

export interface TranslationResult {
  translatedText: string;
  sourceLanguage: string;
  confidence?: number;
}

export interface SummaryResult {
  summary: string;
  wordCount: number;
}

export interface SelectedText {
  text: string;
  selection?: Selection;
  element?: Element;
}

export interface ChromeTranslateAPI {
  translate: (text: string, options: TranslationOptions) => Promise<TranslationResult>;
  detectLanguage: (text: string) => Promise<{ language: string; confidence: number }>;
}

export const SUPPORTED_LANGUAGES = {
  'en': 'English',
  'es': 'Spanish',
  'fr': 'French',
  'de': 'German',
  'it': 'Italian',
  'pt': 'Portuguese',
  'ru': 'Russian',
  'ja': 'Japanese',
  'ko': 'Korean',
  'zh': 'Chinese (Simplified)',
  'zh-TW': 'Chinese (Traditional)',
  'ar': 'Arabic',
  'hi': 'Hindi',
  'nl': 'Dutch',
  'sv': 'Swedish',
  'da': 'Danish',
  'no': 'Norwegian',
  'fi': 'Finnish',
  'pl': 'Polish',
  'tr': 'Turkish'
} as const;

export type LanguageCode = keyof typeof SUPPORTED_LANGUAGES;