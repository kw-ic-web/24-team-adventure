// backend/db.js
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',         // 사용자 이름
  host: 'localhost',        // 호스트 이름 (보통 'localhost' 사용)
  database: 'postgres',     // 데이터베이스 이름
  password: '0000', // PostgreSQL 비밀번호로 변경
  port: 5432,               // PostgreSQL 기본 포트
});

module.exports = pool;
