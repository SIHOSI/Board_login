const jwt = require('jsonwebtoken');
const User = require('../schemas/user');

const authMiddleware = async (req, res, next) => {
  const { Authorization } = req.cookies;
  const [authType, authToken] = (Authorization ?? '').split(' ');

  if (!authToken || authType !== 'Bearer') {
    return res.status(401).send({
      errorMessage: '로그인 후 이용 가능한 기능입니다.',
    });
  }

  try {
    const { userId } = jwt.verify(authToken, 'customized-secret-key');
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).send({
        errorMessage: '유효한 사용자가 아닙니다.',
      });
    }
    res.locals.user = user;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).send({
      errorMessage: '로그인 후 이용 가능한 기능입니다.',
    });
  }
};

module.exports = authMiddleware;

// 사용자 인증 미들웨어
// module.exports = async (req, res, next) => {
//   const { Authorization } = req.cookies;
//   const [authType, authToken] = (Authorization ?? '').split(' ');

//   if (!authToken || authType !== 'Bearer') {
//     res.status(401).send({
//       errorMessage: '로그인 후 이용 가능한 기능입니다.',
//     });
//     return;
//   }

//   try {
//     const { userId } = jwt.verify(authToken, 'customized-secret-key');
//     const user = await User.findById(userId);
//     res.locals.user = user;
//     next();
//   } catch (err) {
//     console.error(err);
//     res.status(401).send({
//       errorMessage: '로그인 후 이용 가능한 기능입니다.',
//     });
//   }
// };
