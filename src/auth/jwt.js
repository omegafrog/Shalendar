const jwt = require("jsonwebtoken");

exports.login = async (ctx, next) => {
  let { token } = ctx.request.header;
  console.log("token : " + token);
  await jwt.verify(token, process.env.JWT_SECRET, (e, d) => {
    if (e) {
      ctx.response.status = 400;
      ctx.body = {
        result: "잘못된 유저 토큰입니다",
      };
      return;
    }else{
      ctx.state.userId=d.id;
    }
    return next();
  });
};
