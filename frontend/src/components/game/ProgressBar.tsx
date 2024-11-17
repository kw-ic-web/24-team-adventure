import React from 'react';

interface ProgressBarProps {
  currentPage: number;
  totalPages: number;
}

export default function ProgressBar({
  currentPage,
  totalPages,
}: ProgressBarProps): JSX.Element {
  return (
    <div className="fixed top-0 left-4 h-full flex flex-col justify-center items-center space-y-2 px-2 z-10">
      {Array.from({ length: totalPages }).map((_, index) => (
        <div
          key={index}
          className={`w-2 h-10 rounded-full transition-colors duration-300 ${
            index < currentPage + 1
              ? index < 3
                ? 'bg-blue-500'
                : 'bg-green-500'
              : 'bg-gray-700'
          }`}
        />
      ))}
    </div>
  );
}
