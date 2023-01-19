
let calendars=[];
let sequence = 0;

exports.save=(name, theme, userId)=>{
    let newCalendar={
        id:sequence++,
        name:name,
        theme:theme,
        userId:userId
    }
    calendars.push(newCalendar);
    let result = {
        affectedRows:1,
        calendarId:newCalendar.id
    }
    return result
}
exports.findOne=(id)=>{
    let founded = calendars.filter(
        calendar => calendar.id==id
    )
    return (founded.length==0)?null:founded[0];
}
exports.findAllById=(idSet)=>{
    let result = [];
    for (let id of idSet){
        result.push(calendars.find(calendar => calendar.id == id));
    }
    return result;
}

exports.findByUserId=(userId)=>{
    let founded = calendars.filter(
        calendar=>calendar.userId == userId
    )
    return (founded.length()==0)?null:founded;
}
exports.remove=(id)=>{
    let affectedRows = 0;
    calendars = calendars.filter(
        calendar=>{calendar.id !=id}
    )
    let res={
        affectedRows:affectedRows
    }
    return res;
}
