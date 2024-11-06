import React from 'react';

interface GameSelectCardProps {
  name: string;
  imageUrl: string;
  onClick: () => void;
}

function GameSelectCard({ name, imageUrl, onClick }: GameSelectCardProps) {
  return (
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
}

export default GameSelectCard;
