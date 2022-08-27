const mysql = require('mysql');

const db = mysql.createConnection({
  host     : 'localhost',
  user     : 'nodejs',
  password : '#jit120425',
  database : 'nodetutorials'
});
db.connect();

module.exports = db;