const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');

const Post = require('../schemas/post');

router.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find({}, 'title authorName createdAt').sort({
      createdAt: -1,
    });
    res.status(200).json({ posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errorMessage: '서버 에러' });
  }
});

router.post('/posts', authMiddleware, async (req, res) => {
  const { title, content } = req.body;
  const { user } = res.locals;

  try {
    const post = new Post({
      title,
      content,
      author: user.userId,
      authorName: user.nickname,
    });
    await post.save();
    res.status(201).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errorMessage: '서버 에러' });
  }
});

module.exports = router;
