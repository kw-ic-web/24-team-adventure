const express = require("express");
const cors = require("cors");
const pool = require("./db"); // db.js 파일에서 pool 가져오기

const app = express();
app.use(cors());
app.use(express.json());

// 스토리 목록 가져오기 엔드포인트
app.get("/stories", async (req, res) => {
    try {
        const stories = await pool.query("SELECT * FROM story");
        res.json(stories.rows);
    } catch (err) {
        console.error("Error fetching stories:", err);
        res.status(500).json({ error: "Failed to fetch stories" });
    }
});

// 특정 스토리에 대한 게시물 목록 가져오기
app.get("/stories/:story_id", async (req, res) => {
    const { story_id } = req.params;
    
    if (!story_id || isNaN(story_id)) {
        return res.status(400).json({ error: "Invalid story ID" });
    }

    try {
        const posts = await pool.query("SELECT * FROM one_s_story WHERE story_id = $1", [parseInt(story_id)]);
        res.json(posts.rows);
    } catch (err) {
        console.error("Error fetching posts for story:", err);
        res.status(500).json({ error: "Failed to fetch posts for story" });
    }
});

// 특정 게시물 세부 정보 가져오기 엔드포인트
app.get("/board/:story_id/post/:post_id", async (req, res) => {
    const { story_id, post_id } = req.params;
    try {
        const post = await pool.query("SELECT * FROM one_s_story WHERE story_id = $1 AND id = $2", [story_id, post_id]);
        if (post.rows.length === 0) {
            return res.status(404).json({ error: "게시물을 찾을 수 없습니다." });
        }
        res.json(post.rows[0]);
    } catch (err) {
        console.error("Error fetching post details:", err);
        res.status(500).json({ error: "게시물 세부 정보 가져오기에 실패했습니다." });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
