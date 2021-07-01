var db = require('../lib/db')
var express = require('express')
var router = express.Router()
var path = require('path')
var fs = require('fs')
var sanitizeHtml = require('sanitize-html')
var template = require('../lib/template.js')
const { request } = require('express')
const { report } = require('process')

exports.login = function (req, res) {
  db.query(`SELECT * FROM topic`, function (error, topics) {
    var title = 'Welcome'
    var description = 'Hello, Node.js'
    var list = template.list(topics)
    var html = template.HTML(
      title,
      list,
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
              `,
      req,
      res
    )
    res.send(html)
  })
}

exports.logout = function (req, res) {
  req.logout()
  req.session.save(function () {
    res.redirect('/')
  })
}

exports.register = function (req, res) {
  db.query(`SELECT * FROM topic`, function (error, topics) {
    var title = 'Welcome'
    var description = 'Hello, Node.js'
    var list = template.list(topics)
    var html = template.HTML(
      title,
      list,
      `                  
              <form action="/auth/register_process" method="post">
                  <p><input type="text" name="email" placeholder="email" value="egoing7777@gmail.com"></p>
                  <p><input type="password" name="pwd1" placeholder="password" value="111111"></p>
                  <p><input type="password" name="pwd2" placeholder="password" value="111111"></p>
                  <p><input type="text" name="displayName" placeholder="display name"></p>
                  <p><input type="submit" value="register"></p>
               </form>
            `,
      `
              <p id="ctrl">
                  <p><a href="/create">Create content</a></p>            
                  <a href="/author">Author Information</a>
              </p>
              `,
      req,
      res
    )
    res.send(html)
  })
}

exports.register_process = function (req, res) {
  // express에서 제공해준는 req.body <- post data를 간단하게 parsing 해올 수 있다.
  var post = req.body
  db.query(
    `INSERT INTO topic (email, pwd, name) VALUES(?, ?, ?);`,
    [post.email, post.pwd2, post.displayName],
    function (error, result) {
      // dbquery function의 result 객체는 insertId라는 key를 가지고 있다.
      // res.writeHead(302, { Location: `/topic/${result.insertId}` });
      // res.end();
      res.redirect(`/`)
    }
  )
}
