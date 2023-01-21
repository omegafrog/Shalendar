const {pool} = require('../data/connection');



exports.save= async (name, email, cryptedPassword)=>{
    
    const query = `INSERT INTO user (user_name, email, password) values (?,?,?)`;
    return await pool(query, [name, email, cryptedPassword]);

}
exports.remove=async (userId)=>{
    const userTableQuery = `DELETE FROM user WHERE user_id=?`;
    
    return await pool(userTableQuery, [userId]);
}
exports.findByEmail=async(email)=>{
    const query = `SELECT * FROM user WHERE email=?`;
    let result = await pool(query, [email]);
    if(result <=0)
        return null;
    else{
        return result[0];
    }
    
}

exports.findByUserId=async (id)=>{
    const query = `SELECT * FROM user WHERE user_id = ?`;
    let result = await pool(query, [id]);
    if(result <=0)
        return null;
    else
        return result[0];
}

