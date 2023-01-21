const jwt = require("jsonwebtoken");
const calendarRepository = require("./query");
const userRepository = require("../user/query");

exports.create = async (ctx) => {
  let { name } = ctx.request.body;

  let { userId } = ctx.state;
  let user = await userRepository.findByUserId(userId);
  if (user == null) {
    ctx.response.status = 400;
    ctx.body = {
      result: "잘못된 유저 토큰입니다.",
    };
  } else {
    let { affectedRows, insertId } = await calendarRepository.save(
      name,
      userId
    );
    if (affectedRows <= 0) {
      ctx.response.status = 400;
      ctx.body = {
        result: "Create Calendar failed",
      };
      return;
    } else {
      let res = await calendarRepository.connect(insertId, userId);
      affectedRows = res.affectedRows;

      if (affectedRows <= 0) {
        ctx.response.status = 500;
        ctx.body = {
          result: "Connect Calendar failed",
        };
        return;
      }
    }
    ctx.status = 200;
    ctx.body = {
      result: "ok",
      insertId: insertId,
    };
  }
};

exports.delete = async (ctx) => {
  let calendarId = ctx.params.id;
  let result = await calendarRepository.findById(calendarId);
  // 캘린더가 있는지 찾기
  if (result == null) {
    ctx.response.status = 400;
    ctx.body = {
      result: "id가 " + calendarId + "인 캘린더는 없습니다.",
    };
    return;
  }
  // 캘린더와 유저 연결 해제
  affectedRows = await calendarRepository.disconnectByCalendarId(calendarId)
    .affectedRows;
  if (affectedRows < 0) {
    ctx.response.status = 500;
    ctx.body = {
      result: "Disconnect between calendar and user failed",
    };
    return;
  }
  // 캘린더를 공유하는 유저가 몇명인지 확인
  let foundedUsers = await calendarRepository.findSharedUsers(calendarId);
  // 캘린더를 공유하는 사람이 없으면 캘린더 삭제
  if (foundedUsers == null) {
    // 캘린더 삭제
    affectedRows = await calendarRepository.remove(calendarId).affectedRows;
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
  }
  // 캘린더를 공유하는 사람이 남아 있으면 그대로 두기
  else {
    ctx.body = {
      result: "ok",
    };
  }
};
exports.findById = async (ctx) => {
  let calendarId = ctx.params.id;
  if (calendarId != null) {
    let result = await calendarRepository.findById(calendarId);
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
  let { userId } = ctx.state;
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
