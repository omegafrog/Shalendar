const crypto = require('crypto');
const {save, remove, findByEmail} = require('./query');
const jwt = require('jsonwebtoken');

exports.register=ctx=>{
    let {name, email, password}=ctx.request.body;
    let result = findByEmail(email);
    if(result != null){
        ctx.response.status=400;
        ctx.body={
            result:"가입된 이메일이 있습니다."
        }
        return;
    }
    const cryptedPassword = crypto.pbkdf2Sync(
        password,
        process.env.APP_KEY,
        Number(process.env.PWD_ITER),
        255,
        'sha256'
        );
    console.log("register pass:\n"+cryptedPassword.toString('base64'));

    let {affectedRows, insertId} = save(name, email, cryptedPassword.toString('base64'));
    if(affectedRows<0){
        ctx.response.status=400;
        ctx.body={
            result:"Register failed"
        }
    }else{
        ctx.body={
            result:"ok",
            insertId:insertId
        }
    }
}
exports.signOut=ctx=>{
    let {token} = ctx.request.header;
    let userId;
    jwt.verify(token, process.env.JWT_SECRET,(e,d)=>{
        if(e){
            ctx.response.status=400;
            ctx.body={
                result:"Decoding token failed"
            }
            return;
        }  
        userId = d.id;
        

    });
    console.log(userId);
    let affectedRows = remove(userId);
    if(affectedRows <0){
        ctx.response.status = 400;
        ctx.body={
            result:"SignOut failed"
        }
    }else{
        ctx.body={
            result:"ok"
        }
    }
}
exports.login=ctx=>{
    let {email, password}=ctx.request.body;
    const cryptedPassword = crypto.pbkdf2Sync(
        password,
        process.env.APP_KEY,
        Number(process.env.PWD_ITER),
        255,
        'sha256'
    );
    console.log("login pass:\n"+cryptedPassword.toString('base64'));
    let result= findByEmail(email);
    console.log(result);
    if(result == null){
        ctx.response.status=400;
        ctx.body={
            result:"가입된 이메일이 없습니다."
        }
        return;
    }

    let token = jwt.sign({id:result[0].id},process.env.JWT_SECRET);
    if(result[0].password === cryptedPassword.toString('base64')){
        ctx.body = {
            result:"ok",
            token:token
        }
    }else{
        ctx.response.status=400;
        ctx.body={
            result:"Login failed"
        }
    }

}