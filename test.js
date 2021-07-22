// 모듈 로드  
var http = require('http');                  // 서버구동
var page = require('./lib/page');             

// 포트, 호스트 설정
var hostname = '192.168.0.122';
var port = 3000;

var app = http.createServer((request,response) => {
    var _url = request.url; // 전체 url : 포트 넘버 다음부터 전체
    var urlObject  = new URL('http://localhost:3000' + _url); // url 객채
    var pathname = urlObject.pathname; // 서버 url('/')         
    var title = urlObject.searchParams.get('id'); //quarystring value    

  if(pathname === '/'){ 
    if(title == undefined)
      page.home(request, response);
    else
      page.content(request, response, title);
  }
  else if(pathname === '/write'){
    page.write(request, response);
  }
  else if(pathname === '/process_create'){
    page.process_create(request, response);
  }
  else if(pathname === '/update'){
    page.update(request, response, title);
  }
  else if (pathname === '/update_create'){
    page.update_create(request,response);
  }
  else if (pathname === '/delete'){
    page.delete(request, response, title);
  }
  else {
    response.writeHead(404);
    response.end('not found');  
  }
});
app.listen(port); 
// app.listen(port, hostname, () => {console.log(`Server running at http//${hostname}:${port}/`)});
// response.end(fs.readFileSync(__dirname + url));