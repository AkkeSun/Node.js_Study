// 모듈 로드  
var http = require('http');                  // 서버구동
var fs = require('fs');                      // 파일로드
var qs = require('querystring');             // 쿼리스트링 입력값 받기 
var sanitizeHtml = require('sanitize-html'); // xss 필터
var template = require('./lib/template');    // 직접 만든 모듈

// 포트, 호스트 설정
var hostname = '192.168.0.122';
var port = 3000;

var app = http.createServer((request,response) => {
    var _url = request.url; // 전체 url : 포트 넘버 다음부터 전체
    var urlObject  = new URL('http://localhost:3000' + _url); // url 객채
    var pathname = urlObject.pathname; // 서버 url('/')         
    var title = urlObject.searchParams.get('id'); //quarystring value    

  if(pathname === '/'){ 
    if(title == undefined){
      // 파일목록 로드 (response까지 감싼다)
      fs.readdir('./data', (err, filelist) => {
        var list = template.list(filelist);
        var body = "<a href='/write'>write</a><br>"; 
            body +="<h2>node.js</h2>";
        var html = template.HTML('welcome', list, body);
        response.writeHead(200);
        response.end(html);
      })
    }   
    else{
      fs.readdir('./data', (err, filelist) => {
        // 데이타로드
        fs.readFile(`./data/${title}`, 'utf-8', (err, description) => {
          var list = template.list(filelist);
          var sanitizeTitle = sanitizeHtml(title, {allowedTags:[]});
          var sanitizedDescription = sanitizeHtml(description, {allowedTags:[]});
          var body =  "<a href='/write'>write</a><br>"; 
              body += `<a href=/update?id=${sanitizeTitle}>update</a><br>`;
              body += `<a href=/delete?id=${sanitizeTitle}>delete</a>`;
              body += `<h2>${sanitizeTitle}</h2>${sanitizedDescription}`;
          var html = template.HTML(sanitizeTitle, list, body);
          response.writeHead(200);
          response.end(html);
        });
      });
    }
  }
  else if(pathname === '/write'){
    fs.readdir('./data', (err, filelist) => {
      var list = template.list(filelist);
      var description = `
      <form action="/process_create" method="post">
        <input type="text" name="title" placeholder="title">
        <br><br>
        <textarea name="description" placeholder="description"></textarea>
        <input type="submit">
      </form>
      `;
      var html = template.HTML('write', list, description);
      response.writeHead(200);
      response.end(html);
    });
  }
  else if(pathname === '/process_create'){
      var body = '';
      //post 입력 값 받기 
      request.on('data', (data) => {
        body += data;
      });
      // 입력받은 후 호출되는 함수 (name 값)
      request.on('end', () => {
        var post = qs.parse(body);
        var title = post.title;
        var description = post.description;

        // 파일 만들기 
        fs.writeFile(`data/${title}`, description, 'utf8', function(err){
          // 리다이렉션
          response.writeHead(302, {Location: encodeURI(`/?id=${title}`)});
          response.end();
        })
      });
  }
  else if(pathname === '/update'){
    fs.readdir('./data', (error, filelist) => {
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
        var list = template.list(filelist);
        var html = template.HTML(title, list, description);
        response.writeHead(200);
        response.end(html);
      })
    });
  }
  else if (pathname === '/update_create'){
      var body = '';
      request.on('data', (data) => {
        body += data;
      });
      request.on('end', () => {
        var post = qs.parse(body);
        var oldTitle = post.oldTitle;
        var newTitle = post.newTitle;
        var description = post.description;

        fs.rename(`data/${oldTitle}`, `data/${newTitle}`, function(error){
          fs.writeFile(`data/${newTitle}`, description, 'utf8', function(err){
            response.writeHead(302, {Location: encodeURI(`/?id=${newTitle}`)});
            response.end();
          })
        });
      });
  }
  else if (pathname === '/delete'){
      fs.unlink(`data/${title}`, (error) => {
        response.writeHead(302, {Location: `/`});
        response.end();
      });
  }
  else {
    response.writeHead(404);
    response.end('not found');  
  }
});
app.listen(port); 
// app.listen(port, hostname, () => {console.log(`Server running at http//${hostname}:${port}/`)});
// response.end(fs.readFileSync(__dirname + url));
