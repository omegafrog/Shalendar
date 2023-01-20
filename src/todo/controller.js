
const todoRepository = require('./query');
const jwt = require('jsonwebtoken');


exports.create= ctx=>{
    let {title, content} = ctx.request.body;
    let token = ctx.request.header;

    // get userId from token's payload
    let userId;
    jwt.verify(token, process.env.JWT_SECRET, (e,d)=>{
        if(e){
            ctx.response.status = 400;
            ctx.body={
                result:"유저 인증 실패"
            }
        }else{
            userId = d.id;        
        }
    });

    let calendarId = ctx.params.id;

    // save new todo into db
    let {affectedRows, insertId} = todoRepository.save(title, content, calendarId);


    if(affectedRows<0){
        ctx.response.status=400;
        ctx.body = {
            result:"Save Todo failed"
        }
    }else{
        ctx.body={
            result:"ok",
            insertId:insertId
        }
    }
}


exports.find= ctx=>{
    let todoId = ctx.params.id;
    let result = todoRepository.findById(todoId);
    if(result !=null){
        ctx.body={
            result:"ok",
            todo:result
        }
    }else{
        ctx.response.status=400;
        ctx.body={
            result:"Failed to find todo"
        }
    }

}
exports.findByCalendarId= ctx=>{
    let calendarId = ctx.params.id;
    let result = todoRepository.findByCalendarId(calendarId);
    if(result!=null){
        ctx.body={
            result:"ok",
            todos:result
        }
    }else{
        ctx.response.status=400;
        ctx.body={
            result:"Failed to find todo by calendar Id"
        }
    }
}
exports.findByUserId= ctx=>{
    let {token} = ctx.request.header;
    let userId;
    if(token == null){
        ctx.response.status=400;
        ctx.body={
            result:"로그인이 필요합니다."
        }
    }else{
        jwt.verify(token, process.env.JWT_SECRET, (e,d)=>{
            if(e){
                ctx.response.status=400;
                ctx.body={
                    result:"Failed to login",
                }
            }else{
               userId= d.id;
            }
        });
        
        let foundedTodos;
        if(result!=null){
            foundedTodos = todoRepository.findAllByUserId(userId);
        }
        if(foundedTodos!=null){
            ctx.body = {
                result:"ok",
                todos:foundedTodos
            }
        }else{
            ctx.response.status=400;
            ctx.body={
                result:"Failed to find todo",
            }
        }
    }
}
exports.delete= ctx=>{
    let id = ctx.params.id;
    let {affectedRows} = todoRepository.remove(id);
    if(affectedRows<0){
        ctx.response.status=400;
        ctx.body={
            result:"Failed to delete todo"
        }
    }else{
        affectedRows = todoUserConnectionRepository.removeByTodoId(id);
        if(affectedRows<0){
            ctx.response.status=400;
            ctx.body={
                result:"Failed to remove connection between todo and user"
            }   
        }
        ctx.body={
            result:"ok"
        }
    }
}
exports.update= ctx=>{
    let id = ctx.params.id;
    let {title, content} = ctx.request.body;
    let result = todoRepository.findById(id);
    if(result!=null){
        let updatedTodo = {
            id:id,
            title:title,
            content:content,
            isComplete:result.isComplete,
            calendarId:result.calendarId
        }
        let {affectedRows} = todoRepository.update(id, updatedTodo);
        if(affectedRows<0){
            ctx.response.status=400;
            ctx.body={
                result:"Failed to update todo"
            }
        }else{
            ctx.body={
                result:"ok",
                insertId: id
            }
        }
    }
}
exports.checkComplete= ctx=>{
    let id = ctx.params.id;
    let result = todoRepository.findById(id);
    result.isComplete = true;
    let {affectedRows} = todoRepository.update(id, result);
    if(affectedRows<0){
        ctx.response.status=400;
        ctx.body={
            result:"Failed to check complete"
        }
    }else{
        ctx.body={
            result:"ok",
            checkedId:id
        }
    }
}