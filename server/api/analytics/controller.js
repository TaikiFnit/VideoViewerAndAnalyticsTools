const DatabaseMapper = require('../../database/mapper')
const Model = require('./model')

const model = new Model(new DatabaseMapper())

const getSectioning = async (req, res) => {
  const sequenceId = req.params.sequenceId
  console.log('getsections')
  console.log(sequenceId)
  const sections = await model.getSections(sequenceId)
  console.log(sections)

  res.send(sections)
}

const storeSectioning = async (req, res) => {
  const name = req.body.name
  const type = req.body.type
  const videoId = req.body.videoId
  const sections = req.body.sections
  await model.storeSections(videoId, name, type, sections)

  res.send('ok')
}

const getSectioningSequence = async (req, res) => {
  const videoId = req.params.videoId
  const sequence = await model.getSectionSequence(videoId)
  console.log(sequence)

  res.send(sequence)
}

module.exports = { getSectioning, storeSectioning, getSectioningSequence }
