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
//Get method : Routing


// Post 데이터를 처리해주는 미들웨어
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
// -> 길을 따라 갈 때 적당한 곳으로 가게 방향을 잡아주는 역할
app.get('/', (req, res) => {
    fs.readdir('./data', function(error, filelist) {
        let title = 'Welcome';
        let description = 'Hello, Node.js';
        let list = template.list(filelist);
        let html = template.HTML(title, list,
            `<h2>${title}</h2>${description}`,
            `<a href="/create">create</a>`
        );
        res.send(html);
    });
})

app.get('/page/:pageId', function(req, res) {
    fs.readdir('./data', function(error, filelist) {
        var filteredId = path.parse(req.params.pageId).base;
        fs.readFile(`data/${filteredId}`, 'utf8', function(err, description) {
            var title = req.params.pageId;
            var sanitizedTitle = sanitizeHtml(title);
            var sanitizedDescription = sanitizeHtml(description, {
                allowedTags: ['h1']
            });
            var list = template.list(filelist);
            var html = template.HTML(sanitizedTitle, list,
                `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
                ` <a href="/create">create</a>
                <a href="/update?id=${sanitizedTitle}">update</a>
                <form action="/delete_process" method="post">
                  <input type="hidden" name="id" value="${sanitizedTitle}">
                  <input type="submit" value="delete">
                </form>`
            );
            res.send(html);
        });
    });
    // return이 있어도되고 없어도 된다.
});

app.get('/create', function(req, res) {
    fs.readdir('./data', function(error, filelist) {
        var title = 'WEB - create';
        var list = template.list(filelist);
        var html = template.HTML(title, list, `
              <form action="/create_process" method="post">
                <p><input type="text" name="title" placeholder="title"></p>
                <p>
                  <textarea name="description" placeholder="description"></textarea>
                </p>
                <p>
                  <input type="submit">
                </p>
              </form>
            `, '');
        res.send(html);
    });
});

// post 방식으로 데이터 받는 경우
app.post('/create_process', function(req, res) {
    /**
     *  아래 코드를 body parser 미들웨어 모듈로 가공해본다.
     */
    var post = req.body
    var title = post.title;
    var description = post.description;
    fs.writeFile(`data/${title}`, description, 'utf8', function(err) {
        res.writeHead(302, { Location: `/?id=${title}` });
        res.end();
    })
});

app.get('/update', function(req, res) {
    var _url = req.url;
    var queryData = url.parse(_url, true).query;
    fs.readdir('./data', function(error, filelist) {
        var filteredId = path.parse(queryData.id).base;
        fs.readFile(`data/${filteredId}`, 'utf8', function(err, description) {
            var title = queryData.id;
            var list = template.list(filelist);
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

/**
 * ==
 *  app.get('/', function(req, res){
 *    return res.send('Hello World!!') 
 *  })
 */

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})