import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./StoryGrid.css"; // 스토리 그리드 스타일링 CSS

// Story의 타입 정의
interface Story {
  story_id: number;
  title: string;
  intro: string;
  cover_pic: string;
}

const StoryGrid: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]); // 스토리 목록 상태
  const [loading, setLoading] = useState<boolean>(true); // 로딩 상태
  const [error, setError] = useState<string>(""); // 에러 메시지

  useEffect(() => {
    // 스토리 데이터를 백엔드에서 가져오는 함수
    const fetchStories = async () => {
      try {
        const response = await fetch("http://localhost:3000/stories"); // 백엔드의 /stories 엔드포인트
        if (!response.ok) throw new Error("Failed to fetch stories");
        const data: Story[] = await response.json();
        console.log("Fetched Stories:", data); // 디버깅용 로그
        setStories(data);
      } catch (error: any) {
        console.error("Failed to fetch stories:", error);
        setError("스토리 데이터를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  // 로딩 중일 때 표시
  if (loading) {
    return <div>Loading...</div>;
  }

  // 에러 발생 시 표시
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="story-grid">
      <h2>동화 선택</h2>
      <div className="story-cards">
        {stories.map((story) => {
          console.log("Story Object:", story); // 각 스토리 객체 확인용 로그
          if (!story.story_id) {
            console.error("Story ID is undefined for story:", story);
            return null;
          }
          return (
            <Link to={`/board/${story.story_id}`} key={story.story_id} className="story-card-link">
              <div className="story-card">
                {/* 스토리 커버 이미지 */}
                <img src={`/${story.cover_pic}`} alt={story.title} className="story-image" />
                <h3>{story.title}</h3>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default StoryGrid;
