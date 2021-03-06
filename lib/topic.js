var db = require('./db');
var template = require('./template');
var qs = require('querystring');

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

exports.page = function(response) {
    db.query(`SELECT * FROM topic`, function(error, topics) {
        if (error) {
            throw error;
        }
    });
}