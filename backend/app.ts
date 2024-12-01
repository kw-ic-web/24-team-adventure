import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import storyRoutes from "./routes/storyRoutes";
import boardRoutes from "./routes/boardRoutes";
import listRoutes from "./routes/listRoutes";
import commentRoutes from "./routes/commentRoutes";
import authRoutes from "./routes/authRoutes";
import mypageRoutes from "./routes/mypageRoutes";
import protectedRoutes from "./routes/protectedRoutes";
import finalstorySave from "./routes/finalStorySave";
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
app.use(finalstorySave);

// 서버 시작
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
