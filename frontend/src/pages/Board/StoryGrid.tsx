import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import HomeButton from '../../components/HomeButton';

interface Story {
  story_id: number;
  story_title: string;
  cover_pic: string;
}

const StoryGrid: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await axios.get('http://localhost:3000/stories');
        setStories(response.data);
      } catch (error) {
        console.error('Error fetching stories:', error);
      }
    };

    fetchStories();
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen relative">
      <h1 className="text-3xl font-bold mb-6 text-center">Story Board</h1>
      <div className="grid grid-cols-6 gap-6">
        {stories.map((story) => (
          <Link
            to={`/board/${story.story_id}`}
            key={story.story_id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-4 text-center"
          >
            <p className="text-gray-800 font-semibold mb-2">
              {story.story_title}
            </p>
            <img
              src={story.cover_pic}
              className="w-full h-40 object-cover rounded-md"
            />
          </Link>
        ))}
      </div>
      <HomeButton />
    </div>
  );
};

export default StoryGrid;
