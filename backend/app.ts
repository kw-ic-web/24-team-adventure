import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import socketHandler from "./services/socketHandler";
import storyRoutes from "./routes/storyRoutes";
import boardRoutes from "./routes/boardRoutes";
import listRoutes from "./routes/listRoutes";
import commentRoutes from "./routes/commentRoutes";
import authRoutes from "./routes/authRoutes";
import mypageRoutes from "./routes/mypageRoutes";
import protectedRoutes from "./routes/protectedRoutes";
import roomRoutes from "./routes/roomRoutes"; // 새로 추가
import http from "http"; // import으로 변경
import userStatusRoutes from "./routes/userStatusRoutes";
import finalstorySave from "./routes/finalstorySave";
dotenv.config();

const app = express();

// CORS 설정
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// JSON 및 URL 인코딩 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 정적 파일 제공 설정
app.use(express.static(path.join(__dirname, "public")));

// 라우트 설정
app.use(storyRoutes);
app.use(boardRoutes);
app.use(listRoutes);
app.use(commentRoutes);
app.use(authRoutes);
app.use(mypageRoutes);
app.use(protectedRoutes);
app.use(roomRoutes);
app.use(userStatusRoutes);
app.use(finalstorySave);

// HTTP 서버 생성
const server = http.createServer(app);
socketHandler(server);

// 서버 시작
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
