require('dotenv').config();
const mysql = require('mysql2');

exports.connection = mysql.createPool(
    {
        host:process.env.DB_HOST,
        port:process.env.DB_PORT || 3306,
        database:process.env.DB_SCHEMA,
        user:process.env.DB_USERNAME,
        password:process.env.DB_PASSWORD,
        waitForConnections:true,
        connectionLimit:30,
        queueLimit:0
    }
);

exports.pool = (queryString, params)=>{
    return new Promise( (resolve, reject)=>{
        this.connection.query(queryString, params,(err, rows,fields)=>{
            (err)?reject(err):resolve(rows);
        })
    })
}