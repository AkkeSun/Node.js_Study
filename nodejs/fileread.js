var fs = require('fs')
fs.readFile('nodejs/sample', 'utf-8', function(err, data){
    console.log(data);
})