import React, { useState, useEffect } from 'react';
import { LanguageSelect } from '../components/LanguageSelect';
import { TranslationDisplay } from '../components/TranslationDisplay';
import { LanguageCode, TranslationResult, SummaryResult } from '../types';

export const SidePanel: React.FC = () => {
  const [targetLanguage, setTargetLanguage] = useState<LanguageCode>('en');
  const [selectedText, setSelectedText] = useState<string>('');
  const [translation, setTranslation] = useState<TranslationResult | null>(null);
  const [summary, setSummary] = useState<SummaryResult | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoTranslate, setAutoTranslate] = useState(false);
  const [pageInfo, setPageInfo] = useState<{title: string, url: string} | null>(null);

  useEffect(() => {
    // Load saved settings
    chrome.storage.sync.get(['targetLanguage', 'autoTranslate'], (result) => {
      if (result.targetLanguage) {
        setTargetLanguage(result.targetLanguage);
      }
      if (result.autoTranslate !== undefined) {
        setAutoTranslate(result.autoTranslate);
      }
    });

    // Get current page info
    getCurrentPageInfo();

    // Listen for text selection messages
    chrome.runtime.onMessage.addListener((message) => {
      if (message.action === 'textSelected') {
        setSelectedText(message.text);
        setError(null);
        
        if (autoTranslate && message.text.trim().length > 0) {
          translateText(message.text);
        }
      }
    });
  }, [autoTranslate]);

  const getCurrentPageInfo = async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab) {
        setPageInfo({ title: tab.title || '', url: tab.url || '' });
      }
    } catch (error) {
      console.error('Error getting page info:', error);
    }
  };

  const handleLanguageChange = (language: LanguageCode) => {
    setTargetLanguage(language);
    chrome.storage.sync.set({ targetLanguage: language });
    
    // Auto-translate if text is selected and auto-translate is enabled
    if (selectedText && autoTranslate) {
      translateText(selectedText);
    }
  };

  const handleAutoTranslateChange = (enabled: boolean) => {
    setAutoTranslate(enabled);
    chrome.storage.sync.set({ autoTranslate: enabled });
  };

  const translateText = async (text?: string) => {
    const textToTranslate = text || selectedText;
    if (!textToTranslate.trim()) {
      setError('No text to translate');
      return;
    }

    setIsTranslating(true);
    setError(null);
    
    try {
      const response = await chrome.runtime.sendMessage({
        action: 'translateText',
        text: textToTranslate,
        options: { targetLanguage, autoDetect: true }
      });

      if (response.error) {
        setError(response.error);
        setTranslation(null);
      } else {
        setTranslation(response);
      }
    } catch (error) {
      console.error('Translation error:', error);
      setError('Translation failed. Please try again.');
      setTranslation(null);
    } finally {
      setIsTranslating(false);
    }
  };

  const summarizePage = async () => {
    if (!pageInfo) {
      setError('No page loaded');
      return;
    }

    setIsSummarizing(true);
    setError(null);
    
    try {
      const contentResponse = await chrome.runtime.sendMessage({
        action: 'getPageContent'
      });

      if (contentResponse.error) {
        setError(contentResponse.error);
        return;
      }

      const summaryResponse = await chrome.runtime.sendMessage({
        action: 'summarizePage',
        content: contentResponse.content,
        targetLanguage
      });

      if (summaryResponse.error) {
        setError(summaryResponse.error);
        setSummary(null);
      } else {
        setSummary(summaryResponse);
      }
    } catch (error) {
      console.error('Summarization error:', error);
      setError('Summarization failed. Please check your LLM configuration in options.');
      setSummary(null);
    } finally {
      setIsSummarizing(false);
    }
  };

  const translatePageContent = async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab.id) {
        await chrome.tabs.sendMessage(tab.id, {
          action: 'translatePage',
          targetLanguage
        });
      }
    } catch (error) {
      console.error('Page translation error:', error);
      setError('Page translation failed. Please try again.');
    }
  };

  const clearResults = () => {
    setTranslation(null);
    setSummary(null);
    setSelectedText('');
    setError(null);
  };

  return (
    <div className="sidepanel">
      <div className="sidepanel-header">
        <h1>AI Live Translator</h1>
        {pageInfo && (
          <div className="page-info">
            <p className="page-title">{pageInfo.title}</p>
            <p className="page-url">{pageInfo.url}</p>
          </div>
        )}
      </div>

      <div className="sidepanel-content">
        <div className="settings-section">
          <LanguageSelect
            value={targetLanguage}
            onChange={handleLanguageChange}
            label="Translate to"
          />
          
          <div className="auto-translate">
            <label>
              <input
                type="checkbox"
                checked={autoTranslate}
                onChange={(e) => handleAutoTranslateChange(e.target.checked)}
              />
              Auto-translate selected text
            </label>
          </div>
        </div>

        <div className="actions-section">
          <button
            onClick={() => translateText()}
            disabled={isTranslating || !selectedText}
            className="action-button primary"
          >
            {isTranslating ? 'Translating...' : 'Translate Selection'}
          </button>
          
          <button
            onClick={translatePageContent}
            className="action-button secondary"
          >
            Translate Page
          </button>
          
          <button
            onClick={summarizePage}
            disabled={isSummarizing}
            className="action-button secondary"
          >
            {isSummarizing ? 'Summarizing...' : 'Summarize Page'}
          </button>
          
          <button
            onClick={clearResults}
            className="action-button tertiary"
          >
            Clear
          </button>
        </div>

        {error && (
          <div className="error-section">
            <p className="error-message">{error}</p>
          </div>
        )}

        <TranslationDisplay
          originalText={selectedText}
          translation={translation}
          loading={isTranslating}
          error={error}
        />

        {summary && (
          <div className="summary-section">
            <h3>Page Summary</h3>
            <p className="summary-content">{summary.summary}</p>
            <p className="summary-meta">Word count: {summary.wordCount}</p>
          </div>
        )}
      </div>
    </div>
  );
};