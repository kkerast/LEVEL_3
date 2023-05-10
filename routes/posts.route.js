// routes/posts.route.js

const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");
const { Posts } = require("../models");
const { Op } = require("sequelize");

// routes/posts.route.js

// 게시글 생성
router.post("/posts", authMiddleware, async (req, res) => {
  //게시글을 생성하는 사용자의 정보를 가지고올것.
  const { userId } = res.locals.user;
  const { title, content } = req.body;
  const post = await Posts.create({
    UserId: userId,
    title,
    content,
  });

  res.status(201).json({ data: post });
});

// routes/posts.route.js

// 게시글 목록 조회
router.get("/posts", async (req, res) => {
  const posts = await Posts.findAll({
    attributes: ["postId", "title", "createdAt", "updatedAt"],
    order: [["createdAt", "DESC"]],
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
router.put("/posts/:postId", authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { postId } = req.params;
  const { title, content, password } = req.body;

  const post = await Posts.findOne({ where: { postId } });
  if (!post) {
    return res.status(404).json({ message: "게시글이 존재하지 않습니다." });
  } else if (userId !== postId) {
    return res
      .status(403)
      .json({ errorMessage: "게시글 수정의 권한이 존재하지 않습니다." });
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
router.delete("/posts/:postId", authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { postId } = req.params;
  //const { password } = req.body;

  const post = await Posts.findOne({ where: { postId } });
  if (!post) {
    return res.status(404).json({ message: "게시글이 존재하지 않습니다." });
  } else if (userId !== postId) {
    return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
  }

  await Posts.destroy({ where: { postId } });

  res.status(200).json({ data: "게시글이 삭제되었습니다." });
});

module.exports = router;
