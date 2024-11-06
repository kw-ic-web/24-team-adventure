import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api"; // Axios 인스턴스 임포트

interface Story {
  story_id: number;
  title: string;
  intro: string;
  cover_pic: string;
}

const StoryGrid: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await api.get("/stories");
        setStories(response.data);
      } catch (error: any) {
        console.error("Failed to fetch stories:", error);
        setError("스토리 데이터를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-semibold mb-6 text-center">동화 선택</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {stories.map((story) => (
          <Link
            to={`/board/${story.story_id}`}
            key={story.story_id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <img
              src={`/${story.cover_pic}`}
              alt={story.title}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold">{story.title}</h3>
              <p className="text-gray-600 mt-2">{story.intro}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default StoryGrid;
