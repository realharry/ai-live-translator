import { LLMConfig, SummaryResult } from '../types';

export class LLMService {
  private config: LLMConfig | null = null;

  async initialize(): Promise<void> {
    const settings = await chrome.storage.sync.get(['llmProvider', 'llmApiKey', 'llmModel']);
    
    if (settings.llmProvider && settings.llmApiKey && settings.llmModel) {
      this.config = {
        provider: settings.llmProvider,
        apiKey: settings.llmApiKey,
        model: settings.llmModel
      };
    }
  }

  async summarizeContent(content: string, targetLanguage: string, maxWords: number = 200): Promise<SummaryResult> {
    if (!this.config) {
      throw new Error('LLM not configured. Please set up API key in options.');
    }

    try {
      const summary = await this.generateSummary(content, targetLanguage, maxWords);
      const wordCount = summary.split(/\s+/).length;
      
      return {
        summary,
        wordCount
      };
    } catch (error) {
      console.error('LLM summarization error:', error);
      throw new Error('Failed to generate summary: ' + (error as Error).message);
    }
  }

  private async generateSummary(content: string, targetLanguage: string, maxWords: number): Promise<string> {
    const prompt = this.buildSummaryPrompt(content, targetLanguage, maxWords);
    
    switch (this.config!.provider) {
      case 'openai':
        return this.callOpenAI(prompt);
      case 'gemini':
        return this.callGemini(prompt);
      case 'claude':
        return this.callClaude(prompt);
      default:
        throw new Error(`Unsupported LLM provider: ${this.config!.provider}`);
    }
  }

  private buildSummaryPrompt(content: string, targetLanguage: string, maxWords: number): string {
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

    const languageName = languageNames[targetLanguage] || targetLanguage;
    
    return `Please summarize the following content in ${languageName}. Keep the summary under ${maxWords} words and focus on the main points:

Content to summarize:
${content.substring(0, 8000)}${content.length > 8000 ? '...' : ''}`;
  }

  private async callOpenAI(prompt: string): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config!.apiKey}`
      },
      body: JSON.stringify({
        model: this.config!.model,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that creates concise summaries.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'No summary generated';
  }

  private async callGemini(prompt: string): Promise<string> {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${this.config!.model}:generateContent?key=${this.config!.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          maxOutputTokens: 300,
          temperature: 0.3
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0]?.content?.parts[0]?.text || 'No summary generated';
  }

  private async callClaude(prompt: string): Promise<string> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.config!.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: this.config!.model,
        max_tokens: 300,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();
    return data.content[0]?.text || 'No summary generated';
  }

  async testConnection(): Promise<boolean> {
    if (!this.config) {
      return false;
    }

    try {
      const testSummary = await this.generateSummary(
        'This is a test content to verify the API connection.',
        'en',
        20
      );
      return testSummary.length > 0;
    } catch (error) {
      console.error('LLM connection test failed:', error);
      return false;
    }
  }
}

export const llmService = new LLMService();