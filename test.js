// 모듈 로드  
var http = require('http');    // 서버구동
var fs = require('fs');        // 파일로드
var url = require('url');      // url 객채 저장

var hostname = '192.168.0.122';

var app = http.createServer(function(request,response){
    var _url = request.url;
    var urlObject  = new URL('http://localhost:3000' + _url); 
    var pathname = urlObject.pathname;                   
    var serach = urlObject.search;
    var title = urlObject .searchParams.get('id');          

   // console.log(_url);       // 전체 url : 포트 넘버 다음부터 전체
   // console.log(urlObject);  // url 객채
   // console.log(pathname);   // 서버 url('/') 
   // console.log(serach);     // 쿼리스트링 (?id=HTML)
   // console.log(title);      // HTML

    
    if(pathname === '/'){
          var template = `
          <!doctype html>
          <html>
          <head>
            <title>WEB1 - WELCOME</title>
            <meta charset="utf-8">
          </head>
          <body>
            <h1><a href="/">WEB</a></h1>
            <ul>
              <li><a href="/?id=HTML">HTML</a></li>
              <li><a href="/?id=CSS">CSS</a></li>
              <li><a href="/?id=JavaScript">JavaScript</a></li>
            </ul>
            <h2>WELCOME</h2>
          </body>
          </html>
          `;

          // 파일 로드 
          fs.readFile(`data/${title}`, 'utf8', function(err, description){
            if(title!=null){
              template = `
              <!doctype html>
              <html>
              <head>
                <title>WEB1 - ${title}</title>
                <meta charset="utf-8">
              </head>
              <body>
                <h1><a href="/">WEB</a></h1>
                <ul>
                  <li><a href="/?id=HTML">HTML</a></li>
                  <li><a href="/?id=CSS">CSS</a></li>
                  <li><a href="/?id=JavaScript">JavaScript</a></li>
                </ul>
                <h2>${title}</h2>
                <p>${description}</p>
              </body>
              </html>
              `;
            }
              
            response.writeHead(200);
            response.end(template);  
            // response.end("Hello World");                      // text 로드
            // response.end(fs.readFileSync(__dirname + _url));  // 다음의 view파일 로드
        });
    }
    else {
      response.writeHead(404);
      response.end('not found');  
    }
});
app.listen(3000); 
// app.listen(3000, hostname); 