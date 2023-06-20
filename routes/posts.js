const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');
const Post = require('../schemas/post');

// 전체 게시글 목록 조회 API
router.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ syncTime: -1 });
    res.status(200).json({ all_Posts: posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errorMessage: '서버 에러' });
  }
});

// 게시글 작성 API
router.post('/posts', authMiddleware, async (req, res) => {
  const { title, content } = req.body;
  // console.log(res.locals);
  const { user } = res.locals;

  console.log(user);

  try {
    const post = new Post({
      title,
      content,
      nicknameId: user.userId,
      nickname: user.nickname,
    });
    console.log(post);
    await post.save();
    res.status(201).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errorMessage: '서버 에러' });
  }
});

module.exports = router;

// {
//   user: {
//     _id: new ObjectId("64910a7801ab42f20cdbc9ec"),
//     nickname: '1111',
//     password: '2222',
//     __v: 0
//   }
// }
// {
//   title: '2222',
//   content: '2222',
//   _id: new ObjectId("64914f05b344d43eac8cb7cd"),
//   syncTime: 2023-06-20T07:02:29.441Z
// }
