// db.js
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'xxxxxx',
  database: 'users'
});


module.exports = pool.promise();