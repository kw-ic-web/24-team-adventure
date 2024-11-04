// backend/app.js
const express = require('express');
const cors = require('cors');
const pool = require('./db'); // PostgreSQL 연결 설정 파일
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json()); // JSON 요청 바디를 파싱

// 게시판 목록 조회 API
app.get('/board', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM one_s_story ORDER BY "uploaded_time" DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching board data:', err);
    res.status(500).json({ error: 'Failed to fetch board data' });
  }
});

// 게시물 상세 조회 API
app.get('/board/:geul_ID', async (req, res) => {
  const { geul_ID } = req.params;
  if (isNaN(geul_ID)) {
    console.error(`Invalid geul_ID: ${geul_ID}`);
    return res.status(400).json({ error: 'Invalid post ID' });
  }

  try {
    const result = await pool.query('SELECT * FROM one_s_story WHERE geul_ID = $1', [geul_ID]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching post details:', err);
    res.status(500).json({ error: 'Failed to fetch post details' });
  }
});

// 댓글 작성 API
app.post('/board/:geul_ID/comment', async (req, res) => {
  const { geul_ID } = req.params;
  const { ID, comm_content } = req.body;

  if (isNaN(geul_ID)) {
    console.error(`Invalid geul_ID: ${geul_ID}`);
    return res.status(400).json({ error: 'Invalid post ID' });
  }

  try {
    await pool.query(
      'INSERT INTO comment (ID, geul_ID, comm_content) VALUES ($1, $2, $3)',
      [ID, geul_ID, comm_content]
    );
    res.status(201).json({ message: 'Comment added successfully' });
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
