// frontend/src/components/ChatBox.tsx

import React from 'react';
import './ChatBox.css'; // CSS 파일 임포트

interface ChatMessage {
  user: string;
  message: string;
  time: string;
}

interface ChatBoxProps {
  messages: ChatMessage[];
}

const ChatBox: React.FC<ChatBoxProps> = ({ messages }) => {
  const chatEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="chat-box">
      {messages.map((msg, index) => (
        <div key={index}>
          <strong>{msg.user}</strong> [{msg.time}]: {msg.message}
        </div>
      ))}
      <div ref={chatEndRef} />
    </div>
  );
};

export default ChatBox;
