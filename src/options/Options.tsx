import React, { useState, useEffect } from 'react';
import { LanguageSelect } from '../components/LanguageSelect';
import { LanguageCode, LLMConfig } from '../types';

export const Options: React.FC = () => {
  const [targetLanguage, setTargetLanguage] = useState<LanguageCode>('en');
  const [autoTranslate, setAutoTranslate] = useState(false);
  const [llmProvider, setLLMProvider] = useState<'openai' | 'gemini' | 'claude'>('openai');
  const [llmApiKey, setLLMApiKey] = useState('');
  const [llmModel, setLLMModel] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  useEffect(() => {
    // Load saved settings
    chrome.storage.sync.get([
      'targetLanguage',
      'autoTranslate',
      'llmProvider',
      'llmApiKey',
      'llmModel'
    ], (result) => {
      if (result.targetLanguage) setTargetLanguage(result.targetLanguage);
      if (result.autoTranslate !== undefined) setAutoTranslate(result.autoTranslate);
      if (result.llmProvider) setLLMProvider(result.llmProvider);
      if (result.llmApiKey) setLLMApiKey(result.llmApiKey);
      if (result.llmModel) setLLMModel(result.llmModel);
    });
  }, []);

  useEffect(() => {
    // Set default model based on provider
    if (!llmModel) {
      const defaultModels = {
        'openai': 'gpt-3.5-turbo',
        'gemini': 'gemini-pro',
        'claude': 'claude-3-haiku-20240307'
      };
      setLLMModel(defaultModels[llmProvider]);
    }
  }, [llmProvider, llmModel]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');

    try {
      await chrome.storage.sync.set({
        targetLanguage,
        autoTranslate,
        llmProvider,
        llmApiKey,
        llmModel
      });

      setSaveMessage('Settings saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveMessage('Error saving settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConnection = async () => {
    if (!llmApiKey.trim()) {
      setTestResult('Please enter an API key first.');
      return;
    }

    setIsTestingConnection(true);
    setTestResult(null);

    try {
      // Save current settings temporarily for testing
      const tempConfig: LLMConfig = {
        provider: llmProvider,
        apiKey: llmApiKey,
        model: llmModel
      };

      // Test the connection by sending a simple request
      const response = await chrome.runtime.sendMessage({
        action: 'testLLMConnection',
        config: tempConfig
      });

      if (response.success) {
        setTestResult('✅ Connection successful!');
      } else {
        setTestResult(`❌ Connection failed: ${response.error}`);
      }
    } catch (error) {
      console.error('Test connection error:', error);
      setTestResult('❌ Connection test failed. Please check your settings.');
    } finally {
      setIsTestingConnection(false);
      setTimeout(() => setTestResult(null), 5000);
    }
  };

  const getProviderModels = (provider: string) => {
    const models = {
      'openai': [
        'gpt-3.5-turbo',
        'gpt-3.5-turbo-16k',
        'gpt-4',
        'gpt-4-turbo-preview',
        'gpt-4-32k'
      ],
      'gemini': [
        'gemini-pro',
        'gemini-pro-vision'
      ],
      'claude': [
        'claude-3-haiku-20240307',
        'claude-3-sonnet-20240229',
        'claude-3-opus-20240229'
      ]
    };
    return models[provider as keyof typeof models] || [];
  };

  const getApiKeyPlaceholder = (provider: string) => {
    const placeholders = {
      'openai': 'sk-...',
      'gemini': 'AIza...',
      'claude': 'sk-ant-api03-...'
    };
    return placeholders[provider as keyof typeof placeholders] || 'Enter API key';
  };

  const getProviderDocs = (provider: string) => {
    const docs = {
      'openai': 'https://platform.openai.com/api-keys',
      'gemini': 'https://ai.google.dev/tutorials/setup',
      'claude': 'https://console.anthropic.com/account/keys'
    };
    return docs[provider as keyof typeof docs];
  };

  return (
    <div className="options">
      <div className="options-header">
        <h1>AI Live Translator - Options</h1>
        <p>Configure your translation and AI summarization settings</p>
      </div>

      <div className="options-content">
        <section className="section">
          <h2>Translation Settings</h2>
          
          <div className="setting-group">
            <LanguageSelect
              value={targetLanguage}
              onChange={setTargetLanguage}
              label="Default target language"
            />
          </div>

          <div className="setting-group">
            <label>
              <input
                type="checkbox"
                checked={autoTranslate}
                onChange={(e) => setAutoTranslate(e.target.checked)}
              />
              Automatically translate selected text
            </label>
            <p className="setting-description">
              When enabled, text will be translated automatically when selected on any webpage.
            </p>
          </div>
        </section>

        <section className="section">
          <h2>AI Summarization Settings</h2>
          <p className="section-description">
            Configure your LLM provider for webpage summarization features.
          </p>

          <div className="setting-group">
            <label htmlFor="llm-provider">LLM Provider:</label>
            <select
              id="llm-provider"
              value={llmProvider}
              onChange={(e) => setLLMProvider(e.target.value as 'openai' | 'gemini' | 'claude')}
              className="provider-select"
            >
              <option value="openai">OpenAI GPT</option>
              <option value="gemini">Google Gemini</option>
              <option value="claude">Anthropic Claude</option>
            </select>
          </div>

          <div className="setting-group">
            <label htmlFor="llm-model">Model:</label>
            <select
              id="llm-model"
              value={llmModel}
              onChange={(e) => setLLMModel(e.target.value)}
              className="model-select"
            >
              {getProviderModels(llmProvider).map(model => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
          </div>

          <div className="setting-group">
            <label htmlFor="llm-api-key">API Key:</label>
            <div className="api-key-input">
              <input
                id="llm-api-key"
                type="password"
                value={llmApiKey}
                onChange={(e) => setLLMApiKey(e.target.value)}
                placeholder={getApiKeyPlaceholder(llmProvider)}
                className="api-key-field"
              />
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTestingConnection || !llmApiKey.trim()}
                className="test-button"
              >
                {isTestingConnection ? 'Testing...' : 'Test'}
              </button>
            </div>
            <p className="setting-description">
              Get your API key from{' '}
              <a href={getProviderDocs(llmProvider)} target="_blank" rel="noopener noreferrer">
                {llmProvider} documentation
              </a>
            </p>
            {testResult && (
              <p className={`test-result ${testResult.includes('✅') ? 'success' : 'error'}`}>
                {testResult}
              </p>
            )}
          </div>
        </section>

        <div className="save-section">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="save-button"
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
          
          {saveMessage && (
            <p className={`save-message ${saveMessage.includes('successfully') ? 'success' : 'error'}`}>
              {saveMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};