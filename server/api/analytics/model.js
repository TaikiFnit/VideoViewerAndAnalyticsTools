module.exports = class AnalyticsModel {
  constructor(databaseMapper) {
    this.databaseMapper = databaseMapper
  }

  async storeSections(videoId, name, type, sections) {
    const sequenceId = await this.databaseMapper.storeSectionSequence(name, type)
    console.log(sections)
    sections.forEach((section) => {
      this.databaseMapper.storeSection(videoId, sequenceId, section)
    })
  }
}
