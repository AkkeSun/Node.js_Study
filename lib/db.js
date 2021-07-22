var mysql = require('mysql');         
var db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'system',
    database : 'sun'
});
db.connect();
module.exports = db;