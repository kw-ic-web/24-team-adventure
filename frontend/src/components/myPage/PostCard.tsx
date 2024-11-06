// src/components/PostCard.tsx
import React from 'react';

interface PostCardProps {
  imageUrl: string;
  title: string;
  description: string;
}

export default function PostCard({
  imageUrl,
  title,
  description,
}: PostCardProps) {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <img
        src={imageUrl}
        alt="게시물 사진"
        className="w-full h-40 object-cover"
      />
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
}
