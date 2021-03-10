var template = require('./template.js');
var db = require('./db');
var qs = require('querystring');
var url = require('url');
const { request } = require('http');

exports.home = function(req, res) {
    db.query(`SELECT * FROM topic`, function(error, topics) {
        db.query(`SELECT * FROM author`, function(error2, authors) {
            var title = 'author';
            var list = template.list(topics);
            var html = template.HTML(title, list,
                `
                ${template.authorTable(authors)}
                <style>
                    table{
                        border-collapse: collapse;
                    }
                    td{
                        border:1px solid black;
                    }
                </style>
                <form action="/author/create_process" method="post">
                <p>
                    <input type="text" name="name" placeholder="name">
                </p>
                <p>
                <textarea name="profile" placeholder="description"></textarea>
                </p>
                <p>
                <input type="submit" value="Author create">
                </p>
                
                </p>
                </form>
                `,
                ``
            );
            res.send(html);
        });
    });
}