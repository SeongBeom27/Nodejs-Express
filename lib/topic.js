var db = require('./db')
var template = require('./template')
var qs = require('querystring')
const sanitizeHtml = require('sanitize-html')
const { query } = require('./db')
const url = require('url')

exports.home = function (req, res) {
  db.query(`SELECT * FROM topic`, function (error, topics) {
    var title = 'Welcome'
    var description = 'Hello, Node.js'
    var list = template.list(topics)
    var html = template.HTML(
      title,
      list,
      `<h2>${title}</h2>${description}`,
      `
            <p id="ctrl">
                <p><a href="/topic/create">Create content</a></p>            
                <a href="/author">Author Information</a>
            </p>
            `,
      req,
      res
    )
    res.send(html)
  })
}

exports.page = function (req, res, _id) {
  db.query(`SELECT * FROM topic`, function (error, topics) {
    if (error) {
      throw error
    }
    db.query(
      `SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`,
      [_id],
      function (error2, topic) {
        if (error2) {
          throw error2
        }
        var title = topic[0].title
        var description = topic[0].description
        var author_name = topic[0].name
        var list = template.list(topics)
        var html = template.HTML(
          title,
          list,
          `<h2>${title}</h2>
                 <p>
                    ${description}
                 </p>
                 <p>
                    by ${author_name}
                </p>
                 `,
          `       
                <p id="ctrl">
                    <p><a href="/topic/create">Create content</a></p>
                    <a href="/update?id=${_id}">Update Content</a>
                </p>                
                <form action="/delete_process" method="post">
                    <input type="hidden" name="id" value="${_id}">
                    <input type="submit" value="delete">
                </form>`,
          req,
          res
        )
        res.send(html)
      }
    )
  })
}

exports.create = function (req, res) {
  db.query(`SELECT * FROM topic`, function (error, topics) {
    if (error) {
      throw error
    }
    db.query(`SELECT * FROM author`, function (error2, authors) {
      var title = 'WEB - create'
      var list = template.list(topics)
      var html = template.HTML(
        title,
        list,
        `
                        <form action="/create_process" method="post">
                            <p>
                                <input type="text" name="title" placeholder="title"></p>
                            <p>
                                <textarea name="description" placeholder="description"></textarea>
                            </p>
                            <p>
                                ${template.authorSelect(authors)}
                            </p>
                            <p>
                                <input type="submit">
                            </p>
                        </form>
                        `,
        '',
        req,
        res
      )
      res.send(html)
    })
  })
}

exports.create_process = function (req, res) {
  // express에서 제공해준는 req.body <- post data를 간단하게 parsing 해올 수 있다.
  var post = req.body
  db.query(
    `INSERT INTO topic (title, description, created, author_id) VALUES(?, ?, NOW(), ?);`,
    [post.title, post.description, post.author],
    function (error, result) {
      // dbquery function의 result 객체는 insertId라는 key를 가지고 있다.
      // res.writeHead(302, { Location: `/topic/${result.insertId}` });
      // res.end();
      res.redirect(`/topic/${result.insertId}`)
    }
  )
}

exports.update = function (req, res) {
  var _url = req.url
  var queryData = url.parse(_url, true).query
  db.query(`SELECT * FROM topic`, function (error, topics) {
    if (error) {
      throw error
    }
    db.query(
      `SELECT * FROM topic WHERE id=?`,
      [queryData.id],
      function (error2, topic) {
        if (error2) {
          throw error2
        }
        db.query(`SELECT * FROM author`, function (error3, authors) {
          if (error3) {
            throw error3
          }
          var title = 'Web - Update'
          var list = template.list(topics)
          var html = template.HTML(
            title,
            list,
            `
                    <form action="/update_process" method="post">
                      <input type="hidden" name="id" value="${topic[0].id}">
                      <p><input type="text" name="title" placeholder="title" value="${
                        topic[0].title
                      }"></p>
                      <p>
                        <textarea name="description" placeholder="description">${
                          topic[0].description
                        }</textarea>
                      </p>
                        <p>
                            ${template.authorSelect(authors)}
                        </p>
                        <p>
                            <input type="submit">
                        </p>
                    </form>
                    `,
            `<a href="/topic/create">create</a> 
                    <a href="/update?id=${topic[0].id}">update</a>
                    `,
            req,
            res
          )
          res.send(html)
        })
      }
    )
  })
}

exports.update_process = function (req, res) {
  var post = req.body
  db.query(
    `update topic set title=?, description=?, author_id=? WHERE id=?;`,
    [post.title, post.description, post.author, post.id],
    function (error, result) {
      // dbquery function의 result 객체는 insertId라는 key를 가지고 있다.
      res.redirect(`/topic/${post.id}`)
    }
  )
}

exports.delete_process = function (req, res) {
  var post = req.body
  db.query(`DELETE FROM topic WHERE id=?`, [post.id], function (error, result) {
    if (error) {
      throw error
    }
    res.redirect(`/`)
  })
}
