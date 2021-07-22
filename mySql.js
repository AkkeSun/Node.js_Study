var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'system',
  database : 'sun'
});
connection.connect();
  
connection.query('SELECT * FROM test1', (error, result) => {
    if (error) {
        console.log(error);
    }
    console.log(result); 
    for(i=0; i<result.length; i++){
        console.log((i+1)+"번째 : " + result[i].t_name);
    }

});
  
connection.end();
