var template = require('./template')
var qs = require('querystring')
const sanitizeHtml = require('sanitize-html')
const { query } = require('./db')
const url = require('url')

// 아이디와 비밀번호를 암호화하는 미들웨어를 찾아서 적용시키기
var authData = {
  email: 'egoing777@gmail.com',
  password: '111111',
  nickname: 'egoing',
}

module.exports = {
  isOnwer: function (req, res) {
    if (req.user) {
      return true
    } else {
      return false
    }
  },
  statusUI: function (req, res) {
    var authStatusUI = `<a href="/auth/login">login</a>`
    if (this.isOnwer(req, res)) {
      authStatusUI = `${req.session.email} | <a href="/auth/logout">logout</a>`
    }
    return authStatusUI
  },
}
