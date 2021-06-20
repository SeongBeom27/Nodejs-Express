// express도 모듈이므로 아래와 같이 불러온다.
const express = require('express')
const app = express()
const port = 3000
const http = require('http')
const fs = require('fs')
const url = require('url')
const qs = require('querystring')
const template = require('./lib/template.js')
const path = require('path')
const sanitizeHtml = require('sanitize-html')
var bodyParser = require('body-parser')
var compression = require('compression')
var helmet = require('helmet')
var db = require('./lib/db')
var topic = require('./lib/topic')
var author = require('./lib/author')
var auth = require('./routes/auth')

var session = require('express-session')
// 이후에 db, hash db에 저장하는 것으로 바꾸기
var FileStore = require('session-file-store')(session)
//Get method : Routing

// app.use는 사용자의 요청이 있을 때 마다 실행된다.

// public 디렉토리 안에서 static 파일을 찾겠다.
// 정적인 파일을 사용하려면 정적인 파일을 사용하는 디렉토리를 아래와 같이 지정해야 한다.
app.use(express.static('public'))
// Post 데이터를 처리해주는 미들웨어
app.use(bodyParser.urlencoded({ extended: false }))
// 압축
app.use(compression())
// Security
app.use(helmet())

/**
 * session 미들웨어
 * @brief   session 미들웨어가 request 객체의 property로 session 객체를 추가해준다.
 */
app.use(
  /**
   * secret : 반드시 포함되어야 할 option (실 서버에서는 변수 처리해서 올려야 함)
   * resave : session data라는 것이 바뀌기 전까지 session 저장소의 값을 저장할지 여부
   * saveUninitialzied : session이 필요하기 전까지는 session을 구동시킬지의 여부
   */
  session({
    secret: 'asadlfkj!@#!@#dfgasdg',
    resave: false,
    saveUninitialized: true,
    store: new FileStore(),
  })
)

var authData = {
  email: 'egoing777@gmail.com',
  password: '111111',
  nickname: 'egoing',
}

// passport는 session을 내부적으로 사용하기 때문에 session 다음에 호출되어야 한다.
var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy

app.use(passport.initialize())
app.use(passport.session())

// passport가 session 데이터를 처리하기 위해서는 serializeUser, deserializeUser가 필요하다.

/**
 * @brief       login이 성공했을 때 발생하는 콜백
 * @param user  로그인 성공한 auth 데이터
 */
passport.serializeUser(function (user, done) {
  console.log('serializeUser', user)
  // null 값과 구분자를 넘겨준다. , 우리는 임의로 이메일을 넘겨준다.
  // 세션 데이터에서 어떤 사용자인지 id를 email로 구분하겠다는 의미이다.
  // -> session 파일 : "passport":{"user":"egoing777@gmail.com"}}
  done(null, user.email) // 세션 데이터에 두번째 인자 (구분자) 추가를 해준다.

  // done(null, user.id)
})

/**
 * @brief     저장된 세션 데이터를 기준으로 필요한 정보를 조회할 때 필요하다. 현재 사이트에 존재하는 사용자가 refresh할 때마다 호출된다.
 */
passport.deserializeUser(function (id, done) {
  // 세션에서 사용자의 id를 기준으로 어떤 사용자인지 찾아서 user(auth) data를 가져온다.
  console.log('deserializeUser', id)
  // deserializeUser 내부 done의 두번째 인자는 request 객체에 user porperty로 추가가 된다.
  done(null, authData)
})

/**
 * @brief     아이디, 비밀번호는 어떻게 비교 후 반환하는 메소드
 */
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    function (username, password, done) {
      console.log('LocalStrategy', username, password)
      if (username === authData.email) {
        if (password === authData.password) {
          return done(null, authData)
        } else {
          return done(null, false, { message: 'Incorrect password.' })
        }
      } else {
        return done(null, false, { message: 'Incorrect Email.' })
      }
    }
  )
)
/**
 * @brief     form을 통해서 전송된 데이터를 다음 passport가 받아서 local strategy로 처리한다.
 */
app.post(
  '/auth/login_process',
  passport.authenticate('local', {
    // 로그인을 성공했을 때는 '/' 즉, 홈으로 보내고
    successRedirect: '/',
    // 실패했을 때는 다음과 같이 보낸다.
    failureRedirect: '/auth/login',
  })
)

// middle ware 함수는 반드시 req, res, ... (변수 or 함수들)
// get 방식으로 들어오는 요청의 모든 요청에 대하여 req.list 라는 변수를 만드는 것이다.
app.get('*', function (req, res, next) {
  fs.readdir('./data', function (error, filelist) {
    // req 객체에 list 라는 키 값을 세팅하는 코드
    req.list = filelist
    // next 에는 그다음에 실행되어야할 미들 웨어가 담겨있다. 즉, 미들웨어가 실행이 된다.
    next()
  })
})

// -> 길을 따라 갈 때 적당한 곳으로 가게 방향을 잡아주는 역할
app.get('/', (req, res) => {
  topic.home(req, res)
})

/**
 * Topic 관련 Route
 */
// :pageId, pageID로 들어오는 값을 req의 params의 속성으로 추가시킨다
app.get('/topic/:pageId', function (req, res, next) {
  topic.page(req, res, req.params.pageId)
})

app.get('/topic/create', function (req, res) {
  topic.create(req, res)
})
// post 방식으로 데이터 받는 경우
app.post('/create_process', function (req, res) {
  topic.create_process(req, res)
})

app.get('/update', function (req, res) {
  topic.update(req, res)
})

app.post('/update_process', function (req, res) {
  topic.update_process(req, res)
})

app.post('/delete_process', function (req, res) {
  topic.delete_process(req, res)
})

/**
 * Author 관련 Route
 */

app.get(`/author`, function (req, res) {
  author.home(req, res)
})

app.post('/author/create_process', function (req, res) {
  author.create_process(req, res)
})

app.get('/author/update', function (req, res) {
  author.update(req, res)
})

app.post('/author/update_process', function (req, res) {
  author.update_process(req, res)
})

app.post('/author/delete_process', function (req, res) {
  author.delete_process(req, res)
})

app.get('/auth/login', function (req, res) {
  auth.login(req, res)
})

app.get('/auth/logout', function (req, res) {
  auth.logout(req, res)
})

/**
 * login form에서 전송한 데이터를 받기로했다.
 */
// app.post(
//   '/auth/login_process',
//   passport.authenticate('local', {
//     // 성공했을 때는 루트로
//     successRedirec: '/',
//     // 실패했으면 다시 재진입
//     failureRedirect: '/auth',
//   })
// )

// app.post('/auth/login_process', function (req, res) {
//   auth.login_process(req, res)
// })

// 예외 처리 부분
app.use(function (req, res, next) {
  res.status(404).send('Sorry cant find that!')
})

// 4개의 인자를 가진 미들 웨어는 Express에서 에러 핸들링을 윙한 middle ware라고 생각하자
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
