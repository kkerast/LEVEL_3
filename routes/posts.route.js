// routes/posts.route.js

const express = require("express");
const { Posts } = require("../models");
const router = express.Router();
const { Op } = require("sequelize");
module.exports = router;
// routes/posts.route.js

// 게시글 생성
router.post("/posts", async (req, res) => {
  const { title, content, password } = req.body;
  const post = await Posts.create({ title, content, password });

  res.status(201).json({ data: post });
});

// routes/posts.route.js

// 게시글 전체 조회
router.get("/posts", async (req, res) => {
  const posts = await Posts.findAll({
    attributes: ["postId", "title", "createdAt", "updatedAt"],
  });

  res.status(200).json({ data: posts });
});

// routes/posts.route.js

// 게시글 상세 조회
router.get("/posts/:postId", async (req, res) => {
  const { postId } = req.params;
  const post = await Posts.findOne({
    attributes: ["postId", "title", "content", "createdAt", "updatedAt"],
    where: { postId },
  });

  res.status(200).json({ data: post });
});

// routes/posts.route.js

// 게시글 수정
router.put("/posts/:postId", async (req, res) => {
  const { postId } = req.params;
  const { title, content, password } = req.body;

  const post = await Posts.findOne({ where: { postId } });
  if (!post) {
    return res.status(404).json({ message: "게시글이 존재하지 않습니다." });
  } else if (post.password !== password) {
    return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
  }

  await Posts.update(
    { title, content },
    {
      where: {
        [Op.and]: [{ postId }, [{ password }]],
      },
    }
  );

  res.status(200).json({ data: "게시글이 수정되었습니다." });
});

// routes/posts.route.js

// 게시글 삭제
router.delete("/posts/:postId", async (req, res) => {
  const { postId } = req.params;
  const { password } = req.body;

  const post = await Posts.findOne({ where: { postId } });
  if (!post) {
    return res.status(404).json({ message: "게시글이 존재하지 않습니다." });
  } else if (post.password !== password) {
    return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
  }

  await Posts.destroy({ where: { postId } });

  res.status(200).json({ data: "게시글이 삭제되었습니다." });
});
