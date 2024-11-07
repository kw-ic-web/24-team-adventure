import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

interface Story {
  story_id: number;
  title: string;
  intro: string;
  cover_pic: string;
}

const StoryGrid: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await api.get('/stories');
        setStories(response.data);
      } catch (error) {
        console.error('Error fetching stories:', error);
      }
    };

    fetchStories();
  }, []);

  const handleStoryClick = (story_id: number) => {
    navigate(`/board/${story_id}`);
  };

  return (
    <div className="grid grid-cols-3 gap-4 p-8">
      {stories.map((story) => (
        <div
          key={story.story_id}
          onClick={() => handleStoryClick(story.story_id)}
          className="cursor-pointer border rounded-lg shadow p-4 hover:bg-gray-100"
        >
          {story.cover_pic ? (
            <img
              src={story.cover_pic}
              alt={story.title}
              className="w-full h-48 object-cover"
            />
          ) : (
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
              이미지 없음
            </div>
          )}
          <h2 className="text-lg font-semibold mt-2">{story.title}</h2>
          <p className="text-gray-600">{story.intro}</p>
        </div>
      ))}
    </div>
  );
};

export default StoryGrid;
