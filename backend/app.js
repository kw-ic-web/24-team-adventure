const express = require("express");
const cors = require("cors");
const pool = require("./db"); // db.js에서 Pool 인스턴스 가져오기

const app = express();

// 미들웨어 설정
app.use(
  cors({
    origin: "http://localhost:5173", // 프론트엔드 URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json()); // JSON 파싱 미들웨어

// **API 엔드포인트 설정**

/* 1. 모든 스토리 목록 조회 */
app.get("/stories", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM story");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching stories:", err);
    res
      .status(500)
      .json({ error: "스토리 데이터를 불러오는 데 실패했습니다." });
  }
});

/* 2. 특정 스토리 ID의 모든 게시물 목록 조회 */
app.get("/board/:story_id", async (req, res) => {
  const { story_id } = req.params;
  if (!story_id || isNaN(parseInt(story_id))) {
    console.error("Invalid story_id:", story_id);
    return res.status(400).json({ error: "유효하지 않은 story_id입니다." });
  }
  try {
    const result = await pool.query("SELECT * FROM geul WHERE story_id = $1", [
      parseInt(story_id),
    ]);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res
      .status(500)
      .json({ error: "게시물 데이터를 불러오는 데 실패했습니다." });
  }
});

/* 3. 특정 게시물 상세 조회 */
app.get("/board/:story_id/post/:geul_id", async (req, res) => {
  const { story_id, geul_id } = req.params;
  if (
    !story_id ||
    isNaN(parseInt(story_id)) ||
    !geul_id ||
    isNaN(parseInt(geul_id))
  ) {
    console.error("Invalid story_id or geul_id:", story_id, geul_id);
    return res
      .status(400)
      .json({ error: "유효하지 않은 story_id 또는 geul_id입니다." });
  }
  try {
    const result = await pool.query(
      "SELECT * FROM geul WHERE story_id = $1 AND geul_id = $2",
      [parseInt(story_id), parseInt(geul_id)]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "게시물을 찾을 수 없습니다." });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching post:", err);
    res
      .status(500)
      .json({ error: "게시물 데이터를 불러오는 데 실패했습니다." });
  }
});

/* 4. 특정 게시물에 대한 댓글 목록 조회 */
app.get("/board/:story_id/post/:geul_id/comments", async (req, res) => {
  const { story_id, geul_id } = req.params;
  if (
    !story_id ||
    isNaN(parseInt(story_id)) ||
    !geul_id ||
    isNaN(parseInt(geul_id))
  ) {
    console.error("Invalid story_id or geul_id:", story_id, geul_id);
    return res
      .status(400)
      .json({ error: "유효하지 않은 story_id 또는 geul_id입니다." });
  }
  try {
    const result = await pool.query(
      "SELECT * FROM comment WHERE geul_id = $1 ORDER BY created_at ASC",
      [parseInt(geul_id)]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ error: "댓글 데이터를 불러오는 데 실패했습니다." });
  }
});

/* 5. 새로운 댓글 추가 */
app.post("/board/:story_id/post/:geul_id/comments", async (req, res) => {
  const { story_id, geul_id } = req.params;
  const { user_id, comm_content } = req.body;

  if (!story_id || !geul_id || !user_id || !comm_content) {
    return res.status(400).json({ error: "필요한 정보가 누락되었습니다." });
  }

  try {
    const result = await pool.query(
      "INSERT INTO comment (user_id, geul_id, comm_content, created_at) VALUES ($1, $2, $3, CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Seoul') RETURNING *",
      [user_id, geul_id, comm_content]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ error: "댓글 추가에 실패했습니다." });
  }
});

/* 6. 모든 게시물 최신순 목록 조회 */
app.get("/posts", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM geul ORDER BY uploaded_time DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res
      .status(500)
      .json({ error: "최신 게시물 데이터를 불러오는 데 실패했습니다." });
  }
});

// **서버 시작**
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
