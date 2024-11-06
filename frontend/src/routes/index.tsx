import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// 전역 스타일 임포트
import "./index.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

// StrictMode로 앱을 감싸서 잠재적인 문제를 탐지
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
