// routes/users.route.js

const express = require("express");
const jwt = require("jsonwebtoken");
const { Users, UserInfos } = require("../models");
const userinfos = require("../models/userinfos");
const router = express.Router();

// 회원가입
router.post("/users", async (req, res) => {
  const { email, password, name, age, gender, profileImage } = req.body;
  const isExistUser = await Users.findOne({ where: { email } });

  if (isExistUser) {
    return res.status(409).json({ message: "이미 존재하는 이메일입니다." });
  }

  // Users 테이블에 사용자를 추가합니다.
  const user = await Users.create({ email, password });
  // UserInfos 테이블에 사용자 정보를 추가합니다.
  const userInfo = await UserInfos.create({
    UserId: user.userId, // 생성한 유저의 userId를 바탕으로 사용자 정보를 생성합니다.
    name,
    age,
    gender: gender.toUpperCase(), // 성별을 대문자로 변환합니다.
    profileImage,
  });

  return res.status(201).json({ message: "회원가입이 완료되었습니다." });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await Users.findOne({ where: { email } });
  if (!user) {
    return res
      .status(401)
      .json({ message: "해당하는 사용자가 존재하지 않습니다." });
  } else if (user.password !== password) {
    return res.status(401).json({ message: "비밀번호가 일치하지 않습니다" });
  }
  //jwt 생상
  //console.log("1: ", user.userId);
  const token = jwt.sign(
    {
      userId: user.userId,
    },
    "customized_secret_key"
  );
  //console.log(token);
  //쿠키를 발급
  res.cookie("authorization", `Bearer ${token}`);
  //response 할당
  return res.status(200).json({ message: "로그인에 성공하였습니다." });
});

// routes/users.route.js

//사용자 조회 api
router.get("/users/:userId", async (req, res) => {
  const { userId } = req.params;
  //사용자 테이블과 사용자 정보 테이블에 있는데이터를 가지고와야함
  const user = await Users.findOne({
    attributes: ["userId", "email", "createdAt", "updatedAt"],
    include: [
      {
        model: UserInfos,
        attributes: ["name", "age", "gender", "profileImage"],
      },
    ],
  });

  return res.status(200).json({ data: user });
});

module.exports = router;
