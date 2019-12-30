module.exports = class AnalyticsModel {
  constructor(databaseMapper) {
    this.databaseMapper = databaseMapper
  }

  async getSections(sequenceId) {
    const sections = await this.databaseMapper.fetchSectionsBy(sequenceId)
    return sections
  }

  async storeSections(videoId, name, type, sections) {
    const sequenceId = await this.databaseMapper.storeSectionSequence(
      name,
      type,
      videoId
    )
    sections.forEach((section) => {
      this.databaseMapper.storeSection(videoId, sequenceId, section)
    })
  }

  async getSectionSequence(videoId) {
    const sectionSequences = await this.databaseMapper.fetchSectionSequenceBy(
      videoId,
      'sections'
    )

    const visualTransitionSequences = await this.databaseMapper.fetchSectionSequenceBy(
      videoId,
      'visualTransitions'
    )

    return {
      sectionSequences,
      visualTransitionSequences
    }
  }

  async getSectionSequences() {
    const sectionSequences = await this.databaseMapper.fetchSectionSequencesOf(
      'sections'
    )
    // const visualTransitionSequences = await this.databaseMapper.fetchSectionSequencesOf()

    return sectionSequences
  }
}
