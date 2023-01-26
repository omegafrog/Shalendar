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
exports.findByCalendarId = async(calendarId)=>{
	const query = `SELECT user_id, user_name FROM user INNER JOIN calendar_user_connection ON calendar_conn_id = ? WHERE user_conn_id = user.user_id`;
	return result = await pool(query, [calendarId]);
}

exports.findByUserId=async (id)=>{
    const query = `SELECT * FROM user WHERE user_id = ?`;
    let result = await pool(query, [id]);
    if(result <=0)
        return null;
    else
        return result[0];
}

exports.disconnect=async (userId)=>{
    const query = `DELETE FROM calendar_user_connection WHERE user_conn_id = ?`;
    return await pool(query, [userId]);
}
