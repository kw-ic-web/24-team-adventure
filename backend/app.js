// backend/app.js
const express = require('express');
const cors = require('cors');
const pool = require('./db');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// 게시판 목록 조회 API
app.get('/board', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM one_s_story ORDER BY uploaded_time DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch board data' });
  }
});

// 게시물 상세 조회 API
app.get('/board/:geul_id', async (req, res) => {
  const { geul_id } = req.params;
  if (isNaN(geul_id)) {
    return res.status(400).json({ error: 'Invalid post ID' });
  }
  try {
    const result = await pool.query('SELECT * FROM one_s_story WHERE geul_id = $1', [geul_id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch post details' });
  }
});

// 댓글 작성 API
app.post('/board/:geul_id/comment', async (req, res) => {
  const { geul_id } = req.params;
  const { id, comm_content } = req.body;
  if (isNaN(geul_id)) {
    return res.status(400).json({ error: 'Invalid post ID' });
  }
  try {
    await pool.query(
      'INSERT INTO comment (id, geul_id, comm_content) VALUES ($1, $2, $3)',
      [id, geul_id, comm_content]
    );
    res.status(201).json({ message: 'Comment added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
