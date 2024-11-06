import React, { createContext, useState, useEffect } from "react";
import api from "../api"; // Axios 인스턴스 임포트

// Story와 Post의 타입 정의
interface Story {
  story_id: number;
  title: string;
  intro: string;
  cover_pic: string;
}

interface Post {
  geul_id: number;
  id: number;
  story_id: number;
  content: string;
  final_pic: string;
  title: string;
  uploaded_time: string;
  author: string;
}

// 컨텍스트의 타입 정의
interface BoardContextType {
  stories: Story[];
  posts: Post[];
  loading: boolean;
  error: string;
}

// 기본값을 가진 컨텍스트 생성
export const BoardContext = createContext<BoardContextType>({
  stories: [],
  posts: [],
  loading: true,
  error: "",
});

// 컨텍스트 제공자 컴포넌트
export const BoardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stories, setStories] = useState<Story[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // 스토리와 게시물을 백엔드에서 가져오는 함수
    const fetchData = async () => {
      try {
        // 스토리 데이터 가져오기
        const storiesResponse = await api.get("/stories");
        setStories(storiesResponse.data);

        // 모든 게시물 데이터 가져오기
        const postsResponse = await api.get("/posts");
        setPosts(postsResponse.data);
      } catch (err: any) {
        console.error("Error fetching board data:", err);
        setError("보드 데이터를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    // 컨텍스트를 통해 모든 하위 컴포넌트에 데이터 제공
    <BoardContext.Provider value={{ stories, posts, loading, error }}>
      {children}
    </BoardContext.Provider>
  );
};
