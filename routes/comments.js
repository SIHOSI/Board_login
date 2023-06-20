const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');
const Comment = require('../schemas/comment');
const Post = require('../schemas/post');

//댓글 작성
router.post('/posts/:postId/comments', authMiddleware, async (req, res) => {
  const { commentcontent } = req.body;
  const { postId } = req.params;
  // console.log(res.locals);
  const { user } = res.locals;

  try {
    if (!mongoose.isValidObjectId(postId)) {
      return res.status(400).json({ errorMessage: '유효하지 않은 게시글ID' });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(400).json({ errorMessage: '존재하지 않는 게시글ID' });
    }

    const comment = new Comment({
      nickname: post.nickname,
      nicknameId: post.nicknameId,
      posttitle: post.title,
      postId: post._id,
      commentcontent: commentcontent,
    });

    await comment.save();

    res.status(201).json({
      success: true,
      comment: comment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errorMessage: '서버 에러' });
  }
});

module.exports = router;
