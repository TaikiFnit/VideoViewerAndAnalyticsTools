const { Router } = require('express')
const router = Router()

const authController = require('./api/auth/controller')
const lessonsController = require('./api/lessons/controller')
const videosController = require('./api/videos/controller')
const logsController = require('./api/logs/controller')

router.post('/api/login', authController.login)
router.post('/api/logout', authController.logout)

router.get('/api/lessons/', lessonsController.index)
router.get('/api/lessons/:lessonSlug', lessonsController.show)
router.get('/api/lessons/:lessonSlug/:videoOrder', lessonsController.video)

router.get('/api/videos/:videoId', videosController.show)

router.post('/api/logs/interaction', logsController.interaction)
router.post('/api/logs/page_transition', logsController.pageTransition)
router.get('/api/logs/learning/:videoId', logsController.getLearningLog)
router.post('/api/logs/learning', logsController.storeLearningLog)
router.post('/api/logs/feedback', logsController.storeFeedback)

module.exports = router
