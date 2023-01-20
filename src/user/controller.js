const crypto = require("crypto");
const userRepository = require("./query");
const jwt = require("jsonwebtoken");

exports.register = async (ctx) => {
  let { name, email, password } = ctx.request.body;
  const cryptedPassword = encryptPassword(password);

  let res = await userRepository.findByEmail(email);

  if (res != null) {
    ctx.body = {
      result: "가입된 이메일이 있습니다.",
    };
    ctx.response.status = 400;
  } else {
    let { affectedRows, insertId } = await userRepository.save(
      name,
      email,
      cryptedPassword.toString("base64")
    );
    if (affectedRows < 0) {
      ctx.response.status = 400;
      ctx.body = {
        result: "Register failed",
      };
    } else {
      ctx.body = {
        result: "ok",
        insertId: insertId,
      };
    }
  }
};

exports.signOut = async (ctx) => {
  let { token } = ctx.request.header;
  let userId = jwt.verify(token, process.env.JWT_SECRET, (e, d) => {
    if (e) {
      ctx.response.status = 400;
      ctx.body = {
        result: "Decoding token failed",
      };
    }
  }).id;

  let userAffectedRows = await userRepository.remove(userId).affectedRows;
  

  if (affectedRows < 0) {
    ctx.response.status = 400;
    ctx.body = {
      result: "SignOut failed",
    };
  } else {
    ctx.body = {
      result: "ok",
    };
  }
};

exports.login = async (ctx) => {
  let { email, password } = ctx.request.body;

  const cryptedPassword = encryptPassword(password);

  let foundedUser = await userRepository.findByEmail(email);

  if (foundedUser == null) {
    ctx.response.status = 400;
    ctx.body = {
      result: "가입된 이메일이 없습니다.",
    };
    return;
  }
  let token = generateToken(foundedUser);
  if (foundedUser.password === cryptedPassword.toString("base64")) {
    ctx.body = {
      result: "ok",
      token: token,
    };
  } else {
    ctx.response.status = 400;
    ctx.body = {
      result: "Login failed",
    };
  }
};

function generateToken(foundedUser) {
  return jwt.sign({ id: foundedUser.user_id }, process.env.JWT_SECRET);
}

function encryptPassword(password) {
  return crypto.pbkdf2Sync(
    password,
    process.env.APP_KEY,
    Number(process.env.PWD_ITER),
    180,
    "sha256"
  );
}
