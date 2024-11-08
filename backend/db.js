const { Pool } = require("pg");
require("dotenv").config(); // .env 파일에서 환경 변수를 로드

const pool = new Pool({
  user: process.env.DB_USER, // 사용자 이름
  host: process.env.DB_HOST, // 호스트 이름
  database: process.env.DB_NAME, // 데이터베이스 이름
  password: process.env.DB_PASSWORD, // PostgreSQL 비밀번호
  port: process.env.DB_PORT, // PostgreSQL 포트
});

module.exports = pool;
