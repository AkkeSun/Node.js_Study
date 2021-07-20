// 모듈 로드  
var http = require('http');      // 서버구동
var fs = require('fs');          // 파일로드
var url = require('url');        // url 객채 저장
var qs = require('querystring'); // 쿼리스트링 입력값 받기 

var hostname = '192.168.0.122';


function HtmlData(title, list, body){
  return `
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    ${body}
  </body>
  </html>
  `;
}

function templateList(filelist){
  var list = '<ul>';
  var i = 0;
  while(i < filelist.length){
    list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    i = i + 1;
  }
  list = list+'</ul>';
  return list;
}

var app = http.createServer(function(request,response){
    var _url = request.url;
    var urlObject  = new URL('http://localhost:3000' + _url); 
    var pathname = urlObject.pathname;                   
    var title = urlObject.searchParams.get('id');          

   // console.log(_url);       // 전체 url : 포트 넘버 다음부터 전체
   // console.log(urlObject);  // url 객채
   // console.log(pathname);   // 서버 url('/') 
   // console.log(title);      // HTML
   
  if(pathname === '/'){ 
    if(title == undefined){
      // 파일목록 로드 (response까지 감싼다)
      fs.readdir('./data', function(err, filelist){
        var list = templateList(filelist);
        var body = "<a href='/write'>write</a><br>"; 
            body +="<h2>node.js</h2>";
        var template = HtmlData('welcome', list, body);
        response.writeHead(200);
        response.end(template);
      })
    }   
    else{
      fs.readdir('./data', function(err, filelist){
        // 데이타로드
        fs.readFile(`./data/${title}`, 'utf-8', function(err, description){
          var list = templateList(filelist);
          var body =  "<a href='/write'>write</a><br>"; 
              body += `<a href=/update?id=${title}>update</a>`;
              body += `<h2>${title}</h2>${description}`;

          var template = HtmlData(title, list, body);
          response.writeHead(200);
          response.end(template);
        });
      });
    }
  }
  else if(pathname === '/write'){
    fs.readdir('./data', function(err, filelist){
      var list = templateList(filelist);
      var description = `
      <form action="/process_create" method="post">
        <input type="text" name="title" placeholder="title">
        <br><br>
        <textarea name="description" placeholder="description"></textarea>
        <input type="submit">
      </form>
      `;
      var template = HtmlData('write', list, description);
      response.writeHead(200);
      response.end(template);
    });
  }
  else if(pathname === '/process_create'){
      var body = '';
      //post 입력 값 받기 
      request.on('data', function(data){
        body += data;
      });
      // 입력받은 후 호출되는 함수 (name 값)
      request.on('end', function(){
        var post = qs.parse(body);
        var title = post.title;
        var description = post.description;

        // 파일 만들기 (파일위치와 이름, 내용)
        fs.writeFile(`data/${title}`, description, 'utf8', function(err){
          // 리다이렉션
          response.writeHead(302, {Location: `/?id=${title}`});
          response.end();
        })
      });
  }
  else if(pathname === '/update'){
    console.log("---------------------");
    fs.readdir('./data', function(error, filelist){
      fs.readFile(`./data/${title}`, 'utf-8', function(error, data){
        var description = `
        <form action="/update_create" method="post">
          <input type="hidden" name="oldTitle" value=${title}>
          <input type="text" name="newTitle" value=${title}>
          <br><br>
          <textarea name="description" >${data}</textarea>
          <input type="submit">
        </form>
        `;
        var list = templateList(filelist);
        var template = HtmlData(title, "list", description);
        response.writeHead(200);
        response.end(template);
      })
    });
  }
  else if (pathname === '/update_create'){
      var body = '';
      request.on('data', function(data){
        body += data;
      });
      // 입력받은 후 호출되는 함수 (name 값)
      request.on('end', function(){
        var post = qs.parse(body);
        var oldTitle = post.oldTitle;
        var newTitle = post.newTitle;
        var description = post.description;

        // 파일 수정 : 이거 302 왜 안갈까...?
        fs.rename(`data/${oldTitle}`, `data/${newTitle}`, function(error){
          fs.writeFile(`data/${newTitle}`, description, 'utf8', function(err){
            response.writeHead(302, {Location: `/?id=${newTitle}`});
            response.end();
          })
        });
      });
  }
  else {
    response.writeHead(404);
    response.end('not found');  
  }
});
app.listen(3000); 
// app.listen(3000, hostname);
// response.end(fs.readFileSync(__dirname + url));
