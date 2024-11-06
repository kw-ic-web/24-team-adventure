import React from 'react';

type Language = 'ko' | 'en';

interface LanguageToggleProps {
  language: Language;
  onToggle: () => void;
}

function LanguageToggle({ language, onToggle }: LanguageToggleProps) {
  return (
    <div
      className={`relative w-16 h-9 rounded-full cursor-pointer transition-colors duration-300 ${
        language === 'en' ? 'bg-blue-500' : 'bg-gray-300'
      }`}
      onClick={onToggle}
    >
      <span
        className={`absolute inset-y-1 left-1 w-7 h-7 rounded-full bg-white flex items-center justify-center text-sm font-bold transition-transform duration-300 ${
          language === 'en' ? 'translate-x-7' : 'translate-x-0'
        }`}
      >
        {language === 'en' ? 'EN' : 'KO'}
      </span>
    </div>
  );
}

export default LanguageToggle;
