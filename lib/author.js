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

exports.create_process = function(req, res) {
    var post = req.body;
    db.query(`INSERT INTO author (name, profile) VALUES(?, ?);`, [post.name, post.profile], function(error, result) {
        if (error) {
            throw error;
        }
        res.redirect('/author');
    });
}

exports.update = function(req, res) {
    // 콜백이 여러번 중첩되는 것을 콜백 헬 이라고한다.

    /**
     *  이러한 현상들을 막기 위한 테크닉들을 공부해보자
     *  promise, ... etc.
     */
    db.query(`SELECT * FROM topic`, function(error, topics) {
        db.query(`SELECT * FROM author`, function(error2, authors) {
            var _url = req.url;
            var queryData = url.parse(_url, true).query;
            db.query(`SELECT * FROM author WHERE id=?`, [queryData.id], function(error3, author) {
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
                <form action="/author/update_process" method="post">
                    <p>
                        <input type="hidden" name="id" value="${queryData.id}">
                    </p>
                    <p>
                        <input type="text" name="name" value="${author[0].name}" placeholder="name">
                    </p>
                    <p>
                        <textarea name="profile" placeholder="description">${author[0].profile}</textarea>
                    </p>
                    <p>
                        <input type="submit" value="update">
                    </p>
                </form>
                `,
                    ``
                );
                res.send(html);
            });

        });
    });
}

exports.update_process = function(req, res) {
    var post = req.body;
    db.query(`update author set name=?, profile=? WHERE id=?;`, [post.name, post.profile, post.id], function(error, result) {
        if (error) {
            throw error;
        }
        res.redirect('/author');
    });
}

exports.delete_process = function(req, res) {

}