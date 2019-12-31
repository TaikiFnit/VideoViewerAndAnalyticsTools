const DatabaseMapper = require('../../database/mapper')
const Model = require('./model')

const model = new Model(new DatabaseMapper())

const getSectioning = async (req, res) => {
  const sequenceId = req.params.sequenceId
  const sections = await model.getSections(sequenceId)

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

  res.send(sequence)
}

const getTargetUsers = async (req, res) => {
  const videoId = req.params.videoId
  const users = await model.getTargetUsers(videoId)

  res.send(users)
}

const startAnalyze = async (req, res) => {
  const {
    videoId,
    sectionSequenceId,
    visualTransitionSequenceId,
    selectedUsers
  } = req.body

  const result = await model.startAnalyze(
    videoId,
    sectionSequenceId,
    visualTransitionSequenceId,
    selectedUsers
  )

  res.send(result)
}

module.exports = {
  getSectioning,
  storeSectioning,
  getSectioningSequence,
  getTargetUsers,
  startAnalyze
}
