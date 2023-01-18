
let users = [];
let sequence = 0;


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

