var db = require('./db');
var template = require('./template');
var qs = require('querystring');
const sanitizeHtml = require('sanitize-html');
const { query } = require('./db');
const url = require('url');

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