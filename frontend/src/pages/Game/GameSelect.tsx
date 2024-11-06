import React, { useState } from 'react';
import './GameSelect.css';
import LanguageToggle from '../../components/game/LanguageToggle.tsx';
import GameSelectCard from '../../components/game/GameSelectcard.tsx';
import { toggleLanguage, Language } from '../../utils/game/languageUtils.ts';

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

function GameSelect() {
  const [language, setLanguage] = useState<Language>('ko');

  const handleToggleLanguage = () => {
    setLanguage(toggleLanguage(language));
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
        <LanguageToggle language={language} onToggle={handleToggleLanguage} />
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

export default GameSelect;
