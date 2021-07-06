const express = require('express')
const router = express.Router()
var author = require('../lib/author')

router.get(`/`, function (req, res) {
  author.home(req, res)
})

router.post('/create_process', function (req, res) {
  author.create_process(req, res)
})

router.get('/update', function (req, res) {
  author.update(req, res)
})

router.post('/update_process', function (req, res) {
  author.update_process(req, res)
})

router.post('/delete_process', function (req, res) {
  author.delete_process(req, res)
})

module.exports = router
