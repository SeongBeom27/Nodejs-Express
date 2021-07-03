const express = require('express')
const router = express.Router()
var topic = require('../lib/topic')
// -> 길을 따라 갈 때 적당한 곳으로 가게 방향을 잡아주는 역할

router.get('/create', function (req, res) {
  topic.create(req, res)
})

// post 방식으로 데이터 받는 경우
router.post('/create_process', function (req, res) {
  topic.create_process(req, res)
})

router.get('/update/:pageId', function (req, res) {
  topic.update(req, res, req.params.pageId)
})

router.post('/update_process', function (req, res) {
  topic.update_process(req, res)
})

router.post('/delete_process', function (req, res) {
  topic.delete_process(req, res)
})

/**
 * Topic 관련 Route
 */
// :pageId, pageID로 들어오는 값을 req의 params의 속성으로 추가시킨다
router.get('/:pageId', function (req, res, next) {
  topic.page(req, res, req.params.pageId)
})

module.exports = router
