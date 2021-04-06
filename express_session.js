var express = require('express')
var parseurl = require('parseurl')
var session = require('express-session')

var app = express()

app.use(session({
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
    saveUninitialized: true
}))

app.get('/', function(req, res, next) {
    res.send('Hello session');
})

app.listen(3000, function() {
    console.log('3000!')
});