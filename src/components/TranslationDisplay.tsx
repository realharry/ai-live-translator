import React from 'react';
import { TranslationResult } from '../types';

interface TranslationDisplayProps {
  originalText: string;
  translation: TranslationResult | null;
  loading: boolean;
  error: string | null;
}

export const TranslationDisplay: React.FC<TranslationDisplayProps> = ({
  originalText,
  translation,
  loading,
  error
}) => {
  if (!originalText) {
    return (
      <div className="translation-display empty">
        <p className="placeholder">Select text on the page to translate it</p>
      </div>
    );
  }

  return (
    <div className="translation-display">
      <div className="original-text">
        <h3>Original Text:</h3>
        <p className="text-content">{originalText}</p>
      </div>
      
      <div className="translation-result">
        <h3>Translation:</h3>
        {loading && <p className="loading">Translating...</p>}
        {error && <p className="error">Error: {error}</p>}
        {translation && !loading && !error && (
          <div>
            <p className="text-content">{translation.translatedText}</p>
            <div className="translation-meta">
              <span className="source-lang">From: {translation.sourceLanguage}</span>
              {translation.confidence && (
                <span className="confidence">
                  Confidence: {Math.round(translation.confidence * 100)}%
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};