var oracledb = require('oracledb');
var config = {
    user: "sun",
    password: "sun",
    connectString: "localhost:1521/xe"
}

oracledb.getConnection(config, (err, conn) =>{
    todoWork(err, conn);
});

function todoWork(err, connection) {
    if (err) {
        console.error(err.message);
        return;
    }
    connection.execute("select * from TEST", function (err, result) {
        if (err) {
            console.error(err.message);
            doRelease(connection);
            return;
        }
        console.log(result.rows);  // value     
        doRelease(connection);
    });
}    

// db 종료
function doRelease(connection) {
    connection.release(function (err) {
        if (err) {
            console.error(err.message);
        }
    });
}