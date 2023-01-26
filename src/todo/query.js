const { pool } = require("../data/connection");

let todos = [];
let sequence = 0;

exports.save = async (title, created_at, calendarId) => {
  const query = `INSERT INTO todo (title, created_at, calendar_id) values (?,?,?)`;
  return await pool(query, [title,created_at, calendarId]);
};
exports.findById = async (id) => {
  const query = `SELECT * FROM todo WHERE todo_id=?`;
  let founded = await pool(query, [id]);
  return founded.length == 0 ? null : founded[0];
};
exports.findByCalendarId = async (calendarId) => {
  const query = `SELECT * FROM todo WHERE calendar_id=?`;
  let founded = await pool(query, [calendarId]);
  return founded.length == 0 ? null : founded;
};
exports.findAllByUserId = async (userId) => {
  const query = `SELECT
     todo_id, title, isComplete, calendar_id, created_at, user_conn_id
     FROM todo INNER JOIN calendar_user_connection ON calendar_id = calendar_conn_id
    WHERE user_conn_id=?`;
  let founded = await pool(query, [userId]);
  return founded.length == 0 ? null : founded;
};
exports.remove = async (id) => {
  const query = `DELETE FROM todo WHERE todo_id = ?`;
  return await pool(query, [id]);
};
exports.update = async (id, result) => {
  const query = `UPDATE todo SET title = ?, isComplete=? WHERE todo_id = ?`;
  return await pool(query, [result.title, result.isComplete, id]);
};
