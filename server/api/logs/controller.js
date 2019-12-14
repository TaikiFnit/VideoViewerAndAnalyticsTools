const DatabaseMapper = require('../../database/mapper')
const Model = require('./model')

const model = new Model(new DatabaseMapper())

const interaction = (req, res) => {
  const { type, time, videoId, tempId } = req.body
  const userId = req.session.authUser ? req.session.authUser.userId : null

  model.storeInteractionLog(videoId, time, userId, tempId, type)

  res.send('ok')
}

const pageTransition = (req, res) => {
  const host = req.headers.host
  const userId = req.session.authUser ? req.session.authUser.userId : null
  const { path, isSsr, tempId } = req.body

  model.storePageTransitionLog(path, isSsr, tempId, userId, host)

  res.send('ok')
}

const getLearningLog = async (req, res) => {
  const videoId = req.params.videoId
  const userId = req.session.authUser ? req.session.authUser.userId : null

  const log = await model.findLearningLog(userId, videoId)

  res.send(log)
}

const storeLearningLog = (req, res) => {
  const { videoId, status } = req.body

  const userId = req.session.authUser ? req.session.authUser.userId : null
  model.storeLearningLog(userId, videoId, status)

  res.send('ok')
}

const storeFeedback = (req, res) => {
  const { feedback, videoId, tempId } = req.body

  const userId = req.session.authUser ? req.session.authUser.userId : null
  model.storeFeedback(feedback, videoId, userId, tempId)

  res.send('ok')
}

module.exports = {
  interaction,
  pageTransition,
  getLearningLog,
  storeLearningLog,
  storeFeedback
}
