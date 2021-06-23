// 아이디와 비밀번호를 암호화하는 미들웨어를 찾아서 적용시키기

module.exports = {
  isOwner: function (request, response) {
    if (request.user) {
      console.log('User right : ', request.user)
      return true
    } else {
      console.log('Not user : ', request.user)
      return false
    }
  },
  statusUI: function (request, response) {
    var authStatusUI = `<a href="/auth/login">login</a>`
    if (this.isOwner(request, response)) {
      authStatusUI = `${request.user.nickname} | <a href="/auth/logout">logout</a>`
    }
    return authStatusUI
  },
}
