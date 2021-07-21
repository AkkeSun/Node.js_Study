var express = require('express');
var app = express();
var port = 3000;

// 정적파일 사용 (괄호:디렉토리명)
app.use(express.static('img'));

app.get('/', (req, res) => {
  res.send('Hello World!')
});
app.get('/login', (req, res) => {
  res.send('Login Place!')
});
app.get('/test', (req, res) => {
  res.send('<img src="/Img1.jpg"></img>'); // 폴더 지정 안해주고 그냥 파일명 써주면 됨
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});