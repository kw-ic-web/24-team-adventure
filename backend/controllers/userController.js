const db = require("../config/db");

// 모든 사용자 가져오기
const getAllUsers = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM users"); // 'users' 테이블에 맞게 수정
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// 사용자 생성
const createUser = async (req, res) => {
  const { name, email } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
      [name, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getAllUsers,
  createUser,
};
