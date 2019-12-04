const Model = require('./model')
const DatabaseMapper = require('./database_mapper')

const model = new Model(new DatabaseMapper())

const index = async (req, res) => {
  console.log('index')
  const result = await model.test()
  res.send(result)
}

const show = (req, res) => {
  console.log('show')
  res.send(req.params.lesson_name)
}

module.exports = { index, show }
