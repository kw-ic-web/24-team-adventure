const express = require("express");
const { getAllUsers, createUser } = require("../controllers/userController");

const router = express.Router();

// 모든 사용자 가져오기
router.get("/", getAllUsers);

// 사용자 생성
router.post("/", createUser);

module.exports = router;
