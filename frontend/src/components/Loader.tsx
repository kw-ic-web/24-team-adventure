import React from "react";
import "./Loader.css"; // 로더 스타일링 CSS

const Loader: React.FC = () => {
  return (
    <div className="loader-container">
      <div className="loader"></div>
    </div>
  );
};

export default Loader;
