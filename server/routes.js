const { Router } = require('express')
const router = Router()

const lessonsController = require('./api/lessons/controller')

router.get('/api/lessons/', lessonsController.index)
router.get('/api/lessons/:lesson_id', lessonsController.show)

module.exports = router
