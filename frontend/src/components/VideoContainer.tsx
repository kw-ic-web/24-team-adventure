import React, { useRef, useEffect } from 'react';
import './VideoContainer.css'; // CSS 파일 임포트

interface VideoContainerProps {
  userId: string;
  stream: MediaStream;
}

const VideoContainer: React.FC<VideoContainerProps> = ({ userId, stream }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="video-container">
      <video ref={videoRef} autoPlay playsInline />
      <p>{userId}</p>
    </div>
  );
};

export default VideoContainer;
