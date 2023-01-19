const crypto = require('crypto');

let users = [
    {
        id:0,
        name:"testUser",
        email:"testUserEmail",
        password: crypto.pbkdf2Sync('1234',process.env.APP_KEY,Number(process.env.PWD_ITER),255,'sha256').toString('base64')
    }
];
let sequence = 1;


exports.save=(name, email, cryptedPassword)=>{
    // db붙이기 이전 임시 값
    let newUser = {
        id:sequence++,
        name:name,
        email:email,
        password:cryptedPassword
    };
    users.push(newUser);
    let res = {
        affectedRows:1,
        insertId:newUser.id
    }
    return res;
}
exports.remove=(userId)=>{
    let removed = users.filter( user=>user.id !== userId);
    users = removed;
    let res = {
        affectedRows:1
    }
    return res;
}
exports.findByEmail=(email)=>{
    let founded = users.filter( user => user.email === email);
    return (founded.length==0)?null:founded;
}

exports.findByUserId=(id)=>{
    let founded = users.filter( user=> user.id === id)
    return (founded.length == 0)?null:founded;
}

