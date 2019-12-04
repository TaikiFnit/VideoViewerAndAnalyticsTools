const Model = require('./model')
const DatabaseMapper = require('./database_mapper')

const model = new Model(new DatabaseMapper())

const index = async (req, res) => {
  console.log('index')
  const result = await model.all()
  res.send(result)
}

const show = async (req, res) => {
  console.log('show')
  const result = await model.find(req.params.lesson_id)
  res.send(result)
}

module.exports = { index, show }
