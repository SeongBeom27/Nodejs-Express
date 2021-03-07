// express도 모듈이므로 아래와 같이 불러온다.
const express = require('express')
const app = express()
const port = 3000
const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');
const template = require('./lib/template.js');
const path = require('path');
const sanitizeHtml = require('sanitize-html');
var bodyParser = require('body-parser');
var compression = require('compression');
var helmet = require('helmet');
var db = require('./lib/db');
var topic = require('./lib/topic');
var author = require('./lib/author');
//Get method : Routing

// public 디렉토리 안에서 static 파일을 찾겠다.
// 정적인 파일을 사용하려면 정적인 파일을 사용하는 디렉토리를 아래와 같이 지정해야 한다.
app.use(express.static('public'));
// Post 데이터를 처리해주는 미들웨어
app.use(bodyParser.urlencoded({ extended: false }));
// 압축 
app.use(compression());
// Security 
app.use(helmet());

// middle ware 함수는 반드시 req, res, ... (변수 or 함수들)
// get 방식으로 들어오는 요청의 모든 요청에 대하여 req.list 라는 변수를 만드는 것이다.
app.get('*', function(req, res, next) {
    fs.readdir('./data', function(error, filelist) {
        // req 객체에 list 라는 키 값을 세팅하는 코드
        req.list = filelist;
        // next 에는 그다음에 실행되어야할 미들 웨어가 담겨있다. 즉, 미들웨어가 실행이 된다.
        next();
    });
});

// -> 길을 따라 갈 때 적당한 곳으로 가게 방향을 잡아주는 역할
app.get('/', (req, res) => {
    topic.home(res);
})
app.get('/topic/:pageId', function(req, res, next) {
    topic.page(req, res, req.params.pageId);
});

app.get('/create', function(req, res) {
    topic.create(req, res);
});
// post 방식으로 데이터 받는 경우
app.post('/create_process', function(req, res) {
    topic.create_process(req, res);
});

app.get('/update', function(req, res) {
    var _url = req.url;
    var queryData = url.parse(_url, true).query;

    var filteredId = path.parse(queryData.id).base;
    fs.readFile(`data/${filteredId}`, 'utf8', function(err, description) {
        var title = queryData.id;
        var list = template.list(req.list);
        var html = template.HTML(title, list,
            `
            <form action="/update_process" method="post">
              <input type="hidden" name="id" value="${title}">
              <p><input type="text" name="title" placeholder="title" value="${title}"></p>
              <p>
                <textarea name="description" placeholder="description">${description}</textarea>
              </p>
              <p>
                <input type="submit">
              </p>
            </form>
            `,
            `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
        );
        res.send(html);
    });

})

app.post('/update_process', function(req, res) {
    var post = req.body;
    var id = post.id;
    var title = post.title;
    var description = post.description;
    fs.rename(`data/${id}`, `data/${title}`, function(error) {
        fs.writeFile(`data/${title}`, description, 'utf8', function(err) {
            res.redirect(`/?id=${title}`);
        })
    });
});

app.post('/delete_process', function(req, res) {
    var post = req.body;
    var id = post.id;
    var filteredId = path.parse(id).base;
    fs.unlink(`data/${filteredId}`, function(error) {
        // express redirect 방법
        res.redirect('/');
    })
});

app.use(function(req, res, next) {
    res.status(404).send('Sorry cant find that!');
});

// 4개의 인자를 가진 미들 웨어는 Express에서 에러 핸들링을 윙한 middle ware라고 생각하자
app.use(function(err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})