import React, { useState, useEffect } from 'react';
import { LanguageSelect } from '../components/LanguageSelect';
import { LanguageCode } from '../types';

export const Popup: React.FC = () => {
  const [targetLanguage, setTargetLanguage] = useState<LanguageCode>('en');
  const [selectedText, setSelectedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load saved settings
    chrome.storage.sync.get(['targetLanguage'], (result) => {
      if (result.targetLanguage) {
        setTargetLanguage(result.targetLanguage);
      }
    });

    // Get selected text from current page
    getCurrentTabSelectedText();
  }, []);

  const getCurrentTabSelectedText = async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab.id) {
        const response = await chrome.tabs.sendMessage(tab.id, { action: 'getSelectedText' });
        if (response?.text) {
          setSelectedText(response.text);
        }
      }
    } catch (error) {
      console.error('Error getting selected text:', error);
    }
  };

  const handleLanguageChange = (language: LanguageCode) => {
    setTargetLanguage(language);
    chrome.storage.sync.set({ targetLanguage: language });
  };

  const translateSelection = async () => {
    if (!selectedText) {
      alert('No text selected. Please select some text on the page first.');
      return;
    }

    setIsLoading(true);
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab.id) {
        await chrome.tabs.sendMessage(tab.id, {
          action: 'translateSelectedText',
          targetLanguage
        });
      }
    } catch (error) {
      console.error('Translation error:', error);
      alert('Translation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const translatePage = async () => {
    setIsLoading(true);
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
      alert('Page translation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const openSidePanel = async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab.id) {
        await chrome.sidePanel.open({ tabId: tab.id });
      }
    } catch (error) {
      console.error('Error opening side panel:', error);
    }
  };

  const openOptions = () => {
    chrome.runtime.openOptionsPage();
  };

  return (
    <div className="popup">
      <div className="popup-header">
        <h2>AI Live Translator</h2>
      </div>
      
      <div className="popup-content">
        <div className="language-section">
          <LanguageSelect
            value={targetLanguage}
            onChange={handleLanguageChange}
            label="Translate to"
          />
        </div>

        {selectedText && (
          <div className="selected-text">
            <p><strong>Selected:</strong> {selectedText.substring(0, 100)}{selectedText.length > 100 ? '...' : ''}</p>
          </div>
        )}

        <div className="actions">
          <button
            onClick={translateSelection}
            disabled={isLoading || !selectedText}
            className="primary-button"
          >
            {isLoading ? 'Translating...' : 'Translate Selection'}
          </button>
          
          <button
            onClick={translatePage}
            disabled={isLoading}
            className="secondary-button"
          >
            {isLoading ? 'Translating...' : 'Translate Page'}
          </button>
          
          <button
            onClick={openSidePanel}
            className="secondary-button"
          >
            Open Side Panel
          </button>
          
          <button
            onClick={openOptions}
            className="tertiary-button"
          >
            Options
          </button>
        </div>
      </div>
    </div>
  );
};