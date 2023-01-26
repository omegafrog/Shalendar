const jwt = require("jsonwebtoken");
const calendarRepository = require("../calendar/query");

exports.makeShareKey = async (ctx) => {
  let calendarId = ctx.params.id;
  let founded = calendarRepository.findById(calendarId);
  if (founded == null) {
    ctx.response.status = 400;
    ctx.body = {
      result: "잘못된 접근입니다.",
    };
    return;
  }

  let shareKey = jwt.sign({ calendar_id: calendarId }, process.env.JWT_SECRET);

  ctx.body = {
    shareKey: shareKey,
    calendarId: calendarId
  };
};

exports.processShareKey = async (ctx) => {
  let { shareKey } = ctx.query;
  let { userId } = ctx.state;
  let calendarId;
  await jwt.verify(shareKey, process.env.JWT_SECRET, (e, d) => {
    if (e) {
      ctx.response.status = 400;
      ctx.body = {
        result: "잘못된 접근입니다.",
      };
      return;
    }
    calendarId = d.calendar_id;
  });
  console.log(shareKey, userId);

  let { affectedRows } = await calendarRepository.connect(calendarId, userId);
  if (affectedRows <= 0) {
    ctx.response.status = 500;
    ctx.body = {
      result: "Internal Server Error",
    };
  } else {
    ctx.body = {
      result: "ok",
      insertId: Number(calendarId)
    };
  }
};

exports.unshareUser = async (ctx) => {
  let { userId } = ctx.state;
  let calendarId = ctx.params.id;

  if( userId == undefined || calendarId == undefined ){
    ctx.response.status = 400;
    ctx.body = {
        result : "잘못된 parameter입니다"
    }
  }

  let result = await calendarRepository.findById(calendarId);
  console.log(calendarId, userId);
  if (result != null) {
    let { affectedRows } = await calendarRepository.disconnect(calendarId, userId);
    if (affectedRows <= 0) {
      ctx.response.status = 500;
      ctx.body = {
        result:"Internal Server Error"}
    } else {
      ctx.body = {
        result: `${userId}와 ${calendarId}의 공유가 해제되었습니다`,
      };
    }
  }else{
    ctx.response.status = 400;
    ctx.body ={
        result : "ok",
	description:`user ${userId}는 calendar ${calendarId}와 공유되어 있지 않습니다`
    }
  }
};
