const DatabaseMapper = require('../../database/mapper')
const Model = require('./model')

const model = new Model(new DatabaseMapper())

const storeSectioning = async (req, res) => {
  const name = req.body.name
  const type = req.body.type
  const videoId = req.body.videoId
  const sections = req.body.sections
  await model.storeSections(videoId, name, type, sections)

  res.send('ok')
}

module.exports = { storeSectioning }
