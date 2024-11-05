import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StoryGrid.css";

function StoryGrid() {
  const [stories, setStories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/stories")
      .then((response) => response.json())
      .then((data) => setStories(data))
      .catch((error) => console.error("Failed to fetch stories:", error));
  }, []);

  const handleStoryClick = (story_id) => {
    navigate(`/board/${story_id}`);
  };

  return (
    <div className="story-grid">
      {stories.map((story) => (
        <div
          key={story.story_id}
          className="story-card"
          onClick={() => handleStoryClick(story.story_id)}
        >
          <img src={`path/to/image/${story.cover_pic}`} alt={story.intro} />
          <h3>{story.intro}</h3>
        </div>
      ))}
    </div>
  );
}

export default StoryGrid;
