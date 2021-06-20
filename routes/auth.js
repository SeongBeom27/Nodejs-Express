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
  /**
   * session에서 직접 지워주는 로직을 사용하면 더 안전
   *
   * session.save : 현재 session의 상태를 저장하고 마무리
   */
  req.logout()
  req.session.save(function () {
    res.redirect('/')
  })
}
