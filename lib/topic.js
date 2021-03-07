var db = require('./db');
var template = require('./template');
var qs = require('querystring');
const sanitizeHtml = require('sanitize-html');
const { query } = require('./db');

exports.home = function(response) {
    db.query(`SELECT * FROM topic`, function(error, topics) {
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var list = template.list(topics);
        var html = template.HTML(title, list,
            `<h2>${title}</h2>${description}`,
            `<a href="/create">Create content</a>`
        );
        response.send(html);
    });
}

exports.page = function(req, res, _id) {
    db.query(`SELECT * FROM topic`, function(error, topics) {
        if (error) {
            throw error;
        }
        console.log('QueryData id : ', _id);
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