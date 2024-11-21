import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GameSelect.css';
import LanguageToggle from '../../components/game/LanguageToggle';
import { toggleLanguage, Language } from '../../utils/game/languageUtils';

// 스토리 데이터 타입 정의
interface Story {
  id: number;
  name: { ko: string; en: string };
  imageUrl: string;
}

const GameSelect = () => {
  const [language, setLanguage] = useState<Language>('ko');
  const [stories, setStories] = useState<Story[]>([]);

  const handleToggleLanguage = () => {
    setLanguage(toggleLanguage(language));
  };

  const handleClick = (name: string) => {
    console.log(`${name} clicked`);
  };

  const handleExit = () => {
    console.log('Exiting...');
  };

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3000/stories/select',
        );
        const fetchedStories = response.data.map((story: any) => ({
          id: story.story_id,
          name: { ko: story.story_title, en: story.story_title_en },
          imageUrl: `http://localhost:3000/${story.cover_pic}`,
        }));
        setStories(fetchedStories);
      } catch (error) {
        console.error('Error fetching stories:', error);
      }
    };

    fetchStories();
  }, []);

  return (
    <div className="game-select-container">
      <div className="game-select-header">
        <LanguageToggle language={language} onToggle={handleToggleLanguage} />
        <h1 className="game-select-title">동화 선택</h1>
        <button className="exit-button" onClick={handleExit}>
          나가기
        </button>
      </div>
      <div className="container">
        {stories.map((story) => (
          <div
            key={story.id}
            className="card"
            onClick={() => handleClick(story.name[language])}
          >
            <img src={story.imageUrl} alt={story.name[language]} />
            <p className="card-title">{story.name[language]}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameSelect;
