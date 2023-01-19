const jwt = require('jsonwebtoken');
const calendarRepository = require('./query');
const calendarUserConnectionRepository = require('../data/interTableConnectionQuery');
const userRepository = require('../user/query');

exports.create = ctx=>{
    let {name, theme} = ctx.request.body;
    let {token} = ctx.request.header;
    console.log(name, theme, token);
    let userId;
    jwt.verify(token, process.env.JWT_SECRET,(e,d)=>{
        if(e){
            ctx.response.status =400;
            ctx.body={
                result:"잘못된 유저 토큰입니다"
            }
            return;
        }else{
            userId = d.id;
        }
    });

    let user = userRepository.findByUserId(userId);
    if(user == null){
        ctx.response.status=400;
        ctx.body={
            result:"잘못된 유저 토큰입니다."
        }
        return;
    }

    let {affectedRows, calendarId} = calendarRepository.save(name, theme);
    console.log('calendar save : '+calendarId)
    if(affectedRows<0){
        ctx.response.status = 400;
        ctx.body = {
            result:"Create Calendar failed"
        }
    }else{
        affectedRows = calendarUserConnectionRepository.saveCalendarUserConnection(userId,calendarId).affectedRows;

        if(affectedRows<0){
            ctx.response.status=500;
            ctx.body={
                result:"캘린더와 유저 연결에 실패했습니다."
            }
            return;
        }else{
            ctx.body={
                result:"ok",
                insertId:calendarId
            }
        }
    }
}
exports.delete = ctx=>{
    let id = ctx.params.id;
    let result = calendarRepository.findOne(id);
    if(result == null){
        ctx.response.status=400;
        ctx.body={
            result:"id가 "+id+"인 캘린더는 없습니다."
        }
        return;
    }
    let {affectedRows} = calendarRepository.remove(id);
    if(affectedRows<0){
        ctx.response.status=500;
        ctx.body={
            result:"Delete calendar failed"
        }
    }else{
        ctx.body={
            result:"ok"
        }
    }
}
exports.find = ctx=>{
    let calendarId = ctx.query.calendarid;
    let userid = ctx.query.userid;
    if(calendarId!=null){
        let result = calendarRepository.findOne(calendarId);
        console.log(result);
        if(result == null){
            ctx.response.status=400;
            ctx.body={
                result:"id가 "+calendarId+"인 캘린더는 없습니다."
            }
        }else{
            ctx.body={
                calendar:result,
                result:"ok" 
            }
        }
    }
    if(userid!=null){
        let userId = ctx.query.userid;
        let result = calendarUserConnectionRepository.findCalendarByUserId(userId);
        if(result == null){
            ctx.response.status=400;
            ctx.body={
                result:userId+'인 유저가 속한 캘린더는 없습니다.'
            }
        }else{
            let calendarIdList=new Set();
            result.forEach(
                connection => calendarIdList.add(connection.calendarId)
            );
            console.log(calendarIdList);
            let calendars = calendarRepository.findAllById(calendarIdList);

            ctx.body={
                result:"ok",
                calendars:calendars
            }
        }
    }
    
}
