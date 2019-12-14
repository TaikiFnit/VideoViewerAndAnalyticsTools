const DatabaseMapper = require('../../database/mapper')
const Model = require('./model')

const model = new Model(new DatabaseMapper())

const show = async (req, res) => {
  const result = await model.find(req.params.videoId)
  res.send(result)
}

module.exports = { show }
