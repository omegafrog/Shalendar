let calendarUserConnection = [];
let sequence = 0;

exports.saveCalendarUserConnection=(userId, calendarId)=>{
    let connection = {
        id:sequence++,
        userId:userId,
        calendarId:calendarId
    }
    calendarUserConnection.push(connection);
    let res = {
        affectedRows:1,
        insertId:connection.id
    }
    return res;
}

exports.findCalendarByUserId=(userId)=>{
    let result = calendarUserConnection.filter(
        connection => connection.userId==userId
    );
    return (result.length<0)?null:result;
}