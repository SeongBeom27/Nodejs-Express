module.exports = function (app) {
  // passport는 session을 내부적으로 사용하기 때문에 session 다음에 호출되어야 한다.
  var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy

  app.use(passport.initialize())
  app.use(passport.session())

  var authData = {
    email: 'egoing777@gmail.com',
    password: '111111',
    nickname: 'egoing',
  }
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
  return passport
}

// passport 라는 모듈 자체가 함수가 된다.
