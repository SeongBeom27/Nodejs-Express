var db = require('./db');
var template = require('./template');
var qs = require('querystring');
const sanitizeHtml = require('sanitize-html');
const { query } = require('./db');

exports.home = function(res) {
    db.query(`SELECT * FROM topic`, function(error, topics) {
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var list = template.list(topics);
        var html = template.HTML(title, list,
            `<h2>${title}</h2>${description}`,
            `<a href="/create">Create content</a>`
        );
        res.send(html);
    });
}

exports.page = function(req, res, _id) {
    db.query(`SELECT * FROM topic`, function(error, topics) {
        if (error) {
            throw error;
        }
        db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`, [_id], function(error2, topic) {
            if (error2) {
                throw error2;
            }
            var title = topic[0].title;
            var description = topic[0].description;
            var list = template.list(topics);
            var html = template.HTML(title, list,
                `<h2>${title}</h2>${description}`,
                ` <a href="/create">create</a>
                        <a href="/update?id=${_id}">update</a>
                        <form action="/delete_process" method="post">
                          <input type="hidden" name="id" value="${_id}">
                          <input type="submit" value="delete">
                        </form>`
            );
            res.send(html);
        });
    });
}

exports.create = function(req, res) {
    db.query(`SELECT * FROM topic`, function(error, topics) {
        if (error) {
            throw error;
        }
        var title = 'WEB - create';
        var list = template.list(topics);
        var html = template.HTML(title, list, `
                    <form action="/create_process" method="post">
                        <p>
                            <input type="text" name="title" placeholder="title"></p>
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
}

exports.create_process = function(req, res) {
    var post = req.body;
    db.query(`INSERT INTO topic (title, description, created, author_id) VALUES(?, ?, NOW(), 1);`, [post.title, post.description], function(error, result) {
        // dbquery function의 result 객체는 insertId라는 key를 가지고 있다.
        res.writeHead(302, { Location: `/topic/${result.insertId}` });
        res.end();
    });
}