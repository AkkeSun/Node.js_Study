const template = require('./template');    
const db = require('./db');  
const sanitizeHtml = require('sanitize-html'); // xss 필터
const qs = require('querystring');            


exports.home = (request, response) => {
    db.query('SELECT title FROM test2', (error, result) => {
        if (error) {
          throw error;
        }
        let r = [];
        for(i=0; i<result.length; i++)
          r.push(result[i].title);
        
        var list = template.list(r);
        var body = "<a href='/write'>write</a><br>"; 
            body +="<h2>node.js</h2>";
        var html = template.HTML('welcome', list, body);
        response.writeHead(200);
        response.end(html);
    });
}


exports.content = (request, response, title) => {
  var list = "";
  db.query('SELECT title FROM test2', (error, result) => {
    if (error) 
      throw error;

    let r = [];
    for(i=0; i<result.length; i++)
      r.push(result[i].title);
    list = template.list(r);
  });

  db.query('SELECT * FROM test2 WHERE title=?', [title], (error, result) => {
    if (error) 
      throw error;
    
    var sanitizeTitle = sanitizeHtml(result[0].title, {allowedTags:[]});
    var sanitizedDescription = sanitizeHtml(result[0].content, {allowedTags:[]});
    var body =  "<a href='/write'>write</a><br>"; 
        body += `<a href=/update?id=${sanitizeTitle}>update</a><br>`;
        body += `<a href=/delete?id=${sanitizeTitle}>delete</a>`;
        body += `<h2>${sanitizeTitle}</h2>${sanitizedDescription}`;
    var html = template.HTML(sanitizeTitle, list, body);
    response.writeHead(200);
    response.end(html);
  })
}



exports.write = (request, response) => {
  db.query('SELECT title FROM test2', (error, result) => {
    if (error) 
      throw error;
    let r = [];
    for(i=0; i<result.length; i++)
      r.push(result[i].title);
    list = template.list(r);
    var description = `
    <form action="/process_create" method="post">
      <input type="text" name="title" placeholder="title">
      <br><br>
      <textarea name="content" placeholder="content"></textarea>
      <input type="submit">
    </form>
    `;
    var html = template.HTML('write', list, description);
    response.writeHead(200);
    response.end(html);
  })
}



exports.process_create = (request, response) => {
  var body = '';
  //post 입력 값 받기 
  request.on('data', (data) => {
    body += data;
  });
  // 입력받은 후 호출되는 함수 (name 값)
  request.on('end', () => {
    var post = qs.parse(body);
    var title = post.title;
    var content = post.content;

    // DB저장
    db.query('INSERT INTO TEST2(title, content) VALUES(?, ?)', 
            [title, content], (error, result) => {
        if (error) {
          throw error;
        }
        // 리다이렉션
        response.writeHead(302, {Location: encodeURI(`/?id=${title}`)});
        response.end();
    });
  })
}


exports.update = (request, response, title) => {
  var list = "";
  db.query('SELECT title FROM test2', (error, result) => {
    if (error) 
      throw error;
    
    let r = [];
    for(i=0; i<result.length; i++)
      r.push(result[i].title);
    list = template.list(r);
  });

  db.query('SELECT content FROM test2 WHERE title=?', 
          [title], (error, result) => {

    if (error) 
      throw error;
      
    var description = `
    <form action="/update_create" method="post">
      <input type="text" name="title" value=${title} readonly>
      <br><br>
      <textarea name="content" >${result[0].content}</textarea>
      <input type="submit">
    </form>
    `;
    var html = template.HTML(title, list, description);
    response.writeHead(200);
    response.end(html);
  });
}




exports.update_create = (request, response) => {
  var body = '';
  request.on('data', (data) => {
    body += data;
  });
  request.on('end', () => {
    var post = qs.parse(body);
    var title = post.title;
    var newContent = post.content;
    db.query('UPDATE test2 SET content=? WHERE title=?', 
            [newContent, title], (error) =>{
        if(error)
          throw error;

        response.writeHead(302, {Location: encodeURI(`/?id=${title}`)});
        response.end();  
    })
  });
}


exports.delete = (request, response, title) => {
  db.query('delete from test2 where title=?', [title], (error)=>{
    if(error)
      throw error;
    response.writeHead(302, {Location: `/`});
    response.end();
  })
}
