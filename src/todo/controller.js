const todoRepository = require("./query");

exports.create = async (ctx) => {
  let { title } = ctx.request.body;
  if(title == undefined){
    ctx.response.status = 400;
    ctx.body = {
      result : "Title is undefined"
    }
  }

  let calendarId = ctx.params.id;

  // save new todo into db
  let { affectedRows, insertId } = await todoRepository.save(title, calendarId);
  if (affectedRows < 0) {
    ctx.response.status = 400;
    ctx.body = {
      result: "Save Todo failed",
    };
  } else {
    ctx.body = {
      result: "ok",
      insertId: insertId,
    };
  }
};

exports.find = async (ctx) => {
  let todoId = ctx.params.id;
  let result = await todoRepository.findById(todoId);
  if (result != null) {
    ctx.body = {
      result: "ok",
      todo: result,
    };
  } else {
    ctx.response.status = 400;
    ctx.body = {
      result: "Failed to find todo",
    };
  }
};
exports.findByCalendarId = async (ctx) => {
  let calendarId = ctx.params.id;
  let result = await todoRepository.findByCalendarId(calendarId);
  if (result != null) {
    ctx.body = {
      result: "ok",
      todos: result,
    };
  } else {
    ctx.response.status = 400;
    ctx.body = {
      result: "Failed to find todo by calendar Id",
    };
  }
};
exports.findByUserId = async (ctx) => {
  let {userId} = ctx.state;
  if (userId == null) {
    ctx.response.status = 400;
    ctx.body = {
      result: "로그인이 필요합니다.",
    };
  } else {
    let foundedTodos = await todoRepository.findAllByUserId(userId);
    if (foundedTodos != null) {
      ctx.body = {
        result: "ok",
        todos: foundedTodos,
      };
    } else {
      ctx.response.status = 400;
      ctx.body = {
        result: "Failed to find todo",
      };
    }
  }
};
exports.delete = async (ctx) => {
  let id = ctx.params.id;
  
  let { affectedRows } = todoRepository.remove(id);
  if (affectedRows < 0) {
    ctx.response.status = 400;
    ctx.body = {
      result: "Failed to delete todo",
    };
  } else {
    ctx.body = {
      result: "ok",
    };
  }
};
exports.update = async (ctx) => {
  let id = ctx.params.id;
  let { title } = ctx.request.body;
  let result =await todoRepository.findById(id);
  if (result != null) {
    let updatedTodo = {
      todo_id: id,
      title: title,
      isComplete: result.isComplete,
      calendar_id: result.calendar_id,
    };
    let { affectedRows } = await todoRepository.update(id, updatedTodo);
    if (affectedRows < 0) {
      ctx.response.status = 400;
      ctx.body = {
        result: "Failed to update todo",
      };
    } else {
      ctx.body = {
        result: "ok",
        insertId: id,
      };
    }
  }else{
    ctx.response.status=400;
    ctx.body={
        result:"Failed to find todo"
    }
  }
};
exports.checkComplete = async (ctx) => {
  let id = ctx.params.id;
  let result = await todoRepository.findById(id);
  result.isComplete = true;
  let { affectedRows } = todoRepository.update(id, result);
  if (affectedRows < 0) {
    ctx.response.status = 400;
    ctx.body = {
      result: "Failed to check complete",
    };
  } else {
    ctx.body = {
      result: "ok",
      checkedId: id,
    };
  }
};
