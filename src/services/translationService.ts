import { TranslationOptions, TranslationResult, LanguageCode } from '../types';

export class TranslationService {
  async translateText(text: string, options: TranslationOptions): Promise<TranslationResult> {
    try {
      // Use Chrome's built-in translation capabilities
      // Note: Chrome doesn't expose a direct translation API, so we simulate it
      // In a real implementation, you might need to use Google Translate API
      // or integrate with Chrome's internal translation service
      
      const result = await this.simulateTranslation(text, options);
      return result;
    } catch (error) {
      console.error('Translation error:', error);
      throw new Error('Translation failed: ' + (error as Error).message);
    }
  }

  async detectLanguage(text: string): Promise<{ language: string; confidence: number }> {
    // Simplified language detection
    // In a real implementation, you would use Chrome's language detection API
    // or a third-party service
    
    const commonPatterns = {
      'es': /¿|ñ|¡|í|é|á|ó|ú/,
      'fr': /ç|é|è|ê|à|ù|û/,
      'de': /ä|ö|ü|ß/,
      'ru': /[а-я]/,
      'zh': /[\u4e00-\u9fff]/,
      'ja': /[\u3040-\u309f]|[\u30a0-\u30ff]/,
      'ar': /[\u0600-\u06ff]/,
      'hi': /[\u0900-\u097f]/
    };

    for (const [lang, pattern] of Object.entries(commonPatterns)) {
      if (pattern.test(text.toLowerCase())) {
        return { language: lang, confidence: 0.8 };
      }
    }

    // Default to English if no patterns match
    return { language: 'en', confidence: 0.6 };
  }

  private async simulateTranslation(text: string, options: TranslationOptions): Promise<TranslationResult> {
    // This is a simulation. In a real extension, you would:
    // 1. Use Google Translate API
    // 2. Integrate with Chrome's internal translation service
    // 3. Use another translation service like DeepL, Azure Translator, etc.
    
    // Simulate translation delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Detect source language if not provided
    let sourceLanguage = options.sourceLanguage;
    if (!sourceLanguage || options.autoDetect) {
      const detection = await this.detectLanguage(text);
      sourceLanguage = detection.language;
    }

    // Return simulated translation
    const translatedText = this.getSimulatedTranslation(text, sourceLanguage, options.targetLanguage);
    
    return {
      translatedText,
      sourceLanguage,
      confidence: 0.95
    };
  }

  private getSimulatedTranslation(text: string, sourceLang: string, targetLang: string): string {
    // Very basic simulation - just add a prefix to indicate translation
    if (sourceLang === targetLang) {
      return text;
    }

    const languageNames: Record<string, string> = {
      'en': 'English',
      'es': 'Spanish', 
      'fr': 'French',
      'de': 'German',
      'it': 'Italian',
      'pt': 'Portuguese',
      'ru': 'Russian',
      'ja': 'Japanese',
      'ko': 'Korean',
      'zh': 'Chinese',
      'ar': 'Arabic',
      'hi': 'Hindi'
    };

    const targetLanguageName = languageNames[targetLang] || targetLang;
    
    // Simple transformations for demo purposes
    if (targetLang === 'es') {
      return `${text} (traducido al español)`;
    } else if (targetLang === 'fr') {
      return `${text} (traduit en français)`;
    } else if (targetLang === 'de') {
      return `${text} (ins Deutsche übersetzt)`;
    } else {
      return `[${targetLanguageName}] ${text}`;
    }
  }

  async getAvailableLanguages(): Promise<Record<LanguageCode, string>> {
    // Return supported languages
    return {
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
    };
  }
}

export const translationService = new TranslationService();