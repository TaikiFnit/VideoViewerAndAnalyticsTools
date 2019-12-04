const { Router } = require('express')
const router = Router()

const lessonsController = require('./api/lessons/controller')

router.get('/api/lessons/', lessonsController.index)
router.get('/api/lessons/:lesson_name', lessonsController.show)

module.exports = router
