const DatabaseMapper = require('../../database/mapper')
const Model = require('./model')

const model = new Model(new DatabaseMapper())

const index = async (req, res) => {
  const result = await model.all()
  res.send(result)
}

const show = async (req, res) => {
  const result = await model.findBySlug(req.params.lessonSlug)
  res.send(result)
}

const video = async (req, res) => {
  const result = await model.findVideoByOrder(
    req.params.lessonSlug,
    req.params.videoOrder
  )
  res.send(result)
}

module.exports = { index, show, video }
