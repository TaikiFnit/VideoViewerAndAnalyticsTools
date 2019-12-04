const DatabaseMapper = require('../../database/mapper')
const Model = require('./model')

const model = new Model(new DatabaseMapper())

const show = async (req, res) => {
  console.log('video show')
  const result = await model.find(req.params.videoId)
  res.send(result)
}

module.exports = { show }
