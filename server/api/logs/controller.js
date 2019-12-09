const DatabaseMapper = require('../../database/mapper')
const Model = require('./model')

const model = new Model(new DatabaseMapper())

const interaction = async (req, res) => {
  const { type, time, videoId } = req.body
  // model.storeInteractionLog(req.params.)
  console.log('interaction')
  console.log(req.body)
  console.log(type)
  console.log(time)
  console.log(videoId)
  res.send('ok')
}

const pageTransition = (req, res) => {
  console.log('page transition')

  const host = req.headers.host
  const userId = req.session.authUser ? req.session.authUser.userId : null
  const log = { ...req.body, userId, host }

  model.storePageTransitionLog(log)

  res.send('ok')
}

module.exports = { interaction, pageTransition }
