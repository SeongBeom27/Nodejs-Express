const express = require('express')
const router = express.Router()
var topic = require('../lib/topic')

// -> 길을 따라 갈 때 적당한 곳으로 가게 방향을 잡아주는 역할
router.get('/', (req, res) => {
  topic.home(res)
})

module.exports = router
