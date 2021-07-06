const express = require('express')
const router = express.Router()
var auth = require('../lib/auth')
var passport = require('passport')
var db = require('../lib/db')
var template = require('../lib/template')
var auth = require('../lib/auth')
/**
 * @brief     form을 통해서 전송된 데이터를 다음 passport가 받아서 Local strategy로 처리한다.
 */
router.post(
  '/login_process',
  passport.authenticate('local', {
    // 로그인을 성공했을 때는 '/' 즉, 홈으로 보내고
    successRedirect: '/',
    // 실패했을 때는 다음과 같이 보낸다.
    failureRedirect: '/auth/login',
  })
)

router.get('/login', function (req, res) {
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
      auth.statusUI(req, res)
    )
    res.send(html)
  })
})

module.exports = router
