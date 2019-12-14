const DatabaseMapper = require('../../database/mapper')
const Model = require('./model')

const model = new Model(new DatabaseMapper())

const login = async (req, res) => {
  const user = await model.find(req.body.username)
  if (user && user.password === req.body.password) {
    req.session.authUser = { username: user.name, userId: user.id }
    return res.json({ username: user.name })
  } else {
    return res.sendStatus(401)
  }
}

const logout = (req, res) => {
  delete req.session.authUser
  res.json({ ok: true })
}

module.exports = { login, logout }
