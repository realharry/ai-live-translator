import React from 'react';
import { SUPPORTED_LANGUAGES, LanguageCode } from '../types';

interface LanguageSelectProps {
  value: LanguageCode;
  onChange: (language: LanguageCode) => void;
  label?: string;
  disabled?: boolean;
}

export const LanguageSelect: React.FC<LanguageSelectProps> = ({
  value,
  onChange,
  label = 'Language',
  disabled = false
}) => {
  return (
    <div className="language-select">
      <label htmlFor="language-select">{label}:</label>
      <select
        id="language-select"
        value={value}
        onChange={(e) => onChange(e.target.value as LanguageCode)}
        disabled={disabled}
        className="language-select-dropdown"
      >
        {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
};