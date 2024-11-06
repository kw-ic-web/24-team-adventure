import React, { useState } from 'react';
import './GameSelect.css';

type Language = 'ko' | 'en';

const items = [
  {
    id: 1,
    name: { ko: '엘사', en: 'Elsa' },
    imageUrl: './elsa.jpg',
  },
  {
    id: 2,
    name: { ko: '아이템 2', en: 'Item 2' },
    imageUrl: './item2.jpg',
  },
  {
    id: 3,
    name: { ko: '아이템 3', en: 'Item 3' },
    imageUrl: './item3.jpg',
  },
  {
    id: 4,
    name: { ko: '아이템 4', en: 'Item 4' },
    imageUrl: './item4.jpg',
  },
  {
    id: 5,
    name: { ko: '아이템 5', en: 'Item 5' },
    imageUrl: './item5.jpg',
  },
  {
    id: 6,
    name: { ko: '아이템 6', en: 'Item 6' },
    imageUrl: './item6.jpg',
  },
];

const LanguageToggle = ({ language, onToggle }) => (
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

const GameSelectCard = ({ name, imageUrl, onClick }) => (
  <div className="wrapper" onClick={onClick}>
    <div className="card">
      <img src={imageUrl} alt={name} />
      <div className="language-label">{name}</div>
      <div className="icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          />
        </svg>
      </div>
    </div>
  </div>
);

export default function GameSelect() {
  const [language, setLanguage] = useState<Language>('ko');

  const toggleLanguage = () => {
    setLanguage((prevLang) => (prevLang === 'ko' ? 'en' : 'ko'));
  };

  const handleClick = (name: string) => {
    console.log(`${name} clicked`);
  };

  const handleExit = () => {
    console.log('Exiting...');
  };

  return (
    <div className="flex flex-col items-center relative">
      <div className="header flex justify-between items-center w-full mb-4">
        <LanguageToggle language={language} onToggle={toggleLanguage} />
        <h1 className="text-center flex-grow">동화 선택</h1>
        <button className="exit-button" onClick={handleExit}>
          나가기
        </button>
      </div>
      <div className="container grid grid-cols-3 gap-4">
        {items.map((item) => (
          <GameSelectCard
            key={item.id}
            name={item.name[language]}
            imageUrl={item.imageUrl}
            onClick={() => handleClick(item.name[language])}
          />
        ))}
      </div>
    </div>
  );
}
