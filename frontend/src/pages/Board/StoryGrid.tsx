import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './StoryGrid.css';

interface Story {
  story_id: number;
  story_title: string;
  cover_pic: string;
}

interface Post {
  geul_id: number;
  story_id: number;
  geul_title: string;
  geul_content: string;
  uploaded_time: string;
}

const StoryGrid: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedStoryId, setSelectedStoryId] = useState<number | null>(null);

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

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/posts');
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchPosts();
  }, []);

  const handleStorySelect = (storyId: number) => {
    setSelectedStoryId(storyId);
  };

  const handleShowAllPosts = () => {
    setSelectedStoryId(null);
  };

  const filteredPosts = selectedStoryId
    ? posts.filter((post) => post.story_id === selectedStoryId)
    : posts;

  return (
    <div className="story-grid-container">
      <h1 className="story-grid-title">Story Board</h1>

      <div className="story-grid">
        {stories.map((story) => (
          <div
            key={story.story_id}
            onClick={() => handleStorySelect(story.story_id)}
            className="story-card"
          >
            <p className="story-title">{story.story_title}</p>
            <img
              src={`http://localhost:3000/${story.cover_pic}`}
              className="story-image"
              alt={story.story_title}
            />
          </div>
        ))}
      </div>

      <h2 className="posts-title">Latest Posts</h2>

      {selectedStoryId && (
        <div className="show-all-button-container">
          <button onClick={handleShowAllPosts} className="show-all-button">
            전체 게시물 보기
          </button>
        </div>
      )}

      <div className="posts-list">
        {filteredPosts.map((post) => (
          <Link
            key={post.geul_id}
            to={`/board/${post.story_id}/post/${post.geul_id}`}
            className="post-link"
          >
            <h3 className="post-title">{post.geul_title}</h3>
            <p className="post-content">{post.geul_content}</p>
            <p className="post-time">
              업로드 시간: {new Date(post.uploaded_time).toLocaleString()}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default StoryGrid;
