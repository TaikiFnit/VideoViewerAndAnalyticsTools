const DatabaseMapper = require('../../database/mapper')
const Model = require('./model')

const model = new Model(new DatabaseMapper())

const index = async (req, res) => {
  const result = await model.all()
  res.send(result)
}

const show = async (req, res) => {
  const result = await model.find(req.params.videoId)
  res.send(result)
}

const analyzable = async (req, res) => {
  const result = await model.findAllAnalyzableVideos()
  res.send(result)
}

module.exports = { index, show, analyzable }
