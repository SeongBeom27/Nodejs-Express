var db = require('./db');
var template = require('./template');
var qs = require('querystring');
const sanitizeHtml = require('sanitize-html');
const { query } = require('./db');
const url = require('url');

// 아이디와 비밀번호를 암호화하는 미들웨어를 찾아서 적용시키기
var authData = {
    email: 'egoing777@gmail.com',
    password: '111111',
    nickname: 'egoing'
}

exports.login = function(req, res) {
    db.query(`SELECT * FROM topic`, function(error, topics) {
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var list = template.list(topics);
        var html = template.HTML(title, list,
            `                  
            <form action="/auth/login_process" method="post">
                <p><input type="text" name="email" placeholder="email"></p>
                <p><input type="password" name="password" placeholder="password"</p>
                <p><input type="submit" value="login"></p>
             </form>
          `,
            `
            <p id="ctrl">
                <p><a href="/create">Create content</a></p>            
                <a href="/author">Author Information</a>
            </p>
            `
        );
        res.send(html);
    });
}

exports.login_process = function(req, res) {
    var post = req.body;
    var email = post.email;
    var password = post.password;

    if (email === authData.email && password === authData.password) {
        // 인증 성공
        res.send('Welcome!');
    } else {
        res.send('Who??');
    }
    // DB에 사용자의 정보들을 암호화해서 넣어놓는 방법으로 다음에 구현하기
    // db.query(`update author set name=?, profile=? WHERE id=?;`, [post.name, post.profile, post.id], function(error, result) {
    //     if (error) {
    //         throw error;
    //     }
    //     res.redirect('/author');
    // });
}