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
}

module.exports = { interaction }
