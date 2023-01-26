const { pool } = require("../data/connection");


exports.save = async (name ) => {
  const query = `INSERT INTO calendar (calendar_name ) values (?)`;
  return await pool(query, [name]);
};
exports.findById = async (id) => {
  const query = `SELECT * FROM calendar WHERE calendar_id = ?`;
  let founded = await pool(query, [id]);
  return founded.length == 0 ? null : founded[0];
};
exports.findAllById = (idSet) => {
  let result = [];
  for (let id of idSet) {
    result.push(calendars.find((calendar) => calendar.id == id));
  }
  return result;
};

exports.findByUserId = async (calendarId, userId) => {
  const query = `SELECT
     calendar_id,calendar_name,created_at,user_conn_id
     FROM calendar 
    INNER JOIN calendar_user_connection as connection
    ON connection.calendar_conn_id = calendar.calendar_id
    WHERE connection.user_conn_id = ?`;
  let founded = await pool(query, [calendarId, userId]);
  return founded.length == 0 ? null : founded;
};
exports.remove = async (id) => {
  const query = `DELETE FROM calendar WHERE calendar_id=?`;
  await pool(query, [id]);
};

exports.connect = async (calendarId, userId) => {
  const query = `INSERT INTO calendar_user_connection (calendar_conn_id, user_conn_id)
    values(?,?)`;
  return await pool(query, [calendarId, userId]);
};
exports.disconnectByCalendarId = async (calendarId) => {
  const query = `DELETE FROM calendar_user_connection WHERE calendar_conn_id=?`;
  return await pool(query, [calendarId]);
};
exports.disconnect = async (calendarId, userId)=>{
  const query = `DELETE FROM calendar_user_connection WHERE calendar_conn_id = ? AND user_conn_id = ?`;
  return await pool(query, [calendarId, userId]);
}

exports.findSharedUsers = async (calendarId) => {
  const query = `SELECT id from calendar_user_connection WHERE calendar_conn_id=?`;
  let result = await pool(query, [calendarId]);
  return result.length == 0 ? null : result;
};
