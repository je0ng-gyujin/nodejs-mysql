let mysql      = require('mysql');
let connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'nodejs',
  password : 'awdr4689',
  database : 'opentutorials'
});
 
connection.connect();
 
connection.query('SELECT * FROM topic', function (error, results, fields) {
    if (error) {
        console.log(error);
    }
  console.log(results);
});
 
connection.end();