const { Router } = require('express')
const router = Router()

const lessonsController = require('./api/lessons/controller')
const videosController = require('./api/videos/controller')
const logsController = require('./api/logs/controller')

router.get('/api/lessons/', lessonsController.index)
router.get('/api/lessons/:lessonSlug', lessonsController.show)
router.get('/api/lessons/:lessonSlug/:videoOrder', lessonsController.video)

router.get('/api/videos/:videoId', videosController.show)

router.post('/api/logs/interaction', logsController.interaction)

module.exports = router
