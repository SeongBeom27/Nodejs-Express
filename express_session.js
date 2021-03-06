var express = require('express')
var parseurl = require('parseurl')
// Express Session 모듈을 설치
var session = require('express-session')
var FileStore = require('session-file-store')(session)
var app = express()
/**
 * app.use는 사용자의 요청이 있을 때마다 실행
 * 그리고 미들웨어인 session이 넘겨주는 객체에 따라서 동작한다.
 */
app.use(
  session({
    // required option
    // secret 으로 버전 관리시 따로 보안이 필요하다.
    secret: 'asadlfkj!@#!@#dfgasdg',
    /**
     * true     : 값이 바뀌건 안 바뀌건 계속 저장을 한다.
     * false    : session 저장소의 값을 저장하지 않는다.
     */
    resave: false,
    /**
     * true     : session이 store에 저장되기 전에 초기화 되지 않은 상태로 만들어서 저장한다.
     * false    : session이 store에 저장되기 전에 초기화 된 상태로 만들어서 저장한다.
     */
    saveUninitialized: true,
    /**
     * 사용자가 session 아이디를 전달하면
     * session store에서 아이디에 대응되는 적당한 파일에 데이터를 저장하고
     * request session 객체에 적당한 프로퍼티를 추가해준다.
     */
    store: new FileStore(), // FileStore 미들웨어 옵션 추가 가능
  })
)

app.get('/', function (req, res, next) {
  /**
   * session 미들웨어는 미들웨어가 req 객체의 property로 sesson이라는 객체를 추가해준다.
   */
  console.log(req.session)
  if (req.session.num === undefined) {
    req.session.num = 1
  } else {
    req.session.num = req.session.num + 1
  }
  // 사용자의 세션 데이터가 메모리에 저장되어서 서버가 껏다가 켜지면 전부 지워진다.
  // -> 이런 경우를 방지하고 싶을 때 Filestore를 이용해서 사용자의 정보를 저장한다.
  res.send(`Views : ${req.session.num}`)
})

app.listen(3000, function () {
  console.log('3000!')
})
