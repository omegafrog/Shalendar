let todos=[];
let sequence=0;

exports.save=(title, content, calendarId)=>{
    let newTodo = {
        id:sequence++,
        title:title,
        content:content,
        calendarId:calendarId,
        isComplete:false
    }
    todos.push(newTodo);
    let res={
        affectedRows:1,
        insertId:newTodo.id
    }
    return res;
}
exports.findById=(id)=>{
    let founded = todos.find( todo => todo.id == id);
    return (founded.length==0)?null:founded[0];
}
exports.findByCalendarId=(calendarId)=>{
    let founded = todos.find( todo => todo.calendarId==calendarId);
    return (founded.length == 0)?null:founded;
}
exports.findAllByUserId=(userId)=>{
    let founded = [];
    return (founded.length == 0)?null:founded;
}
exports.remove=(id)=>{
    let founded = todos.find( todo => todo.id == id);
    

}
exports.update=()=>{

}