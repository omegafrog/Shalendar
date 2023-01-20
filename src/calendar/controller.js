const jwt = require("jsonwebtoken");
const calendarRepository = require("./query");
const userRepository = require("../user/query");

exports.create = async (ctx) => {
  let { name } = ctx.request.body;
  let { token } = ctx.request.header;

  if (token == undefined) {
    ctx.response.status = 400;
    ctx.body = {
      result: "잘못된 유저 토큰입니다",
    };
  }
  console.log(token);
  // token에서 userId 가져옴
  let userId;
  userId = verifyToken(token, ctx);

  let user = await userRepository.findByUserId(userId);
  if (user == null) {
    ctx.response.status = 400;
    ctx.body = {
      result: "잘못된 유저 토큰입니다.",
    };
    return;
  }

  let { affectedRows, insertId } = await calendarRepository.save(name, userId);

  if (affectedRows < 0) {
    ctx.response.status = 400;
    ctx.body = {
      result: "Create Calendar failed",
    };
  } else {
    affectedRows = await calendarRepository.connect(insertId, userId)
      .affectedRows;
    if (affectedRows < 0) {
      ctx.response.status = 500;
      ctx.body = {
        result: "Connect Calendar failed",
      };
    } else {
      ctx.body = {
        result: "ok",
        insertId: insertId,
      };
    }
  }
};
exports.delete = async (ctx) => {
  let id = ctx.params.id;
  let result = await calendarRepository.findById(id);
  if (result == null) {
    ctx.response.status = 400;
    ctx.body = {
      result: "id가 " + id + "인 캘린더는 없습니다.",
    };
    return;
  }
  let { affectedRows } = await calendarRepository.disconectByCalendarId(id);
  if (affectedRows < 0) {
    ctx.response.status = 500;
    ctx.body = {
      result: "Disconnect between calendar and user failed",
    };
    return;
  }
  affectedRows = await calendarRepository.remove(id).affectedRows;
  if (affectedRows < 0) {
    ctx.response.status = 500;
    ctx.body = {
      result: "Delete calendar failed",
    };
  } else {
    ctx.body = {
      result: "ok",
    };
  }
};
exports.findById = async (ctx) => {
  let calendarId = ctx.params.id;
  if (calendarId != null) {
    let result = await calendarRepository.findById(calendarId);
    console.log(result);
    if (result == null) {
      ctx.response.status = 400;
      ctx.body = {
        result: "id가 " + calendarId + "인 캘린더는 없습니다.",
      };
    } else {
      ctx.body = {
        calendar: result,
        result: "ok",
      };
    }
  } else {
    ctx.response.status = 400;
    ctx.body = {
      result: "Wrong request",
    };
  }
};

exports.findByUserId = async (ctx) => {
  let userId = verifyToken(ctx.request.header.token, ctx);
  if (userId != null) {
    let result = await calendarRepository.findByUserId(userId);
    if (result == null) {
      ctx.response.status = 400;
      ctx.body = {
        result: userId + "인 유저가 속한 캘린더는 없습니다.",
      };
    } else {
      ctx.body = {
        result: "ok",
        calendars: result,
      };
    }
  }
};
function verifyToken(token, ctx) {
  let userId;
  jwt.verify(token, process.env.JWT_SECRET, (e, d) => {
    if (e) {
      ctx.response.status = 400;
      ctx.body = {
        result: "잘못된 유저 토큰입니다",
      };
    }
    userId = d.id;
  });
  return userId;
}
